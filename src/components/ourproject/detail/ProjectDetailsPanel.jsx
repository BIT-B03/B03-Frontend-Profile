import React from 'react';

const ProjectDetailsPanel = ({ description }) => {
    return (
        <div className="space-y-5">
            {/* Description */}
            {description && (
                <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8">
                    <h2 className="text-lg font-bold text-pure-white mb-4 font-inter">About Project</h2>
                    <p className="text-gray-300 text-base leading-relaxed font-inter">
                        {description}
                    </p>
                </div>
            )}

            {!description && (
                <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8">
                    <p className="text-gray-400 text-base font-inter">No description available</p>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsPanel;
