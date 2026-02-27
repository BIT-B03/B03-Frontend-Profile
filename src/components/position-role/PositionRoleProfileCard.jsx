import React, { useMemo } from 'react';
import { getAvatarImageUrl } from '../../api/api';

export default function PositionRoleProfileCard({ member, profile, profileLoading, profileError }) {
    const displayName = profile?.name || member?.name || 'Selected member';
    const displayEmail = profile?.email || member?.email || 'Email tidak tersedia';

    const avatarUrl = useMemo(() => {
        const src = profile?.avatar_url || member?.avatar_url || null;
        return src ? getAvatarImageUrl(src) : null;
    }, [profile?.avatar_url, member?.avatar_url]);

    const initial = useMemo(() => {
        const name = profile?.name || member?.name || '';
        return name ? name.trim().charAt(0).toUpperCase() : '?';
    }, [profile?.name, member?.name]);

    return (
        <div className="relative flex items-center gap-4 rounded-2xl glass border-brand-stroke/40 px-5 py-4 shadow-lg shadow-black/10 overflow-hidden group hover:border-brand-24e1c9/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-24e1c9/5 to-brand-1f4c74/5 opacity-0 transition-opacity duration-300"></div>
            {avatarUrl ? (
                <div className="relative z-10">
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-16 h-16 rounded-full object-cover shadow-lg transition-all duration-300"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="relative z-10 w-14 h-14 rounded-full bg-brand-fill/30 border border-brand-stroke grid place-items-center text-xl font-semibold text-pure-white">
                    {initial}
                </div>
            )}

            <div className="relative z-10 min-w-0 flex-1">
                <p className="text-xl font-bold text-pure-white truncate tracking-tight">{displayName}</p>
                <p className="text-sm text-muted-gray/90 truncate mt-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{displayEmail}</span>
                </p>
                {profileLoading && <p className="text-xs text-brand-24e1c9/70 mt-2 animate-pulse flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-brand-24e1c9 animate-ping"></span>Memuat profil...</p>}
                {profileError && <p className="text-xs text-filter-red-border mt-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-filter-red-border"></span>{profileError}</p>}
            </div>
        </div>
    );
}
