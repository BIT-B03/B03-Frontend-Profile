import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetMyStatistics, SetAuthToken } from '../api/api';
import { toErrorPageState } from '../utils/errorState';

export default function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [statsPayload, setStatsPayload] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const stats = useMemo(() => statsPayload?.data || null, [statsPayload]);

  useEffect(() => {
    const token = localStorage.getItem('auth_access_token');
    const role = (localStorage.getItem('role') || '').toString().toLowerCase();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    SetAuthToken(token);

    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        if (role === 'superuser') {
          if (!cancelled) setStatsPayload(null);
          return;
        }
        const res = await GetMyStatistics();
        if (!cancelled) setStatsPayload(res);
      } catch (err) {
        if (cancelled) return;

        const status = err?.response?.status;
        if (status === 403) {
          if (!cancelled) setStatsPayload(null);
          return;
        }
        navigate('/error', {
          replace: true,
          state: toErrorPageState(err, {
            context: 'Dashboard statistik',
            from: location,
            status,
            primaryCta:
              status === 401
                ? { label: 'Login', to: '/login', replace: true }
                : { label: 'Ke Beranda', to: '/', replace: true },
          }),
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return { loading, stats };
}
