import React, { useEffect, useMemo, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatisticCard from '../components/Dashboard/StatisticCard';
import StatistikChart from '../components/Dashboard/StatistikChart';
import RecentProject from '../components/Dashboard/RecentProject';
import DashboardLoading from '../components/Dashboard/DashboardLoading';
import DashboardNoContent from '../components/Dashboard/DashboardNoContent';
import { GetMyStatistics, SetAuthToken } from '../api/api';
import { toErrorPageState } from '../utils/errorState';

export default function Dashboard() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsPayload, setStatsPayload] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const stats = useMemo(() => statsPayload?.data || null, [statsPayload]);

  useEffect(() => {
    // Lock body scroll when mobile sidebar drawer is open
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

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

  return (
    <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <div className="p-6 sm:p-8">
          <Header
            title="Dashboard"
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
            onDesktopMenuClick={() => setCollapsed((v) => !v)}
          />

          {loading ? (
            <DashboardLoading />
          ) : stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatisticCard
                  title="Project"
                  subtitle="Progress project"
                  stats={stats.projects}
                  variant="blue"
                />
                <StatisticCard
                  title="Contributors Progress"
                  subtitle="Progress kontribusi"
                  stats={stats.contributors}
                  variant="yellow"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="order-2 lg:order-1 lg:col-span-2">
                  <RecentProject projects={stats.recent_projects} />
                </div>
                <div className="order-1 lg:order-2">
                  <StatistikChart overall={stats.overall} />
                </div>
              </div>
            </div>
          ) : (
            <DashboardNoContent />
          )}
        </div>
      </main>
    </div>
  );
}
