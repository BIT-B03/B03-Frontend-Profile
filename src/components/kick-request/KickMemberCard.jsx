import React from 'react';
import { getAvatarImageUrl } from '../../api/api';

function getMemberInitials(name) {
    if (!name) return '?';
    return String(name).trim().charAt(0).toUpperCase();
}

function formatMemberSecondaryLine(member) {
    if (!member) return '';
    const parts = [];
    if (member.position) parts.push(member.position);
    if (member.division) parts.push(member.division);
    if (member.position !== 'Mentor' && member.generation !== undefined && member.generation !== null) {
        parts.push(`Generation ${member.generation}`);
    }
    return parts.join(' • ');
}

export default function KickMemberCard({ member, selected, onToggle }) {
    const avatarSrc = member?.avatar_url ? getAvatarImageUrl(member.avatar_url) : null;
    const initials = getMemberInitials(member?.name || '');
    const secondaryLine = formatMemberSecondaryLine(member);

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300 flex items-center gap-4 ${selected
                ? 'border-brand-24e1c9 bg-brand-fill/30 shadow-[0_0_25px_rgba(36,225,201,0.05)]'
                : 'border-brand-fill/60 bg-brand-fill/60 hover:border-brand-24e1c9/30'
                }`}
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
                    <p className={`text-lg font-semibold truncate ${selected ? 'text-brand-24e1c9' : 'text-pure-white group-hover:text-brand-24e1c9'}`}>
                        {member.name}
                    </p>
                    <p className="text-sm text-muted-gray truncate">{secondaryLine || 'Member'}</p>
                </div>
            </div>

            <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${selected
                    ? 'border-brand-24e1c9 bg-brand-24e1c9 text-dark-bg'
                    : 'border-white/20 text-muted-gray'
                    }`}
            >
                {selected ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                )}
            </div>
        </button>
    );
}
