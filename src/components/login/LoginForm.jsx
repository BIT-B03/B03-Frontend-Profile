import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login, SetAuthToken } from '../../api/api';
import ForgotPasswordInline from '../ResetPassword/ForgotPasswordInline';
import PasswordInput from '../common/PasswordInput';

const AUTH_TOKEN_KEY = 'auth_access_token';

export default function LoginForm() {
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
      if (token) {
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch {
          // ignore storage errors
        }
        SetAuthToken(token);
      }

      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || 'Gagal login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h1 className="text-lg sm:text-2xl font-semibold text-pure-white">
          Welcome back. Continue building with BIT-B03.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-gray">
          Sign in to access members, projects, and your account.
        </p>
      </div>

      <div className="glass-white rounded-2xl shadow-2xl p-4 sm:p-8">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm text-muted-gray mb-1">Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              autoComplete="username"
              required
            />
          </div>

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-flash w-full rounded-lg bg-brand-getstarted px-4 py-2 text-sm sm:text-base text-pure-white shadow disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Log in'}
            </button>
          </div>

          <div className="pt-1">
            <ForgotPasswordInline />
          </div>
        </form>
      </div>
    </div>
  );
}
