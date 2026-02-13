import React from 'react';

const SOCIAL_ICONS = {
    linkedin: { label: 'LinkedIn' },
    github: { label: 'GitHub' },
    instagram: { label: 'Instagram' },
    facebook: { label: 'Facebook' },
    youtube: { label: 'YouTube' },
};

const SocialLinks = ({ sosmed = {}, className = '', loading = false }) => {
    if (loading) {
        return (
            <div className={`max-w-4xl ${className}`}>
                <p className="text-pure-white/60 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">Network</p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full skeleton-base skeleton-shimmer" />
                    <div className="w-10 h-10 rounded-full skeleton-base skeleton-shimmer" />
                    <div className="w-10 h-10 rounded-full skeleton-base skeleton-shimmer" />
                </div>
            </div>
        );
    }

    const safeSosmed = sosmed || {};
    const activeSocials = Object.entries(safeSosmed).filter(([, url]) => url && url.trim() !== '');
    if (activeSocials.length === 0) return null;

    return (
        <div className={`max-w-4xl ${className}`}>
            <p className="text-pure-white/60 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">Network</p>
            <div className="flex flex-wrap items-center gap-3">
                {activeSocials.map(([platform, url]) => {
                    const social = SOCIAL_ICONS[platform];
                    if (!social) return null;
                    return (
                        <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="w-10 h-10 rounded-full border border-pure-white/15 flex items-center justify-center text-pure-white/70 hover:text-filter-sage-border hover:border-filter-sage-border/60 hover:bg-filter-sage-border/10 transition-all duration-200"
                        >
                            <span
                                role="img"
                                aria-hidden="true"
                                className="w-4 h-4"
                                style={{
                                    WebkitMaskImage: `url(/svg/${platform}.svg)`,
                                    maskImage: `url(/svg/${platform}.svg)`,
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskSize: 'contain',
                                    maskSize: 'contain',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    backgroundColor: 'currentColor',
                                }}
                            />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialLinks;
