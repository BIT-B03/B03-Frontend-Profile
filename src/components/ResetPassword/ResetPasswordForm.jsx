import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResetPassword from '../../hooks/useResetPassword';
import PasswordInput from '../common/PasswordInput';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const {
    token,
    email,
    setEmail,
    requestSubmitting,
    requestError,
    requestSuccess,
    requestResetLink,
    resetSubmitting,
    resetError,
    resetSuccess,
    submitNewPassword,
  } = useResetPassword();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localResetError, setLocalResetError] = useState('');

  const showSetNewPassword = Boolean(token);

  const handleRequest = async (e) => {
    e.preventDefault();
    await requestResetLink();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLocalResetError('');

    if (confirmPassword !== newPassword) {
      setLocalResetError('Konfirmasi password tidak sama.');
      return;
    }

    const result = await submitNewPassword({ newPassword });
    if (result?.ok) {
      setNewPassword('');
      setConfirmPassword('');
      // Optional: send user to login and remove token from history
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h1 className="text-lg sm:text-2xl font-semibold text-pure-white">
          {showSetNewPassword ? 'Set new password' : 'Reset your password'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-gray">
          {showSetNewPassword
            ? 'Masukkan password baru Anda. Token dari email akan terbaca otomatis.'
            : 'Masukkan email Anda untuk menerima link reset password.'}
        </p>
      </div>

      <div className="glass-white rounded-2xl shadow-2xl p-4 sm:p-8">
        {!showSetNewPassword && (
          <section>
            {requestError && (
              <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                {requestError}
              </div>
            )}

            {requestSuccess && (
              <div className="mb-3 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-emerald-100 text-sm">
                {requestSuccess}
              </div>
            )}

            <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full flex-1 rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={requestSubmitting}
                className="btn-flash w-full sm:w-auto rounded-lg bg-brand-getstarted px-4 py-2 text-sm sm:text-base text-pure-white shadow disabled:opacity-50"
              >
                {requestSubmitting ? 'Sending…' : 'Send link'}
              </button>
            </form>

            <p className="mt-2 text-xs text-muted-gray">
              Untuk keamanan, sistem akan menampilkan pesan sukses generik meskipun email tidak terdaftar (kecuali rate limit).
            </p>
          </section>
        )}

        {showSetNewPassword && (
          <section>
            {(localResetError || resetError) && (
              <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                {localResetError || resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="mb-3 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-emerald-100 text-sm">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-3 sm:space-y-4">
              <PasswordInput
                label="New Password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={resetSubmitting || !token}
                  className="btn-flash w-full rounded-lg bg-brand-getstarted px-4 py-2 text-sm sm:text-base text-pure-white shadow disabled:opacity-50"
                >
                  {resetSubmitting ? 'Resetting…' : 'Reset password'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
