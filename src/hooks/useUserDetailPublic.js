import { useState, useCallback, useEffect } from 'react';
import { getUserPublicData } from '../api/api';

export default function useUserPublicData(userId = {}) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        if (!userId) return null;

        setLoading(true);
        setError(null);

        try {
            const resp = await getUserPublicData(userId);
            const data = resp?.data ?? null;
            setUserData(data);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to load user data');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId]);

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
