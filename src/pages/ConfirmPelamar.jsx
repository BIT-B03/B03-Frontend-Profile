import React, { useCallback, useEffect, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import EmptyState from '../components/filter/EmptyState';
import { getAdminPelamar } from '../api/api';
import PelamarCard from '../components/confirm-pelamar/PelamarCard';
import ConfirmPelamarModal from '../components/confirm-pelamar/ConfirmPelamarModal';
import PelamarDetailModal from '../components/confirm-pelamar/PelamarDetailModal';
import { useConfirmPelamarModal } from '../hooks/useConfirmPelamar';

export default function ConfirmPelamar() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [pelamarList, setPelamarList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [detailTarget, setDetailTarget] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const openDetail = useCallback((pelamar) => {
        setDetailTarget(pelamar);
        setIsDetailOpen(true);
    }, []);

    const closeDetail = useCallback(() => {
        setIsDetailOpen(false);
        setDetailTarget(null);
    }, []);

    const {
        isOpen,
        isSubmitting,
        error: modalError,
        targetPelamar,
        actionType,
        openModal,
        closeModal,
        submitAction,
    } = useConfirmPelamarModal({
        onSuccess: ({ id }) => {
            // Remove the processed applicant from the list
            setPelamarList((prev) => prev.filter((p) => p.hashed_id !== id));
        },
    });

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    const fetchPelamar = useCallback(async () => {
        let cancelled = false;
        try {
            setLoading(true);
            setError(null);
            const data = await getAdminPelamar();
            if (cancelled) return;
            setPelamarList(Array.isArray(data) ? data : []);
        } catch {
            if (cancelled) return;
            setError('Failed to load applicants.');
        } finally {
            if (!cancelled) setLoading(false);
        }
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminPelamar();
                if (cancelled) return;
                setPelamarList(Array.isArray(data) ? data : []);
            } catch {
                if (cancelled) return;
                setError('Failed to load applicants.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        run();
        return () => { cancelled = true; };
    }, []);

    const handleConfirm = useCallback((pelamar) => openModal(pelamar, 'confirm'), [openModal]);
    const handleReject = useCallback((pelamar) => openModal(pelamar, 'reject'), [openModal]);

    return (
        <GuestMemberBackground>
            <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />

                <main
                    className={`relative flex-1 min-w-0 transition-all duration-300 ${
                        collapsed ? 'lg:ml-20' : 'lg:ml-72'
                    }`}
                >
                    <div className="p-6 sm:p-8 pb-28">
                        <Header
                            title="Confirm Applicants"
                            onMobileMenuClick={() => setMobileSidebarOpen(true)}
                            onDesktopMenuClick={() => setCollapsed((v) => !v)}
                        />

                        {/* Summary badge */}
                        {!loading && !error && pelamarList.length > 0 && (
                            <div className="mt-6 flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-2xl border border-brand-24e1c9/30 bg-brand-24e1c9/10 px-4 py-2 text-sm text-brand-24e1c9 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-brand-24e1c9 animate-pulse" />
                                    {pelamarList.length} pending{' '}
                                    {pelamarList.length === 1 ? 'applicant' : 'applicants'}
                                </span>
                            </div>
                        )}

                        <section className="mt-6">
                            {loading && (
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-muted-gray">
                                    Loading applicants...
                                </div>
                            )}

                            {!loading && error && (
                                <div className="rounded-2xl border border-filter-red-border bg-filter-red-bg/20 p-6 text-filter-red-border flex items-center justify-between gap-4">
                                    <span>{error}</span>
                                    <button
                                        type="button"
                                        onClick={fetchPelamar}
                                        className="text-sm font-medium text-pure-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!loading && !error && pelamarList.length === 0 && (
                                <EmptyState />
                            )}

                            {!loading && !error && pelamarList.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {pelamarList.map((pelamar) => (
                                        <PelamarCard
                                            key={pelamar.hashed_id}
                                            pelamar={pelamar}
                                            onConfirm={handleConfirm}
                                            onReject={handleReject}
                                            onViewDetail={openDetail}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <ConfirmPelamarModal
                        isOpen={isOpen}
                        onClose={closeModal}
                        onConfirm={submitAction}
                        actionType={actionType}
                        pelamar={targetPelamar}
                        isSubmitting={isSubmitting}
                        error={modalError}
                    />

                    <PelamarDetailModal
                        isOpen={isDetailOpen}
                        onClose={closeDetail}
                        pelamar={detailTarget}
                        onConfirm={handleConfirm}
                        onReject={handleReject}
                    />
                </main>
            </div>
        </GuestMemberBackground>
    );
}
