import React from 'react';
import GitIcon from '../../../assets/Git.svg';
import RectIcon from '../../../assets/Rectangle.svg';
import MemberCard from '../../member/common/MemberCard';
import { GRID_CLASSES } from '../../member/common/ImageWithSkeleton';

const ContributorsSection = ({ contributors = [] }) => {
    if (!contributors || contributors.length === 0) {
        return (
            <div className="bg-brand-fill border border-brand-stroke rounded-3xl p-8 text-center">
                <p className="text-gray-400 text-lg">No contributors found</p>
            </div>
        );
    }

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
            <div className={GRID_CLASSES}>
                {contributors.map((contributor, idx) => {
                    const memberData = {
                        ...contributor,
                        position: contributor.position || contributor.role || 'Members',
                        hashed_id: contributor.hashed_id || contributor.id || contributor.hashedId || contributor.hashed_id || null,
                    }

                    return (
                        <div key={contributor.id || idx} className="w-full">
                            <div className="aspect-[4/6] w-full">
                                <MemberCard member={memberData} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ContributorsSection;
 