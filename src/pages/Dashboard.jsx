import React, { useEffect, useState } from 'react';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import useDashboardData from '../hooks/useDashboardData';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatisticCard from '../components/Dashboard/StatisticCard';
import StatistikChart from '../components/Dashboard/StatistikChart';
import RecentProject from '../components/Dashboard/RecentProject';
import DashboardLoading from '../components/Dashboard/DashboardLoading';
import DashboardNoContent from '../components/Dashboard/DashboardNoContent';


export default function Dashboard() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { loading, stats } = useDashboardData();

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
  }, [mobileSidebarOpen]);

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
