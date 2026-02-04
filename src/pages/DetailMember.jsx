import '../styles/index.css';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { getUserPublicData } from '../api/api';
import React, { useState, useEffect, useCallback } from 'react';
import BioSection from '../components/member/detail/BioSection';
import ProfileCard from '../components/member/detail/ProfileCard';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import DescriptionSection from '../components/member/detail/DescriptionSection';
import { getCachedData, setCachedData } from '../utils/cache';

function App() {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Project', href: '#project' },
        { label: 'People', href: '/people' }
    ];
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userHashedId } = useParams();
    const userId = userHashedId;

    const fetchUserData = useCallback(async ({ useCache = true } = {}) => {
        try {
            setLoading(true);

            const cacheKey = `member:detail:${userId}`;

            if (useCache) {
                const cached = getCachedData(cacheKey);
                if (cached) {
                    setUserData(cached);
                    setError(null);
                    setLoading(false);
                    return;
                }
            }

            const response = await getUserPublicData(userId);
            const data = response.data;

            setUserData(data);
            setError(null);
            setCachedData(cacheKey, data);
        } catch (err) {
            setError('Failed to load user data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return (
            <BackgroundLayout>
                <Navbar navItems={navItems} />

                <main className="pt-20 max-w-8xl mx-auto px-4 py-5">
                    <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-5 items-stretch">
                        {/* Left: profile card skeleton */}
                        <div className="flex justify-center lg:justify-start">
                            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-4 shadow-2xl max-w-[320px] w-full h-[480px] skeleton-base skeleton-shimmer">
                                <div className="w-full aspect-[4/6] rounded-2xl" />
                            </div>
                        </div>

                        {/* Right: bio/description skeleton */}
                        <div className="flex flex-col gap-4 h-full">
                            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8 skeleton-base skeleton-shimmer h-40" />
                            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8 skeleton-base skeleton-shimmer h-32" />
                        </div>
                    </div>
                </main>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <Navbar navItems={navItems} />

            <main className="pt-20 max-w-8xl mx-auto px-4 py-5">
                {error && (
                    <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-red-200 text-sm sm:text-base">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchUserData({ useCache: false })}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pure-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-5 items-stretch">
                    <div className="flex justify-center lg:justify-start">
                        {!error && (
                            <ProfileCard
                                avatarUrl={userData?.avatar_url}
                                name={userData?.name}
                                username={userData?.username}
                            />
                        )}
                    </div>

                    <div className="flex flex-col h-full">
                        {!error && (
                            <BioSection
                                bio={userData?.bio}
                                sosmed={userData?.sosmed}
                            />
                        )}
                    </div>
                </div>

                {!error && (
                    <div className="mt-5">
                        <DescriptionSection description={userData?.description} />
                    </div>
                )}
            </main>
        </BackgroundLayout>
    );
}

export default App;