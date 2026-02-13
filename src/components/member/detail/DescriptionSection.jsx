import React from 'react';

const DescriptionSection = ({ description, className = '', loading = false }) => {
    if (!description && !loading) return null;

    if (loading) {
        return (
            <div className={`space-y-3 max-w-3xl ${className}`}>
                <div className="h-4 w-full rounded skeleton-base skeleton-shimmer" />
                <div className="h-4 w-5/6 rounded skeleton-base skeleton-shimmer" />
                <div className="h-4 w-2/3 rounded skeleton-base skeleton-shimmer" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-6 ${className}`}>
            <div className="w-16 h-px bg-pure-white/20 block md:hidden" />
            <p className="text-pure-white/90 text-lg md:text-xl leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default DescriptionSection;
