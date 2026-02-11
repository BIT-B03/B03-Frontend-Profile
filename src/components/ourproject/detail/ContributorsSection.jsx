import React from 'react';
import { getAvatarImageUrl } from '../../../api/api';
import ImageWithSkeleton from '../../member/common/ImageWithSkeleton';
import GitIcon from '../../../assets/Git.svg';
import RectIcon from '../../../assets/rectangle.svg';

const ContributorCard = ({ id, avatar_url, name, generation }) => {
    const avatarUrl = avatar_url ? getAvatarImageUrl(avatar_url) : null;
    const [isLoaded, setIsLoaded] = React.useState(!avatarUrl);

    const badgeText = generation ? `Gen ${generation}` : null;
    const displayGeneration = generation ? `Generation ${generation}` : '';

    const badgeStyles = 'bg-filter-sage-bg border-filter-sage-border text-pure-white';

    return (
        <div className="group relative bg-brand-fill border border-brand-stroke rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-muted-gray/20 hover:border-muted-gray/50">
            {/* Badge */}
            {isLoaded && badgeText && (
                <div className="absolute top-3 right-3 z-40">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${badgeStyles}`}>
                        {badgeText}
                    </span>
                </div>
            )}

            {/* Image with Skeleton */}
            <div>
                <ImageWithSkeleton
                    src={avatarUrl}
                    alt={name}
                    placeholderLetter={name.charAt(0).toUpperCase()}
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Gradient Overlay and Content */}
                {isLoaded && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#010306]/100 to-transparent z-10" />

                        {/* Content */}
                        <div className="absolute left-4 right-4 bottom-4 z-30">
                            <h3 className="text-pure-white font-semibold text-lg leading-tight drop-shadow-md">
                                {name}
                            </h3>
                            {displayGeneration && (
                                <p className="text-muted-gray text-sm mt-0.5">{displayGeneration}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContributorsSection = ({ contributors = [] }) => {
    if (!contributors || contributors.length === 0) {
        return (
            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8 text-center">
                <p className="text-gray-400 text-lg">No contributors found</p>
            </div>
        );
    }

    // Use CSS positioning for the accent bar (no JS measurement needed)

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="inline-flex flex-col items-start w-max">
                    <div className="flex items-center gap-3">
                        <img src={GitIcon} alt="Git Icon" className="w-8 h-8 sm:w-11 sm:h-11" />
                        <div className="relative inline-block">
                            <h2 className="text-2xl sm:text-2xl md:text-4xl font-bold text-pure-white font-inter">Contributor</h2>
                            <img
                                src={RectIcon}
                                alt="accent bar"
                                className="absolute left-1/2 top-full mt-0.5 h-1 rounded-full transform -translate-x-1/2 w-3/4"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {contributors.map((contributor, idx) => (
                    <ContributorCard
                        key={contributor.id || idx}
                        id={contributor.id}
                        avatar_url={contributor.avatar_url}
                        name={contributor.name}
                        generation={contributor.generation}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContributorsSection;
