import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import GuestMemberBackground from '../components/layout/GuestMemberBackground';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import ApplicantRetentionCard from '../components/admin-settings/ApplicantRetentionCard';
import DefaultGenerationCard from '../components/admin-settings/DefaultGenerationCard';
import SettingsNote from '../components/admin-settings/SettingsNote';
import useAdminSettings, { useBodyScrollLock } from '../hooks/useAdminSettings';

export default function Settings() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useBodyScrollLock(mobileSidebarOpen);

  const { retentionProps, generationProps } = useAdminSettings();

  return (
    <GuestMemberBackground>
      <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main
          className={`relative flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
        >
          <div className="p-6 sm:p-8 pb-16">
            <Header
              title="Settings"
              onMobileMenuClick={() => setMobileSidebarOpen(true)}
              onDesktopMenuClick={() => setCollapsed((v) => !v)}
            />

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <ApplicantRetentionCard {...retentionProps} />
              <DefaultGenerationCard {...generationProps} />
            </section>

            <section className="mt-6">
              <SettingsNote />
            </section>
          </div>
        </main>
      </div>
    </GuestMemberBackground>
  );
}
