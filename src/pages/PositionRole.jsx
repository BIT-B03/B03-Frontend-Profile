import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import EmptyState from '../components/filter/EmptyState';
import MemberFilters from '../components/member/common/MemberFilters';
import PositionRoleMemberCard from '../components/position-role/PositionRoleMemberCard';
import PositionRoleModal from '../components/position-role/PositionRoleModal';
import { getAdminMembers } from '../api/api';
import { sortMembers } from '../utils/members';
import { usePositionRoleUpdate } from '../hooks/usePositionRoleUpdate';

export default function PositionRole() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMember, setActiveMember] = useState(null);
    const [formState, setFormState] = useState({ position: '', role: '', generation: '' });
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const { isSaving, saveMemberChanges } = usePositionRoleUpdate({
        onSuccess: ({ member, payload }) => {
            if (!member?.hashed_id) return;

            setAllUsers((prev) =>
                prev.map((m) => {
                    if (m.hashed_id !== member.hashed_id) return m;
                    const next = { ...m };

                    if (payload?.position !== undefined) {
                        next.position = payload.position;
                    }
                    if (payload?.new_role !== undefined) {
                        next.role = payload.new_role;
                    }
                    if (payload?.generation !== undefined) {
                        next.generation = payload.generation;
                    }

                    return next;
                })
            );

            setFilteredMembers((prev) =>
                prev.map((m) => {
                    if (m.hashed_id !== member.hashed_id) return m;
                    const next = { ...m };

                    if (payload?.position !== undefined) {
                        next.position = payload.position;
                    }
                    if (payload?.new_role !== undefined) {
                        next.role = payload.new_role;
                    }
                    if (payload?.generation !== undefined) {
                        next.generation = payload.generation;
                    }

                    return next;
                })
            );

            setActiveMember(null);
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

        setAllUsers((prev) =>
            prev.map((m) => (m.hashed_id === memberHashedId ? { ...m, ...patch } : m))
        );
        setFilteredMembers((prev) =>
            prev.map((m) => (m.hashed_id === memberHashedId ? { ...m, ...patch } : m))
        );
        setActiveMember((prev) => (prev?.hashed_id === memberHashedId ? { ...prev, ...patch } : prev));
    }, []);

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
                                        <PositionRoleMemberCard
                                            key={member.hashed_id}
                                            member={member}
                                            onEdit={() => handleOpenEdit(member)}
                                        />
                                    ))}
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
