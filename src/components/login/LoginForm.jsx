import React from 'react';
import ForgotPasswordInline from '../ResetPassword/ForgotPasswordInline';
import PasswordInput from '../common/PasswordInput';
import useLogin from '../../hooks/useLogin';

export default function LoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    submitting,
    errorMessage,
    handleSubmit,
  } = useLogin();

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
