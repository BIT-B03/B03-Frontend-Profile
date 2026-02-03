import React, { useState } from 'react';
import { getAvatarImageUrl } from '../../../api/api';

const ProfileCard = ({ avatarUrl, name }) => {
    const imageSrc = getAvatarImageUrl(avatarUrl);
    const [isLoaded, setIsLoaded] = useState(!imageSrc);
    return (
        <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-4 shadow-2xl max-w-[320px] w-full h-[480px]">
            <div className="relative">
                {/* Profile Image */}
                <div className="relative w-full aspect-[4/6] rounded-2xl overflow-hidden shadow-inner">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={name}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            style={{ opacity: isLoaded ? 1 : 0 }}
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setIsLoaded(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-186bb5 to-brand-1f4c74 flex items-center justify-center">
                            <svg className="w-24 h-24 text-pure-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    {/* Skeleton overlay while image loading */}
                    {!isLoaded && (
                        <div className="absolute inset-0 skeleton-base skeleton-shimmer rounded-2xl" />
                    )}

                    {/* Bottom gradient overlay for readable name + glow highlight (only when loaded) */}
                    {isLoaded && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-0 right-0 bottom-0 h-28 bg-gradient-to-t from-[#253C6F]/100 to-transparent z-10" />

                            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-4/5 h-12 rounded-full bg-[#253C6F]/100 blur-3xl z-20" />

                            <div className="absolute left-4 bottom-4 text-pure-white font-inter font-bold text-2xl drop-shadow-lg z-30">
                                {name}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
