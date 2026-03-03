import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import KickRequestCard from '../components/kick-request/ListKickRequest/KickRequestCard';
import KickRequestHero from '../components/kick-request/ListKickRequest/KickRequestHero';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import useKickRequestsData from '../hooks/useKickRequestsData';

export default function KickRequests() {
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { requests, loading, error, refetch } = useKickRequestsData();

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    return (
        <GuestMemberBackground>
            <div className="flex h-screen bg-brand-vignette overflow-hidden">
                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />

                <main
                    className={`relative flex-1 min-w-0 h-full transition-all duration-300 overflow-y-auto scrollbar-hidden ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
                >
                    <div className="p-6 sm:p-8 pb-20">
                        <Header
                            title="Kick Requests"
                            onMobileMenuClick={() => setMobileSidebarOpen(true)}
                            onDesktopMenuClick={() => setCollapsed((v) => !v)}
                        />

                        <div className="mt-6">
                            <KickRequestHero />
                        </div>

                        <section className="mt-6 space-y-4">
                            {!loading && !error && requests.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                    {requests.map((request) => (
                                        <KickRequestCard key={request.hashed_id} request={request} onApproved={refetch} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </GuestMemberBackground>
    );
}
