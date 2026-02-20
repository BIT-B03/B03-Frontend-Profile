import React from 'react';
import { Sidebar as ProSidebar } from 'react-pro-sidebar';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

export default function SidebarInner({
  isCollapsed,
  showMobileClose,
  activePath,
  menuItems,
  onGo,
  onMobileClose,
  onLogout,
}) {
  return (
    <ProSidebar
      collapsed={isCollapsed}
      width="288px"
      collapsedWidth="80px"
      backgroundColor="transparent"
      style={{
        height: '100dvh',
        background: 'linear-gradient(180deg, rgba(8,10,15,0.99) 0%, rgba(10,16,28,0.99) 100%)',
        borderRight: '1px solid rgba(36,225,201,0.12)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative flex h-full flex-col overflow-hidden">
        <SidebarHeader isCollapsed={isCollapsed} showMobileClose={showMobileClose} onMobileClose={onMobileClose} />

        <div
          className="mx-4 shrink-0"
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(36,225,201,0.3), transparent)',
          }}
        />

        <div className="flex-1 overflow-y-auto overscroll-contain py-3 px-0 sidebar-scrollbar">
          <SidebarMenu
            isCollapsed={isCollapsed}
            activePath={activePath}
            menuItems={menuItems}
            onGo={onGo}
          />
        </div>

        <SidebarFooter collapsed={isCollapsed} onLogout={onLogout} />
      </div>
    </ProSidebar>
  );
}
