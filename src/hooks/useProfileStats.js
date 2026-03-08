import { useEffect, useState } from 'react';
import { GetMyStatistics } from '../api/api';

const resolveStatsPayload = (payload) => {
  if (!payload) return null;
  if (payload.data) return payload.data;
  return payload;
};

export default function useProfileStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await GetMyStatistics();
        const data = resolveStatsPayload(resp);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('Gagal memuat statistik.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}
