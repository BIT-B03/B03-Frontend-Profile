import React, { useState } from 'react';

export default function SettingsCard({
  title,
  description,
  label,
  value,
  onChange,
  onGet,
  onSet,
  isFetching = false,
  isSaving = false,
  accentClass = 'bg-brand-24e1c9',
  inputType = 'number',
}) {
  const [isSaved, setIsSaved] = useState(false);

  const getGradientColor = () => {
    if (accentClass === 'yellow') {
      return 'from-stat-yellow/30 via-stat-yellow/60 via-stat-yellow/80 to-stat-yellow';
    }
    return 'from-stat-blue/40 via-stat-blue/50 to-stat-blue/80';
  };

  const getAccentDot = () => {
    if (accentClass === 'yellow') {
      return 'bg-stat-yellow';
    }
    return 'bg-stat-blue';
  };

  const handleSetClick = () => {
    onSet?.();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="relative rounded-xl shadow-2xl p-6 sm:p-7 border-[0.5px] border-white/10 hover:border-white/50 transition-all duration-300 group bg-white/3 backdrop-blur-sm overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColor()} opacity-20 pointer-events-none rounded-lg`} />

      <div className="relative z-10 grid grid-cols-[auto_1fr] items-start gap-4">
        <div className="flex-shrink-0 relative mt-2.5">
          <span className={`block h-2 w-2 rounded-full ${getAccentDot()} shadow-sm`} />
          <span className={`absolute inset-0 h-2 w-2 rounded-full ${getAccentDot()} opacity-40 animate-pulse`} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-pure-white mb-2 tracking-tight">{title}</h3>
        </div>
      </div>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-gray/90">{description}</p>
      ) : null}

      <div className="mt-8 space-y-3">
        <label className="block text-sm font-medium text-pure-white tracking-wide">{label}</label>
        <div className="relative">
          <input
            type={inputType}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            className="w-full rounded-lg border border-brand-stroke/60 bg-brand-fill/50 backdrop-blur-sm text-pure-white placeholder-muted-gray/50 px-4 py-3 text-base transition-colors duration-150 ease-in-out hover:bg-brand-fill/70 focus:bg-brand-fill/60 active:bg-brand-fill/60 focus:outline-none focus-visible:ring-0 focus:ring-0 appearance-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            placeholder={inputType === 'number' ? 'Enter number...' : 'Enter value...'}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGet}
          disabled={isFetching}
          className={`relative inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-sm font-medium text-white transition-all before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r ${accentClass === 'yellow'
            ? 'before:from-stat-yellow/50'
            : 'before:from-stat-blue/50'
            } before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:border-white/10 hover:bg-gray-700/30 hover:before:opacity-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="relative z-10">Get Value</span>
        </button>
        <button
          type="button"
          onClick={handleSetClick}
          disabled={isSaving}
          className={`relative inline-flex h-10 items-center justify-center rounded-lg px-7 text-sm font-semibold text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${accentClass === 'yellow'
            ? 'bg-gradient-to-r from-stat-yellow to-amber-700 hover:shadow-stat-yellow/10'
            : 'bg-gradient-to-r from-stat-blue to-cyan-600 hover:shadow-stat-blue/10'
            } ${isSaved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
        >
          <span className="relative z-10">{isSaved ? '✓ Saved!' : 'Set Value'}</span>
        </button>
      </div>
    </div>
  );
}
