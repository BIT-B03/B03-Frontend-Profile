import '../styles/index.css';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectPublicData } from '../api/api';
import React, { useState, useEffect, useCallback } from 'react';
import ProjectHeader from '../components/ourproject/detail/ProjectHeader';
import { getProjectStatusMeta } from '../utils/projectStatus';
import ContributorsSection from '../components/ourproject/detail/ContributorsSection';
import PreviewGallery from '../components/ourproject/detail/PreviewGallery';
import BackgroundLayout from '../components/layout/GuestMemberBackground';
// cache utilities removed — cache logic deleted from this page

function DetailProject() {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Project', href: '/project' },
        { label: 'People', href: '/people' }
    ];
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { projectHashedId } = useParams();
    const navigate = useNavigate();
    const projectId = projectHashedId;

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getProjectPublicData(projectId);

            // normalize: API may return { data: { ...project } } or project object directly
            let project = response;
            if (response && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                project = response.data;
            }

            // Debug: log project shape when status is missing
            // eslint-disable-next-line no-console
            if (!project || (project && typeof project.status === 'undefined')) {
                // small debug to inspect why status may be absent
                // print full JSON string so it's easy to copy/paste here
                try {
                    // eslint-disable-next-line no-console
                    console.debug('DetailProject: fetched project (status missing or undefined) JSON:\n', JSON.stringify(project, null, 2));
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.debug('DetailProject: fetched project (status missing or undefined)', project);
                }
            }

            // Ensure UI-consistent status metadata so header/card match
            const statusMeta = getProjectStatusMeta(project?.status || project?.project_status || project?.state || project);
            const normalized = { ...project, status: statusMeta.label, statusTone: statusMeta.tone };

            setProjectData(normalized);
            setError(null);
        } catch (err) {
            setError('Failed to load project data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    useEffect(() => {
        if (projectData) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [projectData]);

    if (loading) {
        return (
            <BackgroundLayout>
                <Navbar navItems={navItems} />

                <main className="pt-20 sm:pt-24 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-5 items-stretch">
                        <div className="flex justify-center lg:justify-start">
                            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-4 shadow-2xl max-w-[320px] w-full h-[480px] skeleton-base skeleton-shimmer">
                                <div className="w-full aspect-[4/6] rounded-2xl" />
                            </div>
                        </div>

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

            <main className="pt-20 sm:pt-24 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                {error && (
                    <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-red-200 text-sm sm:text-base">
                            {error}
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fetchProjectData()}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pure-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/project')}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pure-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {!error && projectData && (
                    <div className="space-y-10 lg:space-y-12">
                        <div>
                            <ProjectHeader
                                title={projectData?.title}
                                status={projectData?.status}
                                creator={projectData?.creator}
                            />
                        </div>

                        {projectData?.preview && projectData.preview.length > 0 && (
                            <div>
                                <PreviewGallery 
                                    previews={projectData.preview}
                                    title={projectData?.title}
                                    description={projectData?.description}
                                    showTitleAndDescription={true}
                                    creator={projectData?.creator}
                                />
                            </div>
                        )}

                        {/* Contributors Section */}
                        {projectData?.contributors && projectData.contributors.length > 0 && (
                            <div>
                                <ContributorsSection contributors={projectData.contributors} />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </BackgroundLayout>
    );
}

export default DetailProject;
