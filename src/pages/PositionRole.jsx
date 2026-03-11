import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import EmptyState from '../components/filter/EmptyState';
import MemberFilters from '../components/member/common/MemberFilters';
import PositionRoleMemberCard from '../components/position-role/PositionRoleMemberCard';
import PositionRoleModal from '../components/position-role/PositionRoleModal';
import Pagination from '../components/filter/Pagination';
import useQueryPagination from '../hooks/useQueryPagination';
import usePagedMembersData from '../hooks/usePagedMembersData';
import { getAdminMembers } from '../api/api';
import { usePositionRoleUpdate } from '../hooks/usePositionRoleUpdate';

export default function PositionRole() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeMember, setActiveMember] = useState(null);
    const [formState, setFormState] = useState({ position: '', role: '', generation: '' });
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [animationKey, setAnimationKey] = useState(0);
    const { currentPage, setPage, resetPage } = useQueryPagination();
    const itemsPerPage = 12;

    const {
        users,
        totalCount,
        loading,
        isTransitioning,
        error,
        generations,
    } = usePagedMembersData({
        fetchPage: (params) => getAdminMembers(params),
        fetchAll: () => getAdminMembers(),
        currentPage,
        activeFilter,
        selectedGeneration,
        selectedPosition,
        searchTerm,
        itemsPerPage,
    });
    const { isSaving, saveMemberChanges } = usePositionRoleUpdate({
        onSuccess: ({ member }) => {
            if (!member?.hashed_id) return;

            setActiveMember(null);
        },
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

    const handleOpenEdit = (member) => {
        setActiveMember(member);
        setFormState({
            position: member?.position || '',
            role: member?.role || member?.division || '',
            generation:
                member?.generation !== undefined && member?.generation !== null ? String(member.generation) : '',
        });
    };

    const handleCloseModal = () => {
        setActiveMember(null);
    };

    const handleChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!activeMember) return;
        try {
            await saveMemberChanges({ member: activeMember, formState });
        } catch {
            // Error handling is managed inside the hook; keep modal open on failure
        }
    };

    const handleMemberPatched = useCallback((memberHashedId, patch) => {
        if (!memberHashedId || !patch) return;

        setActiveMember((prev) => (prev?.hashed_id === memberHashedId ? { ...prev, ...patch } : prev));
    }, []);

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
                    className={`relative flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
                >
                    <div className="p-6 sm:p-8 pb-16">
                        <Header
                            title="Position & Role"
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
                                            <PositionRoleMemberCard
                                                key={member.hashed_id}
                                                member={member}
                                                onEdit={() => handleOpenEdit(member)}
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

                    <PositionRoleModal
                        isOpen={Boolean(activeMember)}
                        member={activeMember}
                        formState={formState}
                        onChange={handleChange}
                        onClose={handleCloseModal}
                        onSave={handleSave}
                        isSaving={isSaving}
                        onMemberPatched={handleMemberPatched}
                    />
                </main>
            </div>
        </GuestMemberBackground>
    );
}
