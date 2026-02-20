import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeaderUser, { getPositionStyle } from '../../hooks/useHeaderUser';

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
  const { username, position } = useHeaderUser();

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

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-tight min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-[96px] sm:max-w-[140px]">
              {username}
            </span>
            {position ? (
              <span
                className="mt-0.5 inline-block text-[9px] sm:text-[10px] font-medium tracking-widest uppercase px-1.5 py-0.5 rounded"
                style={getPositionStyle(position)}
              >
                {position}
              </span>
            ) : null}
          </div>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 group"
            style={{
              background: 'linear-gradient(135deg, rgba(36,225,201,0.25) 0%, rgba(31,76,116,0.5) 100%)',
              border: '1.5px solid rgba(36,225,201,0.35)',
              color: '#24e1c9',
            }}
            aria-label="Go to profile"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ boxShadow: '0 0 0 3px rgba(36,225,201,0.15), 0 0 16px rgba(36,225,201,0.25)' }}
            />
            {username.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}
