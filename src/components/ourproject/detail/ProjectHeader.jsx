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

    const ownerFirstName = creator?.name ? String(creator.name).trim().split(/\s+/)[0] : null
    const displayTitle = ownerFirstName ? `${ownerFirstName} Project` : title

    return (
        <div className="bg-brand-fill border border-brand-stroke rounded-3xl px-4 sm:px-6 py-2 sm:py-4 flex items-center gap-1 sm:gap-4 mt-5">
            {/* Back Button with Arrow SVG - Pointing Left */}
            <button
                onClick={() => navigate('/project')}
                className="flex-shrink-0 p-1 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to projects"
            >
                <img
                    src={ArrowIcon}
                    alt="Back"
                    className="w-5 h-5 sm:w-6 sm:h-6 transform rotate-60"
                />
            </button>

            {/* Title + Status Container */}
            <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
                <h1 className="text-xs sm:text-sm md:text-2xl font-bold text-pure-white font-inter truncate">
                    {creator ? (
                        <>
                            <span className="sm:hidden">{ownerFirstName ? `${ownerFirstName} Project` : title}</span>
                            <span className="hidden sm:inline">{creator?.name ? `${creator.name} Project` : title}</span>
                        </>
                    ) : (
                        title
                    )}
                </h1>

                {/* Status Badge - Next to Title */}
                <span className={`ml-2 flex-shrink-0 px-1 md:px-3 py-0.5 rounded-full text-[11px] md:text-sm font-bold whitespace-nowrap ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                </span>
            </div>

            {/* Owner Project Info - Right Side */}
            {creator && (

                <div className="flex items-center gap-1 pl-2 sm:pl-6 border-l border-brand-stroke">

                    {/* Owner Profile Container - compact on small screens */}
                    <button 
                        onClick={() => navigate(`/people/${creator?.hashed_id}`)}
                        className="flex items-center gap-1 px-1 sm:px-2 py-0.5 rounded-lg bg-brand-fill border border-gray-600 hover:bg-gray-600/50 transition-colors"
                    >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 border border-brand-stroke">
                            <img
                                src={getAvatarImageUrl(creator?.avatar_url)}
                                alt={creator?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>

                        <p className="hidden sm:inline-block text-pure-white font-semibold text-sm font-inter">{creator?.name}</p>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectHeader;
