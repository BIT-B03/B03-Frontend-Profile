import React, { useMemo } from 'react';
import { getAvatarImageUrl } from '../../api/api';

export default function MemberSettingsProfileCard({ member, profile, profileLoading, profileError }) {
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
        <div className="flex items-center gap-4">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="w-14 h-14 rounded-full bg-brand-fill/30 grid place-items-center text-xl font-semibold text-pure-white">
                    {initial}
                </div>
            )}

            <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-pure-white truncate tracking-tight">{displayName}</p>
                <p className="text-sm text-muted-gray/90 truncate mt-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{displayEmail}</span>
                </p>
                {profileLoading && <p className="text-xs text-brand-24e1c9/70 mt-2">Memuat profil...</p>}
                {profileError && <p className="text-xs text-filter-red-border mt-2">{profileError}</p>}
            </div>
        </div>
    );
}
