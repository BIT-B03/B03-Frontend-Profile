import React from 'react';

const DescriptionSection = ({ description }) => {
    if (!description) return null;

    return (
        <div className="bg-brand-fill border border-brand-stroke backdrop-blur-sm rounded-3xl p-8 text-pure-white">
            <p className="text-lg leading-relaxed whitespace-pre-line">
                {description}
            </p>
        </div>
    );
};

export default DescriptionSection;
