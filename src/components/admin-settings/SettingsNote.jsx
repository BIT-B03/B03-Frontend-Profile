import React from 'react';

export default function SettingsNote() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-bg/40 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-xs sm:text-sm leading-relaxed text-muted-gray">
        <span className="font-semibold text-pure-white">Note:</span> Changes take effect immediately. Use GET to retrieve current values from the server, and SET to save your changes.
      </p>
    </div>
  );
}
