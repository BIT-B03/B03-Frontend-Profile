import React from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';

export default function ConfirmPelamarModal({
    isOpen,
    onClose,
    onConfirm,
    actionType,
    pelamar,
    isSubmitting,
    error,
}) {
    const isAccept = actionType === 'confirm';
    const name = pelamar?.name ?? 'this applicant';

    return (
        <BlurFrame isOpen={isOpen} onClose={onClose}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-stroke/60">
                <h2 className="text-xl sm:text-2xl font-bold text-pure-white tracking-tight">
                    {isAccept ? 'Accept Applicant' : 'Reject Applicant'}
                </h2>
                <CloseButton onClick={onClose} disabled={isSubmitting} />
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
                {isAccept ? (
                    <div className="rounded-2xl bg-[rgba(36,225,201,0.1)] border border-[rgba(36,225,201,0.35)] px-4 py-3 text-sm text-pure-white flex gap-3">
                        <span>✓</span>
                        <p>
                            You are about to <span className="font-semibold text-brand-24e1c9">accept</span>{' '}
                            <span className="font-semibold">{name}</span> as a member of the lab. A new user
                            account will be created and they will be notified by email.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-[rgba(220,38,38,0.1)] border border-filter-red-border/40 px-4 py-3 text-sm text-pure-white flex gap-3">
                        <span>⚠</span>
                        <p>
                            You are about to <span className="font-semibold text-filter-red-border">reject</span>{' '}
                            <span className="font-semibold">{name}</span>. They will be notified by email that
                            their application was not accepted.
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-filter-red-border">{error}</p>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-end gap-3 bg-brand-fill/40 border-t border-brand-stroke/60">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-brand-stroke text-pure-white text-sm sm:text-base hover:bg-white/5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl font-semibold text-sm sm:text-base transition disabled:opacity-60 disabled:cursor-not-allowed ${
                        isAccept
                            ? 'bg-brand-24e1c9 text-dark-bg shadow-[0_12px_35px_rgba(36,225,201,0.2)] hover:opacity-90'
                            : 'bg-filter-red-border text-pure-white hover:opacity-90'
                    }`}
                >
                    {isSubmitting
                        ? 'Processing...'
                        : isAccept
                        ? 'Yes, Accept'
                        : 'Yes, Reject'}
                </button>
            </div>
        </BlurFrame>
    );
}
