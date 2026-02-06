/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import '../styles/index.css';
import { getAllUsers } from '../api/api';
import Navbar from '../components/Navbar';
import { sortMembers } from '../utils/members';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCachedData, setCachedData } from '../utils/cache';
import MemberCard from '../components/member/common/MemberCard';
import TitleSection from '../components/member/common/TitleSection';
import Filters from '../components/member/common/MemberFilters';
import EmptyState from '../components/filter/EmptyState';
import ErrorBanner from '../components/ErrorHendler/member/ErrorBanner';
import SkeletonGrid from '../components/member/common/ImageWithSkeleton';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import { GRID_CLASSES } from '../components/member/common/ImageWithSkeleton';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Project', href: '#project' },
    { label: 'People', href: '/people' }
];

const MemberPageContent = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [animationKey, setAnimationKey] = useState(0);
    const [generations, setGenerations] = useState([]);

    const hydrateStateFromUsers = (users) => {
        setAllUsers(users);
        setFilteredUsers(sortMembers(users));

        const uniqueGens = [...new Set(
            users
                .filter(user => user.position !== 'Mentor')
                .map(user => user.generation)
        )].sort((a, b) => b - a);

        setGenerations(uniqueGens);
    };

    // Cache
    const fetchUsers = async ({ useCache = true } = {}) => {
        const cacheKey = 'members:list';
        let cached = null;

        try {
            setLoading(true);

            if (useCache) {
                cached = getCachedData(cacheKey);
                if (cached) {
                    hydrateStateFromUsers(cached);
                    setError(null);
                }
            }

            const response = await getAllUsers();
            const users = response.data;
            hydrateStateFromUsers(users);
            setError(null);
            setCachedData(cacheKey, users);
        } catch (err) {
            setError('Failed to load users data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApplyFilters = ({ filtered, activeFilter: nextActive, selectedGeneration: nextGen, skipAnimation = false }) => {
        if (!skipAnimation) {
            setAnimationKey(prev => prev + 1);
        }
        setActiveFilter(nextActive);
        setSelectedGeneration(nextGen ?? null);
        setFilteredUsers(filtered);
    };

    const handleClearFilters = () => {
        handleApplyFilters({
            filtered: sortMembers(allUsers),
            activeFilter: 'all',
            selectedGeneration: null,
            skipAnimation: true,
        });
    };

    const isFiltered = activeFilter !== 'all' || selectedGeneration !== null;

    return (
        <div className="pt-4 pb-16 max-w-full mx-auto">
            <TitleSection />

            <div className="mb-8">
                <Filters
                    allUsers={allUsers}
                    activeFilter={activeFilter}
                    selectedGeneration={selectedGeneration}
                    generations={generations}
                    onApply={handleApplyFilters}
                />
            </div>

            {loading && allUsers.length === 0 && (
                <SkeletonGrid />
            )}

            {!loading && error && (
                <ErrorBanner message={error} onRetry={() => fetchUsers({ useCache: false })} />
            )}

            {!error && filteredUsers.length > 0 && (
                <div key={animationKey} className={GRID_CLASSES}>
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((member) => (
                            <motion.div
                                key={member.hashed_id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!error && filteredUsers.length === 0 && (
                <EmptyState onClearFilters={handleClearFilters} showReset={isFiltered} />
            )}
        </div>
    );
};

function MemberPage() {
    return (
        <BackgroundLayout>
            <Navbar navItems={navItems} />
            <main className="pt-16 pb-8 max-w-full mx-auto px-4 sm:px-4 lg:px-14">
                <MemberPageContent />
            </main>
        </BackgroundLayout>
    );
}

export default MemberPage;