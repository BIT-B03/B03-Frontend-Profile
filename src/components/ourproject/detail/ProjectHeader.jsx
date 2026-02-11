import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarImageUrl } from '../../../api/api';
import ArrowIcon from '../../../assets/arrow.svg';
import PanahIcon from '../../../assets/panah.svg';

const ProjectHeader = ({ title, status, creator }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        if (status?.toLowerCase().includes('progress')) {
            return 'bg-red-500 text-pure-white';
        }
        return 'bg-green-500 text-pure-white';
    };

    const getStatusLabel = (status) => {
        if (status?.toLowerCase().includes('progress')) {
            return 'On Progress';
        }
        return 'Completed';
    };

    return (
        <div className="bg-brand-fill border border-brand-stroke rounded-3xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4 sm:gap-6 mt-5">
            {/* Back Button with Arrow SVG - Pointing Left */}
            <button
                onClick={() => navigate('/project')}
                className="flex-shrink-0 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to projects"
            >
                <img
                    src={ArrowIcon}
                    alt="Back"
                    className="w-6 h-6 transform rotate-60"
                />
            </button>

            {/* Title + Status Container */}
            <div className="flex items-center gap-2 sm:gap-3 flex-grow">
                <h1 className="text-sm sm:text-base md:text-2xl font-bold text-pure-white font-inter">{title}</h1>

                {/* Status Badge - Next to Title */}
                <span className={`px-2 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                </span>
            </div>

            {/* Owner Project Info - Right Side */}
            {creator && (
                <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-brand-stroke">
                    <span className="hidden md:inline-block text-xs text-gray-400 font-inter whitespace-nowrap">Owner Project</span>
                    
                    {/* Owner Profile Container - show only avatar on small screens */}
                    <button 
                        onClick={() => navigate(`/people/${creator?.hashed_id}`)}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-brand-fill border border-gray-600 hover:bg-gray-600/50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 border border-brand-stroke">
                            <img
                                src={getAvatarImageUrl(creator?.avatar_url)}
                                alt={creator?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>

                        <p className="hidden md:inline-block text-pure-white font-semibold text-sm font-inter">{creator?.name}</p>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectHeader;
