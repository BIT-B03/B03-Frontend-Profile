import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../ourproject/ProjectCard';

/* ── Skeleton card ──────────────────────────────────────────────────────────── */
function ProjectCardSkeleton() {
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Thumbnail skeleton */}
            <div className="h-40 skeleton-base skeleton-shimmer" />
            {/* Content skeleton */}
            <div className="p-4 flex flex-col flex-grow gap-3">
                <div className="h-4 w-3/4 rounded skeleton-base skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-base skeleton-shimmer" />
                <div className="h-px w-full bg-gray-800 my-1" />
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="w-7 h-7 rounded-full skeleton-base skeleton-shimmer" />
                        <div className="w-7 h-7 rounded-full skeleton-base skeleton-shimmer" />
                        <div className="h-3 w-16 rounded skeleton-base skeleton-shimmer" />
                    </div>
                    <div className="h-7 w-20 rounded-lg skeleton-base skeleton-shimmer" />
                </div>
            </div>
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function MemberProjectsSection({ projects = [], loading = false, error = null }) {
    const navigate = useNavigate();

    const handleViewDetail = (id_hash) => {
        navigate(`/projects/${id_hash}`);
    };

    return (
        <section className="w-full pt-4 pb-2">
            {/* ── Header ── */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
                    Part of These Projects
                </h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-brand-24e1c9/60 via-blue-500/60 to-purple-500/60" />
            </div>

            {/* ── Loading skeletons ── */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* ── Error state ── */}
            {!loading && error && (
                <p className="text-center text-gray-500 py-8">{error}</p>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && projects.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                    No projects found for this member.
                </p>
            )}

            {/* ── Project grid ── */}
            {!loading && !error && projects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id || project.id_hash}
                            project={project}
                            onViewDetail={handleViewDetail}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
