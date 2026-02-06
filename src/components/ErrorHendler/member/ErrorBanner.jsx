import React from 'react';

const ErrorBanner = ({ message, onRetry }) => (
    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-red-200 text-sm sm:text-base">{message}</p>
        <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pure-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
            Retry
        </button>
    </div>
);

export default ErrorBanner;
