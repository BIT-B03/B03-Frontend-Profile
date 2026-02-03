import React from 'react';
const BackgroundLayout = ({ children, className = '' }) => {
    return (
        <div className={`min-h-screen relative overflow-hidden ${className}`}>
            {/* Background base */}
            <div className="absolute inset-0 bg-brand-vignette" />

            {/* Soft glow overlay */}
            <div className="absolute inset-0 bg-brand-overlay" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BackgroundLayout;
