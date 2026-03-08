import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ProjectHeader from '../components/ourproject/detail/ProjectHeader';
import PreviewGallery from '../components/ourproject/detail/PreviewGallery';
import ContributorsSection from '../components/ourproject/detail/ContributorsSection';
import { getProjectDetail, SetAuthToken, getProjectThumbnailImageUrl } from '../api/api';
import { getProjectStatusMeta } from '../utils/projectStatus';

export default function DetailProjectCreate() {
    const { projectHashedId } = useParams();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileSidebarOpen]);

    const fetchProject = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getProjectDetail(projectHashedId);

            // normalise: API may return { data: { ...project } } or the project directly
            let project = res;
            if (res && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                project = res.data;
            }

            const statusMeta = getProjectStatusMeta(
                project?.status || project?.project_status || project?.state
            );
            const normalized = {
                ...project,
                status: statusMeta.label,
                statusTone: statusMeta.tone,
                thumbnail_url: getProjectThumbnailImageUrl(
                    project?.thumbnail || project?.thumbnail_url
                ),
            };

            setProjectData(normalized);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError('Gagal memuat data proyek');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [projectHashedId, navigate]);

    // Set auth token + fetch on mount
    useEffect(() => {
        const token = localStorage.getItem('auth_access_token');
        if (!token) { navigate('/login', { replace: true }); return; }
        SetAuthToken(token);
        fetchProject();
    }, [fetchProject, navigate]);

    useEffect(() => {
        if (projectData) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [projectData]);

    return (
        <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileSidebarOpen}
                onMobileClose={() => setMobileSidebarOpen(false)}
            />

            {/* ── Main content ─────────────────────────────────────────────── */}
            <main
                className={`flex-1 min-w-0 transition-all duration-300 ${
                    collapsed ? 'lg:ml-20' : 'lg:ml-72'
                }`}
            >
                <div className="p-6 sm:p-8">
                    {/* ── Header ───────────────────────────────────────────── */}
                    <Header
                        title="Detail Project"
                        onMobileMenuClick={() => setMobileSidebarOpen(true)}
                        onDesktopMenuClick={() => setCollapsed((v) => !v)}
                    />

                    {/* ── Loading skeleton ─────────────────────────────────── */}
                    {loading && (
                        <div className="mt-4 space-y-4">
                            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-20 animate-pulse" />
                            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-64 animate-pulse" />
                            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-48 animate-pulse" />
                        </div>
                    )}

                    {/* ── Error state ──────────────────────────────────────── */}
                    {!loading && error && (
                        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-red-200 text-sm sm:text-base">{error}</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={fetchProject}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                >
                                    Coba Lagi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/create-project')}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Kembali
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Project content ──────────────────────────────────── */}
                    {!loading && !error && projectData && (
                        <div className="mt-4 space-y-8">
                            {/* Project title + status + creator */}
                            <ProjectHeader
                                title={projectData.title}
                                status={projectData.status}
                                creator={projectData.creator}
                                backPath="/create-project"
                            />

                            {/* Preview gallery (swiper carousel) */}
                            {projectData.preview && projectData.preview.length > 0 && (
                                <PreviewGallery
                                    previews={projectData.preview}
                                    title={projectData.title}
                                    description={projectData.description}
                                    showTitleAndDescription={true}
                                    creator={projectData.creator}
                                />
                            )}

                            {/* Contributors */}
                            {projectData.contributors && projectData.contributors.length > 0 && (
                                <ContributorsSection contributors={projectData.contributors} />
                            )}

                            {/* Fallback: no preview & no contributors */}
                            {(!projectData.preview || projectData.preview.length === 0) &&
                                (!projectData.contributors || projectData.contributors.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                        <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <p className="text-sm">Tidak ada konten tambahan untuk proyek ini</p>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
