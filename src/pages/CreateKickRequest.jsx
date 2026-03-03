import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import EmptyState from '../components/filter/EmptyState';
import { getAdminMembers } from '../api/api';
import { sortMembers } from '../utils/members';
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
    const [allUsers, setAllUsers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
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

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    useEffect(() => {
        let cancelled = false;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const members = await getAdminMembers();
                if (cancelled) return;

                const users = Array.isArray(members) ? members : [];
                setAllUsers(users);
                setFilteredMembers(sortMembers(users));
                setError(null);
            } catch {
                if (cancelled) return;
                setError('Failed to load members');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUsers();
        return () => {
            cancelled = true;
        };
    }, []);

    const generations = useMemo(() => {
        const genSet = new Set();
        allUsers.forEach((user) => {
            if (user.generation && user.position !== 'Mentor') genSet.add(user.generation);
        });
        return Array.from(genSet).sort((a, b) => b - a);
    }, [allUsers]);

    const handleApplyFilters = useCallback(({ filtered, activeFilter: nextActive, selectedGeneration: nextGen }) => {
        setFilteredMembers(filtered);
        if (nextActive !== undefined) setActiveFilter(nextActive);
        if (nextGen !== undefined) setSelectedGeneration(nextGen);
    }, []);

    const handleOpenKickModal = () => {
        const selectedList = allUsers.filter((member) => has(member.hashed_id));
        if (selectedList.length === 0) return;
        openKickModal(selectedList);
    };

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
                                allUsers={allUsers}
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

                            {!loading && !error && filteredMembers.length === 0 && <EmptyState />}

                            {!loading && !error && filteredMembers.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredMembers.map((member) => (
                                        <KickMemberCard
                                            key={member.hashed_id}
                                            member={member}
                                            selected={has(member.hashed_id)}
                                            onToggle={() => toggle(member.hashed_id)}
                                        />
                                    ))}
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