import React, { useEffect, useState } from 'react';
import useSidebarNavigation from '../../hooks/useSidebarNavigation';
import SidebarInner from './sidebarpart/SidebarInner';

export default function Sidebar({ collapsed, mobileOpen = false, onMobileClose }) {
  const { activePath, menuItems, goTo, logout } = useSidebarNavigation({
    onClose: onMobileClose,
  });

  const [isWidthTransitioning, setIsWidthTransitioning] = useState(false);

  useEffect(() => {
    setIsWidthTransitioning(true);
    const timer = setTimeout(() => setIsWidthTransitioning(false), 220);
    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <>
      {/* Desktop */}
      <div
        className="hidden lg:block fixed top-0 left-0"
        style={{
          width: collapsed ? 80 : 288,
          zIndex: 40,
          height: '100dvh',
          overflow: 'visible',
          transition: `width 200ms cubic-bezier(0.4,0,0.2,1)`,
          pointerEvents: isWidthTransitioning ? 'none' : 'auto',
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName === 'width') {
            setIsWidthTransitioning(false);
          }
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

      {/* Mobile drawer */}
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <div
          className={`fixed top-0 left-0 z-50 h-[100dvh] w-72 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
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
