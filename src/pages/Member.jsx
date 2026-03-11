/* eslint-disable no-unused-vars */
import '../styles/index.css';
import Navbar from '../components/Navbar';
import React, { useState } from 'react';
import usePagedMembersData from '../hooks/usePagedMembersData';
import { getAllUsers } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import MemberCard from '../components/member/common/MemberCard';
import TitleSection from '../components/member/common/TitleSection';
import Filters from '../components/member/common/MemberFilters';
import EmptyState from '../components/filter/EmptyState';
import ErrorBanner from '../components/ErrorHendler/member/ErrorBanner';
import SkeletonGrid from '../components/member/common/ImageWithSkeleton';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import { GRID_CLASSES } from '../components/member/common/ImageWithSkeleton';
import Pagination from '../components/filter/Pagination';
import useQueryPagination from '../hooks/useQueryPagination';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Project', href: '#project' },
    { label: 'People', href: '/people' }
];

const MemberPageContent = () => {
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
        refetch,
    } = usePagedMembersData({
        fetchPage: (params) => getAllUsers(params),
        fetchAll: () => getAllUsers(),
        currentPage,
        activeFilter,
        selectedGeneration,
        selectedPosition,
        searchTerm,
        itemsPerPage,
    });

    // Data fetching, caching and prefetching are handled in `usePagedMembersData` hook.

    const handleApplyFilters = ({
        activeFilter: nextActive,
        selectedGeneration: nextGen,
        positionValue,
        searchTerm: nextSearch,
        skipAnimation = false,
    }) => {
        if (!skipAnimation) {
            setAnimationKey(prev => prev + 1);
        }
        setActiveFilter(nextActive);
        setSelectedGeneration(nextGen ?? null);
        setSelectedPosition(positionValue ?? null);
        setSearchTerm(nextSearch ?? '');
        resetPage();
    };

    const handleClearFilters = () => {
        handleApplyFilters({
            activeFilter: 'all',
            selectedGeneration: null,
            positionValue: null,
            searchTerm: '',
            skipAnimation: true,
        });
    };

    const isFiltered = activeFilter !== 'all' || selectedGeneration !== null;
    const visibleUsers = users;
    const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    return (
        <div className="pt-4 pb-16 max-w-full mx-auto">
            <TitleSection />

            <div className="mb-8">
                <Filters
                    activeFilter={activeFilter}
                    selectedGeneration={selectedGeneration}
                    generations={generations}
                    onApply={handleApplyFilters}
                />
            </div>

            {loading && users.length === 0 && (
                <SkeletonGrid />
            )}

            {!loading && error && (
                <ErrorBanner message={error} onRetry={refetch} />
            )}

            {!error && visibleUsers.length > 0 && (
                <div key={animationKey} className={`${GRID_CLASSES} ${isTransitioning ? 'opacity-75 pointer-events-none transition-opacity duration-300' : ''}`}>
                    <AnimatePresence mode="popLayout">
                        {visibleUsers.map((member) => (
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

            {!error && totalPages > 1 && (
                <div className="max-w-5xl mx-auto px-6 mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {!error && visibleUsers.length === 0 && (
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