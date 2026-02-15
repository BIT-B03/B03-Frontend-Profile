import React from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import useSidebarNavigation from '../../hooks/useSidebarNavigation';
import LogoutButton from './LogoutButton';
import SidebarIcons from './sidebarIcons';

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
      width="288px"
      collapsedWidth="80px"
      backgroundColor="rgba(8, 10, 15, 0.98)"
      style={{
        height: '100dvh',
        borderRight: '1px solid rgba(36, 225, 201, 0.15)',
      }}
    >
      <div className="relative flex h-full flex-col overflow-hidden">
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
              button: ({ active, level }) => ({
                ...menuButtonBase,
                backgroundColor: active ? 'rgba(36, 225, 201, 0.12)' : 'transparent',
                color: active ? '#24e1c9' : '#BAB7C2',
                fontWeight: active ? 600 : 400,
                fontSize: level > 0 ? '0.75rem' : '0.85rem',
                border: active ? '1px solid rgba(36, 225, 201, 0.25)' : '1px solid transparent',
                borderRadius: isCollapsed ? '14px' : '10px',
                padding: isCollapsed ? '0' : '10px 20px',
                height: isCollapsed ? '52px' : 'auto',
                width: isCollapsed ? '56px' : 'auto',
                margin: isCollapsed ? '6px auto' : '4px 12px',
                paddingLeft: !isCollapsed && level > 0 ? 28 : undefined,
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
              subMenuContent: () => ({
                backgroundColor: 'transparent',
                paddingLeft: isCollapsed ? 0 : 8,
              }),
            }}
          >
            {menuItems.map((item) => {
              if (item.children && item.children.length > 0) {
                const isActive = item.children.some((child) => activePath === child.path);
                return (
                  <SubMenu
                    key={item.label}
                    icon={SidebarIcons[item.iconKey] || null}
                    label={item.label}
                    defaultOpen={isActive}
                  >
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.path}
                        icon={child.iconKey ? SidebarIcons[child.iconKey] : null}
                        active={activePath === child.path}
                        onClick={() => onGo(child.path)}
                        title={isCollapsed ? child.label : undefined}
                      >
                        {isCollapsed ? null : child.label}
                      </MenuItem>
                    ))}
                  </SubMenu>
                );
              }

              return (
                <MenuItem
                  key={item.path}
                  icon={SidebarIcons[item.iconKey] || null}
                  active={activePath === item.path}
                  onClick={() => onGo(item.path)}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? null : item.label}
                </MenuItem>
              );
            })}
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
      <div
        className="hidden lg:block fixed top-0 left-0"
        style={{
          width: collapsed ? 80 : 288,
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

      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <div
          className={`fixed top-0 left-0 z-50 h-[100dvh] w-72 transition-transform duration-300 ${
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
