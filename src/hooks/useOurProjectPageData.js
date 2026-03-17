import { useCallback, useEffect, useMemo, useState } from 'react';
import useDebouncedValue from './useDebouncedValue';
import usePagedProjectsData from './usePagedProjectsData';
import useQueryPagination from './useQueryPagination';
import { getPublicProjectStats, getPublicProjects } from '../api/api';

export default function useOurProjectPageData({ itemsPerPage = 12, debounceMs = 500 } = {}) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ total: 0, progress: 0, complete: 0 });

    const debouncedSearch = useDebouncedValue(searchQuery, debounceMs);
    const { currentPage, setPage, resetPage } = useQueryPagination();

    const fetchProjectsPage = useCallback((params) => getPublicProjects(params), []);

    const {
        projects,
        totalCount,
        loading,
        isTransitioning,
        error,
    } = usePagedProjectsData({
        fetchPage: fetchProjectsPage,
        currentPage,
        activeFilter,
        searchTerm: debouncedSearch,
        itemsPerPage,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getPublicProjectStats();
                if (!response) return;
                setStats({
                    total: response.total ?? 0,
                    progress: response.progress ?? 0,
                    complete: response.complete ?? 0,
                });
            } catch (err) {
                console.error('Failed to load project stats', err);
            }
        };

        void fetchStats();
    }, []);

    const handleSetActiveFilter = useCallback((value) => {
        setActiveFilter(value);
        resetPage();
    }, [resetPage]);

    const handleSetSearchQuery = useCallback((value) => {
        setSearchQuery(value);
        resetPage();
    }, [resetPage]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / itemsPerPage)), [totalCount, itemsPerPage]);

    return {
        activeFilter,
        searchQuery,
        stats,
        projects,
        totalCount,
        loading,
        isTransitioning,
        error,
        currentPage,
        setPage,
        totalPages,
        handleSetActiveFilter,
        handleSetSearchQuery,
    };
}
