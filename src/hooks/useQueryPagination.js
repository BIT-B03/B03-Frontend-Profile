import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useQueryPagination({ param = 'page', defaultPage = 1 } = {}) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageFromQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const raw = Number(params.get(param));
        if (!Number.isFinite(raw) || raw < 1) return defaultPage;
        return Math.floor(raw);
    }, [location.search, param, defaultPage]);

    const [currentPage, setCurrentPage] = useState(pageFromQuery);

    useEffect(() => {
        setCurrentPage(pageFromQuery);
    }, [pageFromQuery]);

    const updateUrl = useCallback((page) => {
        const params = new URLSearchParams(location.search);
        const currentPageInUrl = Number(params.get(param)) || defaultPage;

        // Only update URL if the page actually changed
        if (currentPageInUrl !== page) {
            params.set(param, String(page));
            navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
        }
    }, [location.pathname, location.search, navigate, param, defaultPage]);

    const setPage = useCallback((page) => {
        const safe = Number.isFinite(page) && page > 0 ? Math.floor(page) : defaultPage;

        // Only update if page actually changed
        if (safe !== currentPage) {
            setCurrentPage(safe);
            updateUrl(safe);
        }
    }, [defaultPage, updateUrl, currentPage]);

    const resetPage = useCallback(() => {
        setPage(defaultPage);
    }, [defaultPage, setPage]);

    return {
        currentPage,
        setPage,
        resetPage,
    };
}
