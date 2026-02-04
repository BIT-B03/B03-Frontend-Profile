import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ForgotPassword, ResetPassword, VerifyResetToken } from '../api/api';
import { toErrorPageState } from '../utils/errorState';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export default function useResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  const pathname = location?.pathname || '';
  const search = location?.search || '';
  const hash = location?.hash || '';

  const token = query.get('token') || '';
  const emailFromQuery = query.get('email') || '';

  // Request reset link
  const [email, setEmail] = useState(emailFromQuery);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  // Token verification + reset
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null | boolean
  const [tokenMessage, setTokenMessage] = useState('');

  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    let cancelled = false;

    const runVerify = async () => {
      if (!token) {
        setTokenValid(null);
        setTokenMessage('');
        return;
      }

      try {
        setVerifyLoading(true);
        setTokenMessage('');
        const res = await VerifyResetToken(token);
        if (cancelled) return;

        const valid = Boolean(res?.valid);
        if (!valid) {
          // Security + UX: redirect to a unified error page (no token status UI).
          navigate('/error', {
            replace: true,
            state: toErrorPageState(null, {
              context: 'VerifyResetToken',
              status: 400,
              code: 'INVALID_RESET_TOKEN',
              title: 'Link reset password tidak valid',
              message:
                res?.message ||
                'Link reset password tidak valid atau telah kedaluwarsa. Silakan minta link reset password baru.',
              details: res?.message || 'Token reset password ditolak oleh server.',
              from: {
                pathname: pathname || '/reset-password',
                search: search || '',
                hash: hash || '',
              },
              secondaryCta: {
                label: 'Minta link baru',
                to: '/reset-password',
                replace: true,
              },
              allowGoBack: true,
            }),
          });
          return;
        }

        setTokenValid(true);
        setTokenMessage(res?.message || 'Token valid.');
      } catch (err) {
        if (cancelled) return;
        // Redirect to unified error page for verification failures.
        navigate('/error', {
          replace: true,
          state: toErrorPageState(err, {
            context: 'VerifyResetToken',
            title: 'Gagal memverifikasi link reset',
            message:
              err?.message ||
              'Kami tidak dapat memverifikasi link reset password Anda. Silakan minta link baru dan coba lagi.',
            from: {
              pathname: pathname || '/reset-password',
              search: search || '',
              hash: hash || '',
            },
            secondaryCta: {
              label: 'Minta link baru',
              to: '/reset-password',
              replace: true,
            },
            allowGoBack: true,
          }),
        });
      } finally {
        if (!cancelled) setVerifyLoading(false);
      }
    };

    runVerify();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, pathname, search, hash]);

  const requestResetLink = async ({ email: emailArg } = {}) => {
    const target = String(emailArg ?? email).trim();
    setRequestError('');
    setRequestSuccess('');

    if (!target) {
      setRequestError('Email wajib diisi.');
      return { ok: false };
    }
    if (!isValidEmail(target)) {
      setRequestError('Format email tidak valid.');
      return { ok: false };
    }

    try {
      setRequestSubmitting(true);
      const res = await ForgotPassword(target);
      setRequestSuccess(
        res?.message ||
          'Permintaan reset password telah kami terima. Silakan periksa email Anda dalam beberapa menit.'
      );
      // Keep email in URL for refresh/back
      navigate(`/reset-password?email=${encodeURIComponent(target)}`, { replace: true });
      return { ok: true };
    } catch (err) {
      setRequestError(err?.message || 'Gagal mengirim permintaan reset password.');
      return { ok: false };
    } finally {
      setRequestSubmitting(false);
    }
  };

  const submitNewPassword = async ({ newPassword } = {}) => {
    const password = String(newPassword || '');
    setResetError('');
    setResetSuccess('');

    if (!token) {
      setResetError('Token reset tidak ditemukan. Silakan buka link dari email Anda.');
      return { ok: false };
    }
    if (tokenValid === false) {
      navigate('/error', {
        replace: true,
        state: toErrorPageState(null, {
          context: 'ResetPassword',
          status: 400,
          code: 'INVALID_RESET_TOKEN',
          title: 'Link reset password tidak valid',
          message: 'Link reset password tidak valid atau telah kedaluwarsa. Silakan minta link reset password baru.',
          from: {
            pathname: pathname || '/reset-password',
            search: search || '',
            hash: hash || '',
          },
          secondaryCta: {
            label: 'Minta link baru',
            to: '/reset-password',
            replace: true,
          },
          allowGoBack: true,
        }),
      });
      return { ok: false };
    }
    if (!password || password.length < 6) {
      setResetError('Password baru minimal 6 karakter.');
      return { ok: false };
    }

    try {
      setResetSubmitting(true);
      const res = await ResetPassword({ token, new_password: password });
      setResetSuccess(res?.message || 'Password berhasil direset.');
      return { ok: true };
    } catch (err) {
      setResetError(err?.message || 'Gagal reset password.');
      return { ok: false };
    } finally {
      setResetSubmitting(false);
    }
  };

  return {
    token,
    email,
    setEmail,

    requestSubmitting,
    requestError,
    requestSuccess,
    requestResetLink,

    verifyLoading,
    tokenValid,
    tokenMessage,

    resetSubmitting,
    resetError,
    resetSuccess,
    submitNewPassword,
  };
}
