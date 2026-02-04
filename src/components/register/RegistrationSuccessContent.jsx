import React from 'react';

const RegistrationSuccessContent = ({ onGoHome, email }) => {
  return (
    <section className="relative w-full text-center">
      {/* Decorative background (no content container/card) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-64px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-brand-24e1c9/20 blur-3xl" />
        <div className="absolute right-[-80px] top-1/4 h-[260px] w-[260px] rounded-full bg-brand-1f4c74/25 blur-3xl" />
        <div className="absolute left-[-90px] bottom-[-60px] h-[320px] w-[320px] rounded-full bg-brand-24e1c9/10 blur-3xl" />
      </div>

      {/* Community Logo */}
      <div className="mb-6 sm:mb-8 flex justify-center">
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-brand-24e1c9/20 blur-xl" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-brand-24e1c9 to-brand-1f4c74 flex items-center justify-center shadow-xl ring-1 ring-pure-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 sm:w-12 sm:h-12 text-pure-white"
              aria-hidden="true"
            >
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="mb-5 sm:mb-6 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-24e1c9/25 bg-brand-fill/30 px-4 py-2 text-sm text-brand-24e1c9 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-brand-24e1c9 shadow-[0_0_0_4px_rgba(36,225,201,0.12)] motion-safe:animate-pulse" />
          Under review by our team
        </div>
      </div>

      {/* Text only (no card/container) */}
      <h1 className="text-3xl sm:text-5xl font-bold text-pure-white tracking-tight drop-shadow-sm">
        Registration{' '}
        <span className="bg-gradient-to-r from-brand-24e1c9 to-pure-white bg-clip-text text-transparent">
          Received!
        </span>
      </h1>

      <p className="mt-5 sm:mt-6 mx-auto max-w-3xl text-base sm:text-xl leading-relaxed text-pure-white/80">
        Thank you for joining us. Your account is currently being reviewed by our team to ensure the best experience.
        We’ll notify you via email as soon as everything is ready! Please check your email at{' '}
        <span className="bg-gradient-to-r from-brand-24e1c9 to-pure-white bg-clip-text text-transparent font-semibold">
          {email || 'your email'}
        </span>{' '}
        for further updates.
      </p>

      <div className="mt-8 sm:mt-10 flex justify-center">
        <button
          type="button"
          onClick={onGoHome}
          className="group btn-flash w-full sm:w-auto rounded-xl bg-brand-getstarted px-8 py-3 text-base sm:text-lg text-pure-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-2">
            Back to Home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M13.5 4.5a.75.75 0 000 1.5h4.19L9.22 14.47a.75.75 0 101.06 1.06L18.75 7.06v4.19a.75.75 0 001.5 0V4.5h-6.75z" />
              <path d="M5.25 7.5A2.25 2.25 0 017.5 5.25h2.25a.75.75 0 010 1.5H7.5a.75.75 0 00-.75.75v9.75c0 .414.336.75.75.75h9.75a.75.75 0 00.75-.75V15a.75.75 0 011.5 0v2.25A2.25 2.25 0 0117.25 19.5H7.5a2.25 2.25 0 01-2.25-2.25V7.5z" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
};

export default RegistrationSuccessContent;
