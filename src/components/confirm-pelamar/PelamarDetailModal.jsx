import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseButton } from '../common/BlurFrame';
import { getAdminPelamarDetail, getAdminPelamarCV } from '../../api/api';

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

export default function PelamarDetailModal({ isOpen, onClose, pelamar, onConfirm, onReject }) {
    const [detail, setDetail] = useState(null);
    const [cvBlobUrl, setCvBlobUrl] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingCv, setLoadingCv] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [cvError, setCvError] = useState(null);

    // Fetch detail & CV when modal opens
    useEffect(() => {
        if (!isOpen || !pelamar?.hashed_id) return;
        let cancelled = false;

        // Fetch applicant detail
        setLoadingDetail(true);
        setDetailError(null);
        getAdminPelamarDetail(pelamar.hashed_id)
            .then((res) => {
                if (cancelled) return;
                setDetail(res?.data ?? res);
            })
            .catch(() => {
                if (cancelled) return;
                setDetailError('Failed to load applicant details.');
            })
            .finally(() => {
                if (!cancelled) setLoadingDetail(false);
            });

        // Fetch CV as blob
        setLoadingCv(true);
        setCvError(null);
        getAdminPelamarCV(pelamar.hashed_id)
            .then((blob) => {
                if (cancelled) return;
                const url = URL.createObjectURL(blob);
                setCvBlobUrl(url);
            })
            .catch(() => {
                if (cancelled) return;
                setCvError('CV is not available for this applicant.');
            })
            .finally(() => {
                if (!cancelled) setLoadingCv(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, pelamar?.hashed_id]);

    // Cleanup blob URL and reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            if (cvBlobUrl) {
                URL.revokeObjectURL(cvBlobUrl);
                setCvBlobUrl(null);
            }
            setDetail(null);
            setDetailError(null);
            setCvError(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const displayData = detail || pelamar;

    const handleReject = () => {
        onClose();
        onReject(displayData);
    };

    const handleConfirm = () => {
        onClose();
        onConfirm(displayData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 py-3 sm:px-4 sm:py-6"
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-2xl rounded-3xl bg-dark-bg border border-brand-stroke shadow-2xl overflow-hidden flex flex-col"
                        style={{ maxHeight: 'calc(100vh - 3rem)' }}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-stroke/60 shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-pure-white tracking-tight">
                                Applicant Detail
                            </h2>
                            <CloseButton onClick={onClose} />
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-0">
                            {/* Applicant info */}
                            {loadingDetail ? (
                                <p className="text-muted-gray text-sm animate-pulse">
                                    Loading applicant details...
                                </p>
                            ) : detailError ? (
                                <p className="text-sm text-filter-red-border">{detailError}</p>
                            ) : (
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 shrink-0 rounded-full bg-brand-fill/30 border border-brand-stroke grid place-items-center text-xl font-semibold text-pure-white">
                                        {displayData?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1.5 min-w-0">
                                        <p className="text-lg font-bold text-pure-white leading-tight">
                                            {displayData?.name}
                                        </p>
                                        {displayData?.email && (
                                            <p className="text-sm text-muted-gray break-all">
                                                {displayData.email}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {displayData?.generation && (
                                                <span className="inline-flex items-center text-xs bg-brand-24e1c9/10 border border-brand-24e1c9/30 text-brand-24e1c9 rounded-full px-3 py-0.5">
                                                    Generation {displayData.generation}
                                                </span>
                                            )}
                                            {displayData?.created_at && (
                                                <span className="inline-flex items-center text-xs text-muted-gray/70 bg-white/5 rounded-full px-3 py-0.5 border border-white/10">
                                                    Applied {formatDate(displayData.created_at)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-brand-stroke/40" />

                            {/* CV Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-muted-gray uppercase tracking-widest mb-3">
                                    Curriculum Vitae
                                </h3>

                                {loadingCv && (
                                    <div className="rounded-2xl border border-brand-stroke/40 bg-brand-fill/20 h-40 sm:h-64 flex items-center justify-center">
                                        <span className="text-muted-gray text-sm animate-pulse">
                                            Loading CV...
                                        </span>
                                    </div>
                                )}

                                {!loadingCv && cvError && (
                                    <div className="rounded-2xl border border-filter-red-border/30 bg-filter-red-bg/10 h-36 flex flex-col items-center justify-center gap-2 text-filter-red-border">
                                        <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-sm">{cvError}</p>
                                    </div>
                                )}

                                {!loadingCv && cvBlobUrl && (
                                    <div className="space-y-2">
                                        {/* Desktop: inline iframe */}
                                        <iframe
                                            src={cvBlobUrl}
                                            title="Applicant CV"
                                            className="hidden sm:block w-full rounded-2xl border border-brand-stroke/40 bg-white"
                                            style={{ height: '45vh', minHeight: '220px' }}
                                        />
                                        {/* Mobile: open in new tab so native PDF viewer handles it */}
                                        <a
                                            href={cvBlobUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="sm:hidden flex items-center justify-center gap-2 w-full py-10 rounded-2xl border border-brand-stroke/40 bg-brand-fill/20 text-brand-24e1c9 text-sm font-medium hover:bg-brand-24e1c9/10 transition"
                                        >
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Tap to Open CV
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 bg-brand-fill/40 border-t border-brand-stroke/60 shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-filter-red-border/60 text-filter-red-border text-sm font-medium hover:bg-filter-red-bg/20 transition"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-brand-24e1c9 text-dark-bg text-sm font-semibold shadow-[0_8px_20px_rgba(36,225,201,0.2)] hover:opacity-90 transition"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
