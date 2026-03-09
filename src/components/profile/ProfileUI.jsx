import React from 'react';

/** Card container */
export const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl p-6 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.065)',
      border: '1px solid rgba(255,255,255,0.13)',
      backdropFilter: 'blur(20px)',
    }}
  >
    {children}
  </div>
);

/** Section header row */
export const SectionHead = ({ title, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <span
        className="block w-[3px] h-4 rounded-full flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, #24e1c9, #1a9f8e)' }}
      />
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-pure-white">{title}</h3>
    </div>
    {action}
  </div>
);

/** Edit trigger button */
export const EditTrigger = ({ onClick, disabled, label = 'Edit' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
      border border-white/20 bg-white/[0.07] text-pure-white/75
      hover:text-pure-white hover:border-brand-24e1c9/50 hover:bg-brand-24e1c9/[0.09]
      transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
  >
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.414-6.414a2 2 0 012.828 0l1.172 1.172a2 2 0 010 2.828L13 14l-4 1 1-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5" />
    </svg>
    Edit
  </button>
);

/** Save / Cancel row */
export const SectionActions = ({ onSave, onCancel, saving, saveLabel = 'Save Changes' }) => (
  <div className="flex items-center gap-3 pt-1">
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-getstarted text-pure-white
        hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
    >
      {saving ? (
        <span className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="3" strokeDasharray="31 63" />
          </svg>
          Saving…
        </span>
      ) : saveLabel}
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 rounded-xl text-sm font-medium border border-white/20 text-pure-white/70
        hover:text-pure-white hover:border-white/35 transition-all duration-150"
    >
      Cancel
    </button>
  </div>
);

/** Field label wrapper */
export const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-semibold text-pure-white/65 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

export const inputCls =
  'w-full rounded-xl bg-white/[0.07] border border-white/[0.18] text-pure-white text-sm px-4 py-2.5 ' +
  'placeholder-pure-white/40 focus:outline-none focus:border-brand-24e1c9/60 ' +
  'focus:ring-1 focus:ring-brand-24e1c9/25 transition-all duration-150';

/** Social icon via SVG mask */
export const SocialIcon = ({ platform }) => (
  <span
    className="block w-[18px] h-[18px] flex-shrink-0"
    style={{
      WebkitMaskImage: `url(/svg/${platform}.svg)`,
      maskImage: `url(/svg/${platform}.svg)`,
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain', maskSize: 'contain',
      WebkitMaskPosition: 'center', maskPosition: 'center',
      backgroundColor: 'currentColor',
    }}
  />
);

/** Localised toast */
export const Toast = ({ type, message, onDismiss }) => {
  if (!message) return null;
  const ok = type === 'success';
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm mb-4
        ${ok ? 'border-brand-24e1c9/30 bg-brand-24e1c9/[0.07] text-brand-24e1c9'
             : 'border-stat-red/30 bg-stat-red/[0.07] text-stat-red'}`}
    >
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity leading-none">✕</button>
    </div>
  );
};
