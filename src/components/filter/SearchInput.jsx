import React from 'react';

const SearchInput = ({ id = 'member-search', value, onChange, placeholder = 'Search members by name...' }) => {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-muted-gray pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
            </span>
            <input
                id={id}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-brand-stroke bg-dark-bg/50 text-pure-white placeholder:text-muted-gray focus:outline-none focus:border-brand-24e1c9 focus:ring-1 focus:ring-brand-24e1c9/30 transition-all"
            />
        </div>
    );
};

export default SearchInput;
