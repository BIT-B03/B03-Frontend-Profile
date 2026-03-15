import { useEffect, useRef, useState } from 'react';
import { getProjectStatusMeta } from '../utils/projectStatus';

export default function usePagedProjectsData({
    fetchPage,
    currentPage,
    activeFilter,
    searchTerm,
    itemsPerPage = 12,
    apiBase = '/api/projectPublic',
}) {
    const [projects, setProjects] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [error, setError] = useState(null);

    const cacheRef = useRef({ key: '', pages: new Map() });

    const mapProject = (project, idx) => {
        const statusMeta = getProjectStatusMeta(project?.status);
        const contributors = Array.isArray(project?.contributors) ? project.contributors : [];
        const creator = project?.creator || null;

        return {
            id: project?.id || idx,
            id_hash: project?.hashed_id || project?.id_hash || '',
            title: project?.title || project?.name || 'Untitled',
            description: project?.short_description || project?.description || '',
            status: statusMeta.label,
            statusTone: statusMeta.tone,
            thumbnail_url: project?.thumbnail || project?.thumbnail_url || '',
            creator,
            contributors,
            team_members: contributors.length + (creator ? 1 : 0),
            apiBase,
        };
    };

    const getParams = (page) => {
        const params = { page, limit: itemsPerPage };

        if (activeFilter === 'progress') {
            params.status = 'on_progress';
        } else if (activeFilter === 'complete') {
            params.status = 'completed';
        }

        if (searchTerm) params.search = searchTerm;

        return params;
    };

    const cacheKey = JSON.stringify({ activeFilter, searchTerm, itemsPerPage });

    const prefetchPage = async (page, expectedKey) => {
        try {
            if (cacheRef.current.pages.has(page)) return;
            if (cacheRef.current.key !== expectedKey) return;

            const response = await fetchPage(getParams(page));
            const fetched = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            const mapped = fetched.map(mapProject);
            const count = response?.meta?.total ?? response?.count ?? mapped.length;

            if (cacheRef.current.key !== expectedKey) return;
            cacheRef.current.pages.set(page, { projects: mapped, count });
        } catch {
            // ignore prefetch errors
        }
    };

    const fetchProjects = async () => {
        try {
            if (cacheRef.current.key !== cacheKey) {
                cacheRef.current.key = cacheKey;
                cacheRef.current.pages = new Map();
            }

            const cached = cacheRef.current.pages.get(currentPage);
            if (cached) {
                setProjects(cached.projects);
                setTotalCount(typeof cached.count === 'number' ? cached.count : cached.projects.length);
                setError(null);
                setLoading(false);
                setIsTransitioning(false);
                return;
            }

            if (projects.length === 0) {
                setLoading(true);
            } else {
                setIsTransitioning(true);
            }

            const response = await fetchPage(getParams(currentPage));
            const fetched = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            const mapped = fetched.map(mapProject);
            const count = response?.meta?.total ?? response?.count ?? mapped.length;

            cacheRef.current.pages.set(currentPage, { projects: mapped, count });
            setProjects(mapped);
            setTotalCount(count);
            setError(null);

            const totalPages = Math.max(1, Math.ceil(count / itemsPerPage));
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1;

            if (nextPage <= totalPages && !cacheRef.current.pages.has(nextPage)) prefetchPage(nextPage, cacheKey);
            if (prevPage >= 1 && !cacheRef.current.pages.has(prevPage)) prefetchPage(prevPage, cacheKey);
        } catch (err) {
            setError('Gagal memuat data proyek');
            console.error(err);
        } finally {
            setLoading(false);
            setIsTransitioning(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            void fetchProjects();
        }, 50);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentPage, activeFilter, searchTerm, itemsPerPage, fetchPage]);

    const refetch = () => {
        void fetchProjects();
    };

    return {
        projects,
        totalCount,
        loading,
        isTransitioning,
        error,
        refetch,
    };
}
