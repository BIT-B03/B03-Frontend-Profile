/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { sortMembers } from '../utils/members';

export default function usePagedMembersData({
    fetchPage,
    currentPage,
    activeFilter,
    selectedGeneration,
    selectedPosition,
    searchTerm,
    itemsPerPage = 12,
}) {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [error, setError] = useState(null);
    const [generations, setGenerations] = useState([]);

    const cacheRef = useRef({ key: '', pages: new Map() });
    const abortControllerRef = useRef(null);

    const buildGenerationList = (list) => ([...new Set(
        list
            .filter(user => user.position !== 'Mentor')
            .map(user => user.generation)
    )].sort((a, b) => b - a));

    const normalizeGenerationList = (list) => {
        if (!Array.isArray(list) || list.length === 0) return [];
        const values = list
            .map((item) => (typeof item === 'number' ? item : item?.value))
            .filter((value) => typeof value === 'number');
        return [...new Set(values)].sort((a, b) => b - a);
    };

    const hydrateStateFromUsers = (nextUsers, count, generationList) => {
        const sorted = sortMembers(nextUsers);
        setUsers(sorted);
        setTotalCount(typeof count === 'number' ? count : sorted.length);

        if (Array.isArray(generationList) && generationList.length) {
            const normalized = normalizeGenerationList(generationList);
            if (normalized.length) {
                setGenerations(normalized);
                return;
            }
            setGenerations(generationList);
            return;
        }

        setGenerations((prev) => {
            if (prev && prev.length) return prev;
            return buildGenerationList(sorted);
        });
    };

    const getParams = (page) => {
        const params = { page, limit: itemsPerPage };

        if (activeFilter === 'mentor') {
            params.position = 'Mentor';
        } else if (activeFilter === 'generation' && selectedGeneration !== null) {
            params.generation = selectedGeneration;
        } else if (activeFilter?.startsWith('position:')) {
            params.position = selectedPosition || activeFilter.split(':')[1];
        }

        if (searchTerm) params.search = searchTerm;

        return params;
    };

    const applyClientSearchFilter = (list) => {
        if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) return list;
        const q = searchTerm.trim().toLowerCase();
        const nameMatch = (user) => {
            const parts = [
                user.name,
                user.fullname,
                user.full_name,
                user.first_name,
                user.last_name,
                user.displayName,
                user.display_name,
                user.username,
            ];
            const hay = parts.filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        };
        return list.filter(nameMatch);
    };

    const prefetchPage = async (page, expectedKey) => {
        try {
            if (cacheRef.current.pages.has(page)) return;
            if (cacheRef.current.key !== expectedKey) return;

            const response = await fetchPage(getParams(page));
            const fetched = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            const filtered = applyClientSearchFilter(fetched);
            const count = typeof response?.count === 'number' ? response.count : filtered.length;
            const generationList = response?.generations ?? response?.meta?.generations ?? null;

            if (cacheRef.current.key !== expectedKey) return;
            cacheRef.current.pages.set(page, { users: filtered, count, generationList });
        } catch {
            // ignore prefetch errors
        }
    };

    const cacheKey = JSON.stringify({ activeFilter, selectedGeneration, selectedPosition, searchTerm, itemsPerPage });

    const fetchUsers = async () => {
        try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            if (cacheRef.current.key !== cacheKey) {
                cacheRef.current.key = cacheKey;
                cacheRef.current.pages = new Map();
            }

            const cached = cacheRef.current.pages.get(currentPage);
            if (cached) {
                hydrateStateFromUsers(cached.users, cached.count, cached.generationList);
                setError(null);
                setLoading(false);
                setIsTransitioning(false);
                abortControllerRef.current = null;
                return;
            }

            // Only show loading for completely empty state, use transition for filter changes
            if (users.length === 0 && !cacheRef.current.pages.size) {
                setLoading(true);
                setIsTransitioning(false);
            } else {
                setLoading(false);
                setIsTransitioning(true);
            }

            const response = await fetchPage(getParams(currentPage));
            if (signal.aborted) return;

            const fetchedUsers = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            const filteredUsers = applyClientSearchFilter(fetchedUsers);
            const count = searchTerm && searchTerm.trim().length > 0
                ? filteredUsers.length
                : (typeof response?.count === 'number' ? response.count : filteredUsers.length);
            const generationList = response?.generations ?? response?.meta?.generations ?? null;

            cacheRef.current.pages.set(currentPage, { users: filteredUsers, count, generationList });
            hydrateStateFromUsers(filteredUsers, count, generationList);
            setError(null);

            const cachedCount = cacheRef.current.pages.get(currentPage)?.count ?? totalCount;
            const totalPages = Math.max(1, Math.ceil(cachedCount / itemsPerPage));
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1;

            if (nextPage <= totalPages && !cacheRef.current.pages.has(nextPage)) prefetchPage(nextPage, cacheKey);
            if (prevPage >= 1 && !cacheRef.current.pages.has(prevPage)) prefetchPage(prevPage, cacheKey);
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError('Failed to load members data');
            console.error(err);
        } finally {
            setLoading(false);
            setIsTransitioning(false);
            abortControllerRef.current = null;
        }
    };

    useEffect(() => {
        void fetchUsers();

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [currentPage, activeFilter, selectedGeneration, selectedPosition, searchTerm]);

    const refetch = () => {
        void fetchUsers();
    };

    return {
        users,
        totalCount,
        loading,
        isTransitioning,
        error,
        generations,
        refetch,
    };
}
