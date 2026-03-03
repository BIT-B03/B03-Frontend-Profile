/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KickRequestStatusBadge from './KickRequestStatusBadge';
import useKickRequestCardMeta from '../../../hooks/useKickRequestCardMeta';
import KickRequestApprovalModal from './KickRequestApprovalModal';
import { approveKickRequest } from '../../../api/api';

const chevronDownIcon = '/svg/icon-chevron-down.svg';

function ApprovalChip({ label, active }) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1 text-xs font-semibold tracking-wide ${active
                ? 'border-brand-24e1c9/40 bg-brand-24e1c9/10 text-brand-24e1c9'
                : 'border-white/12 bg-white/5 text-muted-gray'
                }`}
        >
            {active ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            {label}
        </span>
    );
}

const MetaItem = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-1.5 text-xs pt-1 text-muted-gray">
        <Icon className="4 h-4" />
        <span className="truncate text-xs">{children}</span>
    </div>
);

const CalendarIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const CheckIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function KickRequestCard({ request, onApproved }) {
    const [expanded, setExpanded] = useState(false);
    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [duplicateError, setDuplicateError] = useState(null);
    const {
        approvedBy,
        createdAt,
        avatarSrc,
        initials,
    } = useKickRequestCardMeta(request);
    const [status, setStatus] = useState(request?.status || '');
    const [approvalSubmitting, setApprovalSubmitting] = useState(false);

    const toggleLabel = expanded ? 'Hide Details' : 'View Details';

    const handleApproveClick = () => {
        const currentUser = typeof window !== 'undefined' ? (localStorage.getItem('username') || '').trim().toLowerCase() : '';
        const approvers = Array.isArray(approvedBy) ? approvedBy.map((n) => (n || '').trim().toLowerCase()) : [];
        if (currentUser && approvers.includes(currentUser)) {
            setDuplicateError('You have already approved this member.');
            setTimeout(() => setDuplicateError(null), 5000);
            return;
        }

        setApprovalModalOpen(true);
    };

    const handleCancelApproval = () => {
        setApprovalModalOpen(false);
    };

    const handleConfirmApproval = async () => {
        if (!request?.hashed_id) return setApprovalModalOpen(false);
        setApprovalSubmitting(true);
        try {
            await approveKickRequest(request.hashed_id);
            setStatus('approved');
            setApprovalModalOpen(false);
            if (typeof onApproved === 'function') {
                try {
                    onApproved();
                } catch (e) {
                    console.warn('onApproved callback failed', e);
                }
            }
        } catch (err) {
            console.error('Approve failed', err);
            alert('Failed to approve request. Please try again.');
        } finally {
            setApprovalSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-[15px] border border-white/10 bg-[#0f141d] shadow-[0_35px_120px_rgba(0,0,0,0.45)] overflow-hidden"
        >
            <div className="p-6 space-y-5">
                {duplicateError && (
                    <div className="mb-3 rounded-md border border-red-500/30 bg-red-600/10 px-3 py-2 text-sm text-red-200">
                        {duplicateError}
                    </div>
                )}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={request?.user_name}
                                className="w-14 h-14 rounded-full object-cover border border-white/10"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-brand-fill/30 border border-white/10 grid place-items-center text-lg font-semibold text-pure-white">
                                {initials}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start gap-3">
                            <div className="flex-1 min-w-[180px] space-y-1">
                                <p className="text-lg font-semibold text-pure-white leading-tight">{request?.user_name || 'Unknown member'}</p>
                                <MetaItem icon={CalendarIcon}>{createdAt}</MetaItem>
                            </div>
                            <div className="flex-shrink-0">
                                <KickRequestStatusBadge status={status || request?.status} />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <ApprovalChip label="Coordinator" active={Boolean(request?.koordinator_approved)} />
                            <ApprovalChip label="Mentor" active={Boolean(request?.mentor_approved)} />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
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
                                {request?.reason || 'No reason provided'}
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

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleApproveClick}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-24e1c9 py-1.5 text-sm font-semibold text-dark-bg shadow-[0_10px_30px_rgba(36,225,201,0.2)] hover:opacity-90 transition"
                            >
                                Approve Request
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="border-t border-white/5 px-6 py-3">
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-muted-gray hover:text-muted-gray transition"
                >
                    {toggleLabel}
                    <img
                        src={chevronDownIcon}
                        alt="Toggle details"
                        className={`w-4 h-4 mt-0.5 opacity-80 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>
            <KickRequestApprovalModal
                open={approvalModalOpen}
                memberName={request?.user_name}
                onCancel={handleCancelApproval}
                onConfirm={handleConfirmApproval}
                loading={approvalSubmitting}
            />
        </motion.div>
    );
}
