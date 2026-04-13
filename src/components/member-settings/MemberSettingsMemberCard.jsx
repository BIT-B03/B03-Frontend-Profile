import React from 'react';
import { getAvatarImageUrl } from '../../api/api';

function getMemberInitials(name) {
    if (!name) return '?';
    return String(name).trim().charAt(0).toUpperCase();
}

function formatMemberSecondaryLine(member) {
    if (!member) return '';
    const cap = (val) => (typeof val === 'string' && val.length ? val.charAt(0).toUpperCase() + val.slice(1) : val);
    const parts = [];
    if (member.position) parts.push(cap(member.position));
    if (member.division) parts.push(cap(member.division));
    if (member.role) parts.push(cap(member.role));
    return parts.join(' • ');
}

export default function MemberSettingsMemberCard({ member, onEdit }) {
    const avatarSrc = member?.avatar_url ? getAvatarImageUrl(member.avatar_url) : null;
    const initials = getMemberInitials(member?.name || '');
    const secondaryLine = formatMemberSecondaryLine(member);

    return (
        <div
            className="group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300 flex items-center gap-4 border-brand-fill/60 bg-brand-fill/60 hover:border-brand-24e1c9/30"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={member.name}
                            className="w-14 h-14 rounded-full object-cover border border-brand-stroke"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-brand-fill/30 border border-brand-stroke grid place-items-center text-xl font-semibold text-pure-white">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-lg font-semibold truncate text-pure-white group-hover:text-brand-24e1c9">
                        {member.name}
                    </p>
                    <p className="text-sm text-muted-gray truncate">{secondaryLine || 'Member'}</p>
                </div>
            </div>

            <button
                type="button"
                onClick={onEdit}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors border-white/20 text-muted-gray hover:border-brand-24e1c9 hover:text-brand-24e1c9 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/60"
                aria-label="Edit position and role"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16.862 3.487a2.25 2.25 0 113.182 3.182L8.25 18.463 3 21l2.537-5.25 11.325-12.263z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 5.25l3 3" />
                </svg>
            </button>
        </div>
    );
}
