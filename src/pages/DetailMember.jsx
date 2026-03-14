import '../styles/index.css';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import React from 'react';
import useUserPublicData from '../hooks/useUserDetailPublic';
import useUserContributedProjects from '../hooks/useUserContributedProjects';
import ProfileCard from '../components/member/detail/ProfileCard';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
import DescriptionSection from '../components/member/detail/DescriptionSection';
import SocialLinks from '../components/member/detail/SocialLinks';
import MemberProjectsSection from '../components/member/detail/MemberProjectsSection';
import ErrorBanner from '../components/ErrorHendler/member/ErrorBanner';

function App() {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Project', href: '/project' },
        { label: 'People', href: '/people' }
    ];
    const { userHashedId } = useParams();
    const userId = userHashedId;

    const { userData, loading, error, refetch } = useUserPublicData(userId);
    const { projects: contributedProjects, loading: projectsLoading, error: projectsError } = useUserContributedProjects(userId);

    if (loading) {
        return (
            <BackgroundLayout>
                <Navbar navItems={navItems} />

                <main className="pt-24 mt-6 sm:mt-8 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-10">
                    <section className="rounded-[32px] bg-white/5 backdrop-blur-lg shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                        <div className="p-6 sm:p-8 md:p-8 space-y-10">
                            <ProfileCard loading />

                            <div className="space-y-10">
                                <DescriptionSection loading />
                                <SocialLinks loading />
                            </div>
                        </div>
                    </section>
                </main>
            </BackgroundLayout>
        );
    }

    /* ── Main content ── */
    return (
        <BackgroundLayout>
            <Navbar navItems={navItems} />

            <main className="pt-24 mt-6 sm:mt-8 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-10 min-h-[calc(100vh-6rem)]">

                {error && (
                    <ErrorBanner message={error} onRetry={() => refetch({ bypassCache: true })} />
                )}

                {!error && (
                    <div className="p-6 sm:p-8 md:p-8 space-y-12">
                        <ProfileCard
                            avatarUrl={userData?.avatar_url}
                            name={userData?.name}
                            username={userData?.username}
                            email={userData?.email}
                            bio={userData?.bio}
                            position={userData?.position}
                            generation={userData?.generation}
                        />

                        <div className="space-y-10">
                            <DescriptionSection
                                className="pt-2"
                                description={userData?.description}
                            />

                            <SocialLinks sosmed={userData?.sosmed} className="pt-2" />
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <MemberProjectsSection
                            projects={contributedProjects}
                            loading={projectsLoading}
                            error={projectsError}
                        />
                    </div>
                )}
            </main>
        </BackgroundLayout>
    );
}

export default App;