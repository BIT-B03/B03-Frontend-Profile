import React from 'react';
import { sanitizeText } from '../../../utils/errorState';

export default function ErrorTerminalCard({
  terminalTitle,
  status,
  timestampText,
  code,
  fromPathname,
  requestId,
  actionLine,
  metaLine,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 shadow-inner overflow-hidden">
      {/* Terminal top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/25">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
          </div>

          <div className="text-xs text-muted-gray font-mono truncate">
            <span className="text-brand-24e1c9">&gt;_</span> {sanitizeText(terminalTitle, { maxLen: 60 })}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-70" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
        </div>
      </div>

      {/* Terminal body */}
      <div className="px-4 py-4 font-mono text-xs sm:text-sm">
        <div className="space-y-1">
          <div className="text-red-300">
            <span className="text-red-400">ERROR:</span> {status || 0}
          </div>
          <div className="text-pure-white/80">
            <span className="text-muted-gray">└</span> Status: <span className="text-pure-white/90">Failed</span>
          </div>
          {timestampText && (
            <div className="text-pure-white/70">
              <span className="text-muted-gray">└</span> Timestamp:{' '}
              <span className="text-pure-white/90">{timestampText}</span>
            </div>
          )}
          <div className="text-pure-white/70">
            <span className="text-muted-gray">└</span> Code:{' '}
            <span className="text-pure-white/90">{sanitizeText(code, { maxLen: 80 })}</span>
          </div>
          {fromPathname && (
            <div className="text-pure-white/70">
              <span className="text-muted-gray">└</span> Path:{' '}
              <span className="text-pure-white/90">{sanitizeText(fromPathname, { maxLen: 180 })}</span>
            </div>
          )}
          {requestId && (
            <div className="text-pure-white/70">
              <span className="text-muted-gray">└</span> RequestId:{' '}
              <span className="text-pure-white/90">{sanitizeText(requestId, { maxLen: 120 })}</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-brand-24e1c9">&gt; {actionLine}</div>

        {/* Keep old metaLine available as a compact string (optional) */}
        {metaLine && <div className="mt-2 text-muted-gray/80 text-[11px] sm:text-xs">{metaLine}</div>}
      </div>
    </div>
  );
}
