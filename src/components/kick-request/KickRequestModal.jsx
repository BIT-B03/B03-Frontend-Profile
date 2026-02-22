/* eslint-disable no-unused-vars */
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <motion.div
                        className="w-full max-w-xl rounded-3xl bg-dark-bg border border-brand-stroke shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-stroke/60">
                            <h2 className="text-lg sm:text-xl font-semibold text-pure-white">Confirm Removal</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 rounded-lg text-muted-gray hover:text-pure-white hover:bg-white/5 transition"
                                aria-label="Close"
                                disabled={isSubmitting}
                            >
                                <span className="text-xl leading-none">×</span>
                            </button>
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
                                    className="w-full min-h-[120px] rounded-2xl border border-brand-stroke bg-brand-fill/60 px-4 py-3 text-sm sm:text-base text-pure-white placeholder:text-muted-gray/70 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/70 focus:border-brand-24e1c9 resize-y"
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
