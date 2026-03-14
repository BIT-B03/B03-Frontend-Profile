import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login, SetAuthToken } from '../api/api';

const AUTH_TOKEN_KEY = 'auth_access_token';

export default function useLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    if (!username.trim()) return 'Username wajib diisi.';
    if (!password) return 'Password wajib diisi.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const msg = validate();
    if (msg) {
      setErrorMessage(msg);
      return;
    }

    try {
      setSubmitting(true);
      const res = await Login({ username: username.trim(), password });

      const token = res?.access_token;
      const role = res?.role;
      const position = res?.position;
      const loginUsername = res?.data?.username ?? res?.username ?? username.trim();
      const loginHashedId = res?.data?.hashed_id ?? res?.hashed_id ?? null;
      if (token) {
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          if (loginUsername) {
            localStorage.setItem('username', loginUsername);
          }
          if (loginHashedId) {
            localStorage.setItem('hashed_id', loginHashedId);
          }
          if (role) {
            localStorage.setItem('role', role);
          }
          if (position) {
            localStorage.setItem('position', position);
          }
        } catch {
          // ignore storage errors
        }
        SetAuthToken(token);
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || 'Gagal login.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    submitting,
    errorMessage,
    handleSubmit,
  };
}
