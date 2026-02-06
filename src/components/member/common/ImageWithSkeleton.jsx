import React, { useState, useEffect } from 'react';

export const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10';

export const SkeletonGrid = () => {
    const placeholders = Array.from({ length: 8 });
    return (
        <div className={GRID_CLASSES}>
            {placeholders.map((_, idx) => (
                <div
                    key={idx}
                    className="bg-brand-fill border border-brand-stroke rounded-2xl overflow-hidden skeleton-base skeleton-shimmer"
                >
                    <div className="w-full aspect-[4/6]" />
                </div>
            ))}
        </div>
    );
};

const ImageWithSkeleton = ({ src, alt, placeholderLetter, className = '', onLoad }) => {
    return (
        <div className={`relative w-full aspect-[4/6] ${className}`}>
            {src ? (
                <ImageContent src={src} alt={alt} onLoad={onLoad} />
            ) : (
                <Placeholder letter={placeholderLetter} onLoad={onLoad} />
            )}
        </div>
    );
};

const ImageContent = ({ src, alt, onLoad }) => {
    const [loaded, setLoaded] = useState(false);

    const handleLoad = () => {
        setLoaded(true);
        onLoad && onLoad();
    };

    return (
        <>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: loaded ? 1 : 0 }}
                onLoad={handleLoad}
                onError={handleLoad}
            />
            {!loaded && (
                <div className="absolute inset-0 skeleton-base skeleton-shimmer rounded-2xl" />
            )}
        </>
    );
};

const Placeholder = ({ letter, onLoad }) => {
    useEffect(() => {
        onLoad && onLoad();
    }, [onLoad]);

    return (
        <div className="w-full h-full bg-gradient-to-br from-brand-186bb5 to-brand-1f4c74 flex items-center justify-center">
            <span className="text-4xl text-pure-white font-bold">{letter}</span>
        </div>
    );
};

export default ImageWithSkeleton;
