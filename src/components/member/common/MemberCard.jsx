import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarImageUrl } from '../../../api/api';

const MemberCard = ({ member, index = 0 }) => {
    const navigate = useNavigate();
    const avatarUrl = member.avatar_url ? getAvatarImageUrl(member.avatar_url) : null;

    // Per-card loading state: if tidak ada avatar, langsung dianggap loaded
    const [isLoaded, setIsLoaded] = useState(!avatarUrl);

    // Determine display position based on logic:
    const displayPosition = member.position === 'Mentor'
        ? member.position
        : `Generation ${member.generation}`;

    const handleCardClick = () => {
        navigate(`/people/${member.hashed_id}`);
    };

    // Staggered animation delay based on index
    const animationDelay = `${index * 0.08}s`;

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-brand-fill border border-brand-stroke rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-brand-24e1c9/20 hover:border-pure-white animate-slide-in"
            style={{ animationDelay }}
        >
            {/* Image area (pas-foto style) + skeleton */}
            <div className="relative w-full aspect-[4/6]">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setIsLoaded(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br to-brand-1f4c74 flex items-center justify-center">
                        <span className="text-4xl text-pure-white font-bold">{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                )}

                {/* Skeleton placeholder saat image belum selesai load */}
                {!isLoaded && (
                    <div className="absolute inset-0 skeleton-base skeleton-shimmer rounded-2xl" />
                )}

                {/* Overlay: gradient + glow + name hanya tampil ketika loaded */}
                {isLoaded && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-[#253C6F]/100 to-transparent z-10" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-10/12 h-8 rounded-full bg-[#253C6F]/100 blur-2xl z-20" />
                        <div className="absolute left-4 bottom-3 text-pure-white font-semibold text-lg drop-shadow-md z-30">
                            {member.name}
                            <p className="text-pure-white text-sm">{displayPosition}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberCard;
