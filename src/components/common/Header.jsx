import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAndRedirect } from '../../hooks/logout';

const HamburgerIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Header({
  title = 'Dashboard',
  onMenuClick,
  onMobileMenuClick,
  onDesktopMenuClick,
}) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get username from localStorage or default
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    logoutAndRedirect({ navigate });
  };

  return (
    <header className="relative rounded-xl px-6 py-4 mb-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-1f4c74/40 via-brand-24e1c9/20 to-brand-1f4c74/40 backdrop-blur-xl" />
      <div className="absolute inset-0 border border-brand-24e1c9/30 rounded-xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {(() => {
            const mobileHandler = onMobileMenuClick || onMenuClick;
            const desktopHandler = onDesktopMenuClick || null;

            return (
              <>
                {/* Mobile: open drawer */}
                {mobileHandler ? (
                  <button
                    type="button"
                    onClick={mobileHandler}
                    className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-muted-gray hover:text-brand-24e1c9 hover:bg-white/10 transition"
                    aria-label="Open menu"
                    title="Menu"
                  >
                    <HamburgerIcon />
                  </button>
                ) : null}

                {/* Desktop: toggle sidebar collapse */}
                {desktopHandler ? (
                  <button
                    type="button"
                    onClick={desktopHandler}
                    className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-muted-gray hover:text-brand-24e1c9 hover:bg-white/10 transition"
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                  >
                    <HamburgerIcon />
                  </button>
                ) : null}
              </>
            );
          })()}

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-pure-white truncate">{title}</h1>
          </div>
        </div>

        {/* Right: User Info + Members + Profile */}
        <div className="flex items-center gap-4">
          {/* Username */}
          <span className="hidden sm:block text-sm font-medium text-pure-white">
            {username}
          </span>

          {/* Members Badge/Link */}
          <button
            onClick={() => navigate('/people')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-24e1c9/20 to-brand-1f4c74/20 border border-brand-24e1c9/40 hover:border-brand-24e1c9 hover:shadow-[0_0_15px_rgba(36,225,201,0.3)] transition text-brand-24e1c9 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Members
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-24e1c9/30 to-brand-1f4c74/30 border-2 border-brand-24e1c9/40 hover:border-brand-24e1c9 hover:shadow-[0_0_15px_rgba(36,225,201,0.4)] transition flex items-center justify-center text-brand-24e1c9 font-semibold"
              aria-label="User menu"
            >
              {username.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-2 z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-1f4c74/95 to-dark-bg/95 backdrop-blur-xl" />
                  <div className="absolute inset-0 border border-brand-24e1c9/30 rounded-lg" />
                  <div className="relative">
                    <div className="px-4 py-2 border-b border-brand-24e1c9/20 bg-gradient-to-r from-brand-24e1c9/10 to-transparent">
                      <p className="text-sm font-medium text-pure-white">{username}</p>
                      <p className="text-xs text-brand-24e1c9">Logged in</p>
                    </div>

                    <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-pure-white hover:bg-brand-24e1c9/10 hover:text-brand-24e1c9 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-pure-white hover:bg-brand-24e1c9/10 hover:text-brand-24e1c9 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>

                    <hr className="my-2 border-brand-24e1c9/20" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
