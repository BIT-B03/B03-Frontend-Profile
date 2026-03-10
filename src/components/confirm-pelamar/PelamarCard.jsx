import React from 'react';

function getInitials(name) {
    if (!name) return '?';
    return String(name).trim().charAt(0).toUpperCase();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

export default function PelamarCard({ pelamar, onConfirm, onReject, onViewDetail }) {
    const initials = getInitials(pelamar?.name);
    const secondaryLine = [
        pelamar?.generation ? `Generation ${pelamar.generation}` : null,
        pelamar?.username ? `@${pelamar.username}` : null,
    ]
        .filter(Boolean)
        .join(' • ');

    return (
        <div className="group w-full rounded-2xl border border-brand-fill/60 bg-brand-fill/60 hover:border-brand-24e1c9/30 px-4 py-4 transition-all duration-300 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Top row: Avatar + Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-brand-fill/30 border border-brand-stroke grid place-items-center text-lg sm:text-xl font-semibold text-pure-white">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-semibold text-pure-white truncate group-hover:text-brand-24e1c9 transition-colors">
                        {pelamar.name}
                    </p>
                    <p className="text-sm text-muted-gray truncate">{secondaryLine || 'Applicant'}</p>
                    {pelamar.email && (
                        <p className="text-xs text-muted-gray/70 truncate mt-0.5">{pelamar.email}</p>
                    )}
                    {pelamar.created_at && (
                        <p className="text-xs text-muted-gray/50 mt-0.5">
                            Applied {formatDate(pelamar.created_at)}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                    type="button"
                    onClick={() => onViewDetail(pelamar)}
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors border-white/20 text-muted-gray hover:border-brand-24e1c9 hover:text-brand-24e1c9 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/60"
                    aria-label="View detail & CV"
                    title="View detail & CV"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
