import React, { useState } from 'react';
import { getAvatarImageUrl } from '../../../api/api';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

const ProfileCard = ({ avatarUrl, name }) => {
    const imageSrc = getAvatarImageUrl(avatarUrl);
    const [isLoaded, setIsLoaded] = useState(!imageSrc);
    return (
        <div className="bg-brand-fill border border-brand-stroke rounded-3xl px-4 pt-5 shadow-2xl max-w-[320px] w-full h-[470px]">
            <div className="relative">
                <div className="relative w-full aspect-[4/6] rounded-2xl overflow-hidden shadow-inner">
                    <ImageWithSkeleton
                        src={imageSrc}
                        alt={name}
                        placeholderLetter={name?.charAt(0).toUpperCase()}
                        onLoad={() => setIsLoaded(true)}
                    />

                    {isLoaded && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#010306]/100 to-transparent z-10" />

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
