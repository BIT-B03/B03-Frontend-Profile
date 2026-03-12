import React, { useCallback, useEffect, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import EmptyState from '../components/filter/EmptyState';
import Pagination from '../components/filter/Pagination';
import useQueryPagination from '../hooks/useQueryPagination';
import usePagedMembersData from '../hooks/usePagedMembersData';
import { getAdminMembers } from '../api/api';
import useSelection from '../hooks/useSelectionKick';
import MemberFilters from '../components/member/common/MemberFilters';
import KickMemberCard from '../components/kick-request/KickMemberCard';
import KickSelectionBar from '../components/kick-request/KickSelectionBar';
import KickRequestModal from '../components/kick-request/KickRequestModal';
import { useKickRequestModal } from '../hooks/useKickRequestModal';
import useKickRequestsData from '../hooks/useKickRequestsData';

export default function CreateKickRequest() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [animationKey, setAnimationKey] = useState(0);
    const { currentPage, setPage, resetPage } = useQueryPagination();
    const itemsPerPage = 12;
    const { has, toggle, clear, count } = useSelection();
    const { requests: existingKickRequests, refetch: refetchKickRequests } = useKickRequestsData();

    const {
        isOpen: isKickModalOpen,
        reason,
        setReason,
        isSubmitting,
        error: kickError,
        targetMembers,
        openModal: openKickModal,
        closeModal: closeKickModal,
        submitKickRequest,
    } = useKickRequestModal({
        existingRequests: existingKickRequests,
        onSuccess: () => {
            clear();
            refetchKickRequests();
        },
    });

    const {
        users,
        totalCount,
        loading,
        isTransitioning,
        error,
        generations,
    } = usePagedMembersData({
        fetchPage: (params) => getAdminMembers(params),
        currentPage,
        activeFilter,
        selectedGeneration,
        selectedPosition,
        searchTerm,
        itemsPerPage,
    });

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    const handleApplyFilters = useCallback(({
        activeFilter: nextActive,
        selectedGeneration: nextGen,
        positionValue,
        searchTerm: nextSearch,
        skipAnimation = false,
    }) => {
        if (!skipAnimation) setAnimationKey((prev) => prev + 1);
        setActiveFilter(nextActive);
        setSelectedGeneration(nextGen ?? null);
        setSelectedPosition(positionValue ?? null);
        setSearchTerm(nextSearch ?? '');
        resetPage();
    }, [resetPage]);

    const handleOpenKickModal = () => {
        const selectedList = users.filter((member) => has(member.hashed_id));
        if (selectedList.length === 0) return;
        openKickModal(selectedList);
    };

    const visibleUsers = users;
    const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    return (
        <GuestMemberBackground>
            <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />

                <main
                    className={`relative flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'
                        }`}
                >
                    <div className="p-6 sm:p-8 pb-28">
                        <Header
                            title="Create Kick Request"
                            onMobileMenuClick={() => setMobileSidebarOpen(true)}
                            onDesktopMenuClick={() => setCollapsed((v) => !v)}
                        />

                        <section className="mt-6">
                            <MemberFilters
                                activeFilter={activeFilter}
                                selectedGeneration={selectedGeneration}
                                generations={generations}
                                onApply={handleApplyFilters}
                            />
                        </section>

                        <section className="mt-6">
                            {loading && (
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-muted-gray">
                                    Loading members...
                                </div>
                            )}

                            {!loading && error && (
                                <div className="rounded-2xl border border-filter-red-border bg-filter-red-bg/20 p-6 text-filter-red-border">
                                    {error}
                                </div>
                            )}

                            {!error && visibleUsers.length === 0 && <EmptyState />}

                            {!error && visibleUsers.length > 0 && (
                                <div key={animationKey} className={`${isTransitioning ? 'opacity-75 pointer-events-none transition-opacity duration-300' : ''}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {visibleUsers.map((member) => (
                                            <KickMemberCard
                                                key={member.hashed_id}
                                                member={member}
                                                selected={has(member.hashed_id)}
                                                onToggle={() => toggle(member.hashed_id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!error && totalPages > 1 && (
                                <div className="max-w-5xl mx-auto px-6 mt-6">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    {count > 0 && (
                        <KickSelectionBar
                            count={count}
                            onCancel={clear}
                            onConfirm={handleOpenKickModal}
                        />
                    )}

                    <KickRequestModal
                        isOpen={isKickModalOpen}
                        onClose={closeKickModal}
                        onConfirm={submitKickRequest}
                        reason={reason}
                        onReasonChange={setReason}
                        count={targetMembers.length}
                        isSubmitting={isSubmitting}
                        error={kickError}
                    />
                </main>
            </div>
        </GuestMemberBackground>
    );
}