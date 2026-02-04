import React from 'react';

export default function ErrorActionButtons({
  primary,
  allowGoBack,
  secondary,
  showRetry,
  onGoPrimary,
  onGoBack,
  onGoSecondary,
  onRetry,
}) {
  return (
    <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
      <button
        type="button"
        onClick={onGoPrimary}
        className="btn-flash w-full sm:w-auto rounded-lg bg-brand-getstarted px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-sm md:text-base text-pure-white shadow whitespace-nowrap"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M3 11l9-8 9 8" />
            <path d="M9 22V12h6v10" />
          </svg>
          {primary.label || 'Ke Beranda'}
        </span>
      </button>

      {allowGoBack && (
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto rounded-lg border border-white/15 bg-brand-fill/20 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-sm md:text-base text-pure-white/90 hover:bg-brand-fill/30 transition whitespace-nowrap"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Kembali
          </span>
        </button>
      )}

      {secondary?.to && (
        <button
          type="button"
          onClick={onGoSecondary}
          className="w-full sm:w-auto rounded-lg border border-white/15 bg-brand-fill/20 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-sm md:text-base text-pure-white/90 hover:bg-brand-fill/30 transition whitespace-nowrap"
        >
          {secondary.label || 'Lanjut'}
        </button>
      )}

      {showRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto rounded-lg border border-white/15 bg-brand-fill/20 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-sm md:text-base text-pure-white/90 hover:bg-brand-fill/30 transition whitespace-nowrap"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 3v7h-7" />
            </svg>
            Retry
          </span>
        </button>
      )}
    </div>
  );
}
