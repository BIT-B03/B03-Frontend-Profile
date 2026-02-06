import React from 'react';

const FilterButton = ({ label, onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`px-2.5 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium transition-all duration-300 ${className}`}
            style={{ borderRadius: '10px' }}
        >
            {label}
        </button>
    );
};

export default FilterButton;
