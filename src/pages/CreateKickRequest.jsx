import React, { useCallback, useEffect, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import EmptyState from '../components/filter/EmptyState';
import { getAllUsers } from '../api/api';
import { sortMembers } from '../utils/members';
import useSelection from '../hooks/useSelectionKick';
import KickRequestFilters from '../components/kick-request/KickRequestFilters';
import KickMemberCard from '../components/kick-request/KickMemberCard';
import KickSelectionBar from '../components/kick-request/KickSelectionBar';
import KickRequestModal from '../components/kick-request/KickRequestModal';
import { useKickRequestModal } from '../hooks/useKickRequestModal';

export default function CreateKickRequest() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { has, toggle, clear, count } = useSelection();

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
        onSuccess: () => {
            clear();
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
                const response = await getAllUsers();
                if (cancelled) return;

                const users = Array.isArray(response?.data) ? response.data : [];
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

    const handleApplyFilters = useCallback(({ filtered }) => {
        setFilteredMembers(filtered);
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
                            <KickRequestFilters
                                allUsers={allUsers}
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