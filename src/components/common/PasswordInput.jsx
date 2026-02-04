import React, { useId, useState } from 'react';

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  disabled,
  id,
  name,
  className = '',
}) {
  const reactId = useId();
  const inputId = id || `password-${reactId}`;
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-muted-gray mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-brand-stroke bg-brand-fill/60 text-pure-white placeholder-muted-gray/60 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9 text-sm sm:text-base"
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-gray hover:text-pure-white transition-colors focus:outline-none focus-visible:text-pure-white"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            // Eye-off
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.64-1.52 1.57-2.9 2.73-4.06" />
              <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.05 11.05 0 0 1-2.06 3.06" />
              <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            // Eye
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
