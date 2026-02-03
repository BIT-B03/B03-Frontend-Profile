import '../styles/index.css';
import Navbar from '../components/Navbar';
import { getAllUsers } from '../api/api';
import React, { useState, useEffect } from 'react';
import MemberCard from '../components/member/common/MemberCard';
import TitleSection from '../components/member/common/TitleSection';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import Filters, { sortMembers } from '../components/member/common/Filters';
import { getCachedData, setCachedData } from '../utils/cache';

function App() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [animationKey, setAnimationKey] = useState(0);

    const [generations, setGenerations] = useState([]);

    const fetchUsers = async ({ useCache = true } = {}) => {
        const cacheKey = 'members:list';
        let cached = null;

        try {
            setLoading(true);

            if (useCache) {
                cached = getCachedData(cacheKey);
                if (cached) {
                    setAllUsers(cached);
                    setFilteredUsers(sortMembers(cached));

                    const uniqueGens = [...new Set(
                        cached
                            .filter(user => user.position !== 'Mentor')
                            .map(user => user.generation)
                    )].sort((a, b) => b - a);

                    setGenerations(uniqueGens);
                    setError(null);
                }
            }

            const response = await getAllUsers();
            const users = response.data;

            setAllUsers(users);
            setFilteredUsers(sortMembers(users));

            const uniqueGens = [...new Set(
                users
                    .filter(user => user.position !== 'Mentor')
                    .map(user => user.generation)
            )].sort((a, b) => b - a);

            setGenerations(uniqueGens);
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

    const handleApplyFilters = ({ filtered, activeFilter: nextActive, selectedGeneration: nextGen }) => {
        setAnimationKey(prev => prev + 1);
        setActiveFilter(nextActive);
        setSelectedGeneration(nextGen ?? null);
        setFilteredUsers(filtered);
    };

    if (loading && allUsers.length === 0) {
        // Tampilkan skeleton grid hanya saat belum ada data sama sekali
        const skeletonItems = Array.from({ length: 8 });

        return (
            <BackgroundLayout>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <TitleSection />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {skeletonItems.map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-brand-fill border border-brand-stroke rounded-2xl overflow-hidden skeleton-base skeleton-shimmer"
                            >
                                <div className="w-full aspect-[4/6]" />
                            </div>
                        ))}
                    </div>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <TitleSection />

                <div className="mb-12">
                    <Filters
                        allUsers={allUsers}
                        activeFilter={activeFilter}
                        selectedGeneration={selectedGeneration}
                        generations={generations}
                        onApply={handleApplyFilters}
                    />
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-red-200 text-sm sm:text-base">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchUsers({ useCache: false })}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pure-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!error && (
                    <div key={animationKey} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredUsers.map((member, index) => (
                            <MemberCard
                                key={member.hashed_id}
                                member={member}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {!error && filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-gray text-lg">No members found for this filter.</p>
                    </div>
                )}
            </div>
        </BackgroundLayout>
    );
}

export default App;