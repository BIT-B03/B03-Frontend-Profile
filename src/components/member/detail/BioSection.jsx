import React from 'react';

const BioSection = ({ bio, className = '' }) => {
    if (!bio) return null;

    return (
        <div className={`flex items-start gap-4 sm:gap-6 ${className}`}>
            <span className="hidden lg:block w-px rounded-sm bg-pure-white/30 self-stretch" aria-hidden="true" />
            <blockquote className="text-pure-white text-xl sm:text-2xl md:text-2xl lg:text-[1.8rem] leading-relaxed sm:leading-relaxed md:leading-relaxed font-light italic max-w-2xl sm:max-w-3xl md:max-w-4xl">
                &ldquo;{bio}&rdquo;
            </blockquote>
        </div>
    );
};

export default BioSection;
