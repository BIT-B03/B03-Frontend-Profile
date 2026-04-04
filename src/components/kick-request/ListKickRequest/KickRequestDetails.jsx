import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KickRequestDetails({
    expanded,
    reason,
    approvedBy,
    rejectedBy,
    onApprove,
    onReject,
    approveDisabled,
    rejectDisabled,
}) {
    const MotionDiv = motion.div;
    return (
        <AnimatePresence initial={false}>
            {expanded && (
                <MotionDiv
                    key="details"
                    initial={{ opacity: 0, scaleY: 0.8 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.8 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'top' }}
                    className="border-t border-white/10 bg-[#0f141d] shadow-[0_35px_120px_rgba(0,0,0,0.45)] px-6 py-6 space-y-6"
                >
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-pure-white">Reason for Removal</p>
                        <p className="text-sm text-muted-gray leading-relaxed">
                            {reason || 'No reason provided'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-pure-white">Approved By</p>
                        {approvedBy.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {approvedBy.map((name) => (
                                    <span
                                        key={name}
                                        className="rounded-full border border-brand-24e1c9/40 bg-brand-24e1c9/10 text-brand-24e1c9 px-3 py-1 text-xs font-medium"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-emerald-100">No approvals recorded yet.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-pure-white">Rejected By</p>
                        {rejectedBy.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {rejectedBy.map((name) => (
                                    <span
                                        key={name}
                                        className="rounded-full border border-filter-red-border/40 bg-[rgba(220,38,38,0.1)] text-pure-white px-3 py-1 text-xs font-medium"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-emerald-100">No rejections recorded yet.</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onApprove}
                            disabled={approveDisabled || rejectDisabled}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-24e1c9 py-1.5 text-sm font-semibold text-dark-bg shadow-[0_10px_30px_rgba(36,225,201,0.2)] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Approve Request
                        </button>
                        <button
                            type="button"
                            onClick={onReject}
                            disabled={approveDisabled || rejectDisabled}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] border border-filter-red-border/40 bg-[rgba(220,38,38,0.1)] py-1.5 text-sm font-semibold text-pure-white shadow-[0_10px_30px_rgba(220,38,38,0.15)] hover:bg-[rgba(220,38,38,0.2)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Reject Request
                        </button>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
}
