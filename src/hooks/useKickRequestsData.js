import { useCallback, useEffect, useMemo, useState } from 'react';
import { getKickRequests } from '../api/api';

const sortByCreatedAtDesc = (list) => {
    return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const mapStats = (requests) => {
    const base = { total: requests.length, pending: 0, approved: 0, rejected: 0 };
    requests.forEach((req) => {
        const key = (req.status || '').toLowerCase();
        if (key === 'pending') base.pending += 1;
        else if (key === 'approved') base.approved += 1;
        else if (key === 'rejected') base.rejected += 1;
    });
    return base;
};

export default function useKickRequestsData() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRequests = useCallback(async ({ guard } = {}) => {
        setLoading(true);
        try {
            const data = await getKickRequests();
            if (guard?.current) return;

            const list = Array.isArray(data) ? sortByCreatedAtDesc(data) : [];
            setRequests(list);
            setError(null);
        } catch (err) {
            if (guard?.current) return;
            console.error('Failed to load kick requests', err);
            setError('Failed to load kick requests.');
        } finally {
            if (guard?.current);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const guard = { current: false };
        loadRequests({ guard });
        return () => {
            guard.current = true;
        };
    }, [loadRequests]);

    const stats = useMemo(() => mapStats(requests), [requests]);

    const refetch = useCallback(() => loadRequests(), [loadRequests]);

    return {
        requests,
        loading,
        error,
        stats,
        refetch,
    };
}
