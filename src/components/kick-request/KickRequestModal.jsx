import React from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';

export default function KickRequestModal({
    isOpen,
    onClose,
    onConfirm,
    reason,
    onReasonChange,
    count,
    isSubmitting,
    error,
}) {
    const memberLabel = count === 1 ? '1 member' : `${count} members`;

    return (
        <BlurFrame isOpen={isOpen} onClose={onClose}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-stroke/60">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-pure-white tracking-tight">Confirm Removal</h2>
                    </div>
                </div>
                <CloseButton onClick={onClose} disabled={isSubmitting} />
            </div>

            <div className="px-6 py-5 space-y-5">
                <div className="rounded-2xl bg-[rgba(180,150,255,0.18)] border border-[rgba(170,140,255,0.52)] px-4 py-3 text-sm text-pure-white flex gap-3">
                    <span>ⓘ</span>
                    <p>
                        You are about to remove <span className="font-semibold">{memberLabel}</span> from the
                        organizational lab.
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <label htmlFor="kick-reason" className="text-sm font-medium text-pure-white">
                            Reason for Kick <span className="text-filter-red-border">*</span>
                        </label>
                    </div>
                    <textarea
                        id="kick-reason"
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        placeholder="e.g., Policy violation, inactivity, or project completion..."
                        className="w-full min-h-[120px] rounded-2xl border border-brand-stroke bg-brand-fill/60 px-4 py-3 text-sm sm:text-base text-pure-white placeholder:text-muted-gray/70 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/70 focus:border-brand-24e1c9 hover:border-brand-24e1c9/50 transition-colors duration-300 resize-y"
                        disabled={isSubmitting}
                    />
                    {error && (
                        <p className="text-sm text-filter-red-border mt-1">{error}</p>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-end gap-3 bg-brand-fill/40 border-t border-brand-stroke/60">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-brand-stroke text-pure-white text-sm sm:text-base hover:bg-white/5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-brand-24e1c9 text-dark-bg font-semibold text-sm sm:text-base shadow-[0_12px_35px_rgba(36,225,201,0.2)] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Confirm Kick'}
                </button>
            </div>
        </BlurFrame>
    );
}
