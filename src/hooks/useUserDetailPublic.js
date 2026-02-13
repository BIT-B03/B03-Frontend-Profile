import { useState, useCallback, useEffect } from 'react';
import { getUserPublicData } from '../api/api';
import { getCachedData, setCachedData } from '../utils/cache';

export default function useUserPublicData(userId, { useCache = true } = {}) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async ({ bypassCache = false } = {}) => {
        if (!userId) return null;

        setLoading(true);
        setError(null);

        const cacheKey = `member:detail:${userId}`;

        try {
            if (useCache && !bypassCache) {
                const cached = getCachedData(cacheKey);
                if (cached) {
                    setUserData(cached);
                    setLoading(false);
                    return cached;
                }
            }

            const resp = await getUserPublicData(userId);
            const data = resp?.data ?? null;
            setUserData(data);
            if (data) setCachedData(cacheKey, data);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to load user data');
            console.error(err);
            // Do not re-throw here to avoid unhandled promise rejections
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, useCache]);

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            if (!userId) {
                if (isMounted) setLoading(false);
                return;
            }

            // fetchUser already handles loading/error/cache
            try {
                await fetchUser();
            } catch (e) {
                // fetchUser will set error; swallow here to avoid unhandled rejections
                if (isMounted) console.error(e);
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, [userId, fetchUser]);

    return {
        userData,
        loading,
        error,
        refetch: (opts) => fetchUser(opts ?? {}),
    };
}
