import React from 'react';

export default function ErrorDetailsPanel({ details, showDetails, onToggle }) {
  if (!details) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-brand-24e1c9 hover:underline"
      >
        {showDetails ? 'Sembunyikan detail' : 'Lihat detail'}
      </button>

      {showDetails && (
        <div className="mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <pre className="whitespace-pre-wrap break-words text-xs text-pure-white/85 font-mono">{details}</pre>
        </div>
      )}
    </div>
  );
}
