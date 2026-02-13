import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';
import { getAvatarImageUrl } from '../../../api/api';

const MemberCard = ({ member }) => {
    const navigate = useNavigate();
    const avatarUrl = member.avatar_url ? getAvatarImageUrl(member.avatar_url) : null;
    const [isLoaded, setIsLoaded] = useState(!avatarUrl);

    const isMentor = member.position === 'Mentor';
    const displayPosition = isMentor
        ? member.position
        : `Generation ${member.generation}`;
    const badgeText = member.position || `Gen ${member.generation}`;

    const handleCardClick = () => {
        navigate(`/people/${member.hashed_id}`);
    };

    const badgeStyles = isMentor
        ? 'bg-filter-red-bg border-filter-red-border text-pure-white'
        : member.position === 'Members'
            ? 'bg-badge-members-bg border-badge-members-border text-pure-white'
            : 'bg-filter-sage-bg border-filter-sage-border text-pure-white';

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-brand-fill border border-brand-stroke rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-muted-gray/20 hover:border-muted-gray/50 w-full"
        >
            {isLoaded && (
                <div className="absolute top-3 right-3 z-40">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${badgeStyles}`}>
                        {badgeText}
                    </span>
                </div>
            )}

            <div>
                <ImageWithSkeleton
                    src={avatarUrl}
                    alt={member.name}
                    placeholderLetter={member.name.charAt(0).toUpperCase()}
                    onLoad={() => setIsLoaded(true)}
                />

                {isLoaded && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#010306]/100 to-transparent z-10" />

                        {/* Content */}
                        <div className="absolute left-4 right-4 bottom-4 z-30">
                            <h3 className="text-pure-white font-semibold text-lg leading-tight drop-shadow-md">
                                {member.name}
                            </h3>
                            <p className="text-muted-gray text-sm mt-0.5">{displayPosition}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberCard;
