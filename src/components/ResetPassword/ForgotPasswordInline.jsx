import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordInline({ className = '' }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <a
          href="/reset-password"
          onClick={handleClick}
          className="text-sm text-brand-24e1c9 hover:underline"
        >
          Forgot Password?
        </a>
        <span className="text-xs text-muted-gray sm:text-right">
          Reset password via email link.
        </span>
      </div>
    </div>
  );
}
