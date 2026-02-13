import React, { useState } from 'react';
import { getAvatarImageUrl } from '../../../api/api';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import BioSection from './BioSection';

const ProfileCard = ({ avatarUrl, name, email, position, generation, bio, loading = false }) => {
    const imageSrc = getAvatarImageUrl(avatarUrl);
    const [isLoaded, setIsLoaded] = useState(!imageSrc || loading);

    const generationLabel = generation ? `GENERATION ${generation}` : null;
    const positionLabel = position ? position.toUpperCase() : null;

    const isMentor = position === 'Mentor';
    const badgeStyles = isMentor
        ? 'bg-filter-red-bg/10 border-filter-red-border text-filter-red-border'
        : position === 'Members'
            ? 'bg-badge-members-bg/10 border-badge-members-border text-badge-members-border'
            : 'bg-filter-sage-bg/10 border-filter-sage-border text-filter-sage-border';

    const generationBadgeStyles = 'bg-filter-sage-bg/10 border-filter-sage-border text-filter-sage-border';

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-4 md:gap-10">
                <div className="w-64 h-72 sm:w-72 sm:h-[22rem] md:w-80 md:h-[26rem] rounded-2xl skeleton-base skeleton-shimmer flex-shrink-0" />
                <div className="flex flex-col gap-4 pb-1 w-full max-w-xl">
                    <div className="h-10 w-3/4 rounded-lg skeleton-base skeleton-shimmer" />
                    <div className="flex gap-3">
                        <div className="h-6 w-28 rounded-full skeleton-base skeleton-shimmer" />
                        <div className="h-6 w-32 rounded-full skeleton-base skeleton-shimmer" />
                    </div>
                    <div className="h-4 w-40 rounded skeleton-base skeleton-shimmer" />

                    {/* Bio skeleton */}
                    <div className="space-y-3 max-w-3xl mt-4">
                        <div className="h-6 w-full rounded skeleton-base skeleton-shimmer" />
                        <div className="h-6 w-4/5 rounded skeleton-base skeleton-shimmer" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-4 md:gap-10">
            {/* Avatar image */}
            <div className={`relative w-60 sm:w-56 md:w-80 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 ${!isLoaded ? 'skeleton-base skeleton-shimmer' : ''}`}>
                <ImageWithSkeleton
                    src={imageSrc}
                    alt={name}
                    placeholderLetter={name?.charAt(0).toUpperCase()}
                    onLoad={() => setIsLoaded(true)}
                />

                {isLoaded && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#010306]/100 to-transparent z-10" />
                    </div>
                )}
            </div>

            {/* Profile info — centered vertically next to the avatar */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                {/* Name */}
                <h1 className="pb-3 font-bold text-4xl sm:text-5xl md:text-5xl lg:text-7xl tracking-tight leading-tight font-inter bg-gradient-to-r from-white via-white/100 to-brand-24e1c9/70 text-transparent bg-clip-text">
                    {name}
                </h1>

                {/* Badges */}
                <div className="mb-2 md:mb-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    {generationLabel && (
                        <span className={`px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-3 md:py-1 md:text-xs lg:px-4 lg:py-2 lg:text-sm font-bold tracking-widest rounded-full border ${generationBadgeStyles} uppercase`}>
                            {generationLabel}
                        </span>
                    )}
                    {positionLabel && (
                        <span className={`px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-3 md:py-1 md:text-xs lg:px-4 lg:py-2 lg:text-sm font-bold tracking-widest rounded-full border ${badgeStyles} uppercase`}>
                            {positionLabel}
                        </span>
                    )}
                </div>

                {/* Email */}
                {email && (
                    <div className="flex items-center gap-3 text-pure-white/80 text-sm sm:text-base md:text-sm lg:text-base px-4 py-2 md:px-3 md:py-1 lg:px-4 lg:py-2 rounded-[10px] border border-white/10 bg-white/5">
                        <img src="/svg/email.svg" alt="email" className="w-6 h-6 flex-shrink-0" />
                        <span className="pb-0.5 font-medium tracking-wide">{email}</span>
                    </div>
                )}

                {bio && (
                    <div className="w-full mt-4">
                        <BioSection bio={bio} className="mt-0" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
