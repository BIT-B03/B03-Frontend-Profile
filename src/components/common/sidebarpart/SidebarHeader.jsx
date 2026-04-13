import React from 'react';
import Logo from '../../../assets/bitlogo.png';
const HamburgerIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function SidebarHeader({ isCollapsed, showMobileClose, onMobileClose }) {
  return (
    <div className={`relative flex items-center shrink-0 ${isCollapsed ? 'justify-center py-6' : 'gap-3 px-5 py-6'}`}>
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-10 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #24e1c9 0%, transparent 70%)' }}
      />

      <div className="relative shrink-0 grid place-items-center w-10 h-10">
        <img src={Logo} alt="BIT-B03 logo" className="w-8 h-8" />
      </div>

      {!isCollapsed && (
        <div>
          <h2 className="text-base font-extrabold text-pure-white leading-none tracking-wide">BIT-B03</h2>
          <p className="text-[10px] text-brand-24e1c9/60 mt-0.5 tracking-widest uppercase">Navigation</p>
        </div>
      )}

      {showMobileClose && (
        <button
          onClick={onMobileClose}
          className="ml-auto p-2 rounded-lg hover:bg-white/5 transition text-muted-gray hover:text-brand-24e1c9"
          aria-label="Close menu"
        >
          <HamburgerIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
