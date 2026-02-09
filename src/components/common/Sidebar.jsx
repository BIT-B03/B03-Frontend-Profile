import React from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import useSidebarNavigation from '../../hooks/useSidebarNavigation';
import LogoutButton from './LogoutButton';

const HamburgerIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const menuButtonBase = {
  backgroundColor: 'transparent',
  color: '#BAB7C2',
  transition: 'all 0.2s',
  border: '1px solid transparent',
};

const SidebarIcons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  members: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function SidebarInner({
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
      width="256px"
      collapsedWidth="80px"
      backgroundColor="rgba(8, 10, 15, 0.98)"
      style={{
        height: '100dvh',
        borderRight: '1px solid rgba(36, 225, 201, 0.15)',
      }}
    >
      <div className="relative flex h-full flex-col overflow-hidden">
        {/* Header with Logo */}
        <div
          className={`relative flex items-center ${
            isCollapsed ? 'justify-center px-4 pt-6 pb-8' : 'gap-3 p-6 pb-8'
          }`}
        >
          {/* Logo */}
          <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm font-bold text-brand-24e1c9">B</span>
          </div>

          {!isCollapsed && <h2 className="text-xl font-bold text-pure-white">BIT-B03</h2>}


          {/* Mobile close button (hamburger toggle) */}
          {showMobileClose && (
            <button
              onClick={onMobileClose}
              className="ml-auto p-2 rounded-lg hover:bg-white/5 transition text-muted-gray hover:text-brand-24e1c9"
              aria-label="Close menu"
              title="Close menu"
            >
              <HamburgerIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-2">
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                ...menuButtonBase,
                backgroundColor: active ? 'rgba(36, 225, 201, 0.12)' : 'transparent',
                color: active ? '#24e1c9' : '#BAB7C2',
                fontWeight: active ? 600 : 400,
                border: active ? '1px solid rgba(36, 225, 201, 0.25)' : '1px solid transparent',
                borderRadius: isCollapsed ? '14px' : '10px',
                padding: isCollapsed ? '0' : '10px 20px',
                height: isCollapsed ? '52px' : 'auto',
                width: isCollapsed ? '56px' : 'auto',
                margin: isCollapsed ? '6px auto' : '4px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: 'rgba(36, 225, 201, 0.08)',
                  color: '#24e1c9',
                  border: '1px solid rgba(36, 225, 201, 0.15)',
                },
              }),
              icon: () => ({
                marginRight: isCollapsed ? 0 : 10,
              }),
              label: () => ({
                display: isCollapsed ? 'none' : 'block',
              }),
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                icon={SidebarIcons[item.iconKey] || null}
                active={activePath === item.path}
                onClick={() => onGo(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                {isCollapsed ? null : item.label}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* Logout at bottom */}
        <div className="mt-auto p-4 border-t border-white/5">
          <LogoutButton collapsed={isCollapsed} onClick={onLogout} />
        </div>
      </div>
    </ProSidebar>
  );
}

export default function Sidebar({ collapsed, mobileOpen = false, onMobileClose }) {
  const { activePath, menuItems, goTo, logout } = useSidebarNavigation({
    onClose: onMobileClose,
  });


  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden lg:block fixed top-0 left-0"
        style={{
          width: collapsed ? 80 : 256,
          zIndex: 40,
          height: '100dvh',
          overflow: 'visible',
        }}
      >
        <SidebarInner
          isCollapsed={collapsed}
          showMobileClose={false}
          activePath={activePath}
          menuItems={menuItems}
          onGo={goTo}
          onMobileClose={onMobileClose}
          onLogout={logout}
        />
      </div>

      {/* Mobile drawer sidebar */}
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <div
          className={`fixed top-0 left-0 z-50 h-[100dvh] w-64 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarInner
            isCollapsed={false}
            showMobileClose
            activePath={activePath}
            menuItems={menuItems}
            onGo={goTo}
            onMobileClose={onMobileClose}
            onLogout={logout}
          />
        </div>
      </div>
    </>
  );
}
