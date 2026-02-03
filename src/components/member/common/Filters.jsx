import React, { useState, useRef, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const sortMembers = (members = [], { generationFilter = undefined, excludeMentors = false } = {}) => {
    if (!Array.isArray(members)) return [];

    const mentors = excludeMentors ? [] : members.filter(m => m.position === 'Mentor');
    let others = members.filter(m => m.position !== 'Mentor');

    if (generationFilter !== undefined && generationFilter !== null) {
        others = others.filter(m => m.generation === generationFilter);
    }

    others.sort((a, b) => (Number(a.generation) || 0) - (Number(b.generation) || 0));

    return [...mentors, ...others];
};

const FilterButton = ({ label, isActive, onClick, variant = 'default' }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'all':
                return isActive
                    ? 'bg-filter-all-bg text-pure-white border-2 border-filter-all-border'
                    : 'bg-transparent text-muted-gray border-2 border-filter-all-border hover:border-filter-all-border hover:bg-filter-all-bg/20 hover:text-pure-white';
            case 'mentor':
                return isActive
                    ? 'bg-filter-red-bg text-pure-white border-2 border-filter-red-border'
                    : 'bg-transparent text-muted-gray border-2 border-filter-red-border hover:border-filter-red-border hover:bg-filter-red-bg/20 hover:text-pure-white';
            case 'generation':
                return isActive
                    ? 'bg-filter-sage-bg text-pure-white border-2 border-filter-sage-border'
                    : 'bg-transparent text-muted-gray border-2 border-filter-sage-border hover:border-filter-sage-border hover:bg-filter-sage-bg/20 hover:text-pure-white';
            default:
                return isActive
                    ? 'bg-brand-linear text-pure-white border-2 border-brand-24e1c9'
                    : 'bg-transparent text-muted-gray border-2 border-brand-stroke hover:border-brand-24e1c9 hover:bg-brand-linear/10 hover:text-pure-white';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 font-medium transition-all duration-300 ${getVariantStyles()}`}
            style={{ borderRadius: '10px' }}
        >
            {label}
        </button>
    );
};

const GenerationDropdown = ({ generations, activeGeneration, onSelect, activeFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (generation) => {
        onSelect(generation);
        setIsOpen(false);
    };

    const displayText = activeGeneration ? `Generation ${activeGeneration}` : 'Generation';
    const isFilterActive = activeFilter === 'generation';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-6 py-2 font-medium transition-all duration-300 border-2 flex items-center gap-2 ${isFilterActive
                    ? 'bg-filter-sage-bg text-pure-white border-filter-sage-border'
                    : 'bg-transparent text-muted-gray border-filter-sage-border hover:border-filter-sage-border hover:bg-filter-sage-bg/20 hover:text-pure-white'
                    }`}
                style={{ borderRadius: '10px' }}
            >
                <span>{displayText}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-brand-fill border border-brand-stroke rounded-lg shadow-lg z-50">
                    <button
                        onClick={() => handleSelect(null)}
                        className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg ${isFilterActive && activeGeneration === null ? 'bg-filter-sage-bg text-pure-white' : 'text-muted-gray hover:bg-filter-sage-bg/20 hover:text-pure-white'}`}
                    >
                        All Generations
                    </button>
                    {generations.map((generation) => (
                        <button
                            key={generation}
                            onClick={() => handleSelect(generation)}
                            className={`w-full px-4 py-2 text-left transition-colors last:rounded-b-lg ${isFilterActive && activeGeneration === generation ? 'bg-filter-sage-bg text-pure-white' : 'text-muted-gray hover:bg-filter-sage-bg/20 hover:text-pure-white'
                                }`}
                        >
                            Generation {generation}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Filters = ({
    allUsers = [],
    activeFilter,
    selectedGeneration,
    generations,
    onApply,
}) => {
    const applyFilter = (filterType) => {
        if (!onApply) return;

        if (filterType === 'all') {
            onApply({
                filtered: sortMembers(allUsers),
                activeFilter: 'all',
                selectedGeneration: null,
            });
            return;
        }

        if (filterType === 'mentor') {
            const mentorsOnly = allUsers.filter(user => user.position === 'Mentor');
            onApply({
                filtered: sortMembers(mentorsOnly),
                activeFilter: 'mentor',
                selectedGeneration: null,
            });
            return;
        }
    };

    const applyGeneration = (generation) => {
        if (!onApply) return;
        const filtered = sortMembers(allUsers, { generationFilter: generation, excludeMentors: true });
        onApply({
            filtered,
            activeFilter: 'generation',
            selectedGeneration: generation,
        });
    };

    return (
        <div className="flex justify-center items-center gap-4 flex-wrap">
            <FilterButton
                label="All"
                variant="all"
                isActive={activeFilter === 'all'}
                onClick={() => applyFilter('all')}
            />
            <FilterButton
                label="Mentor"
                variant="mentor"
                isActive={activeFilter === 'mentor'}
                onClick={() => applyFilter('mentor')}
            />
            <GenerationDropdown
                generations={generations}
                activeGeneration={selectedGeneration}
                onSelect={applyGeneration}
                activeFilter={activeFilter}
            />
        </div>
    );
};

export default Filters;
