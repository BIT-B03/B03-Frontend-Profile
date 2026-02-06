import React from 'react';
import SearchInput from '../../filter/SearchInput';
import FilterButton from '../../filter/FilterButton';
import GenerationDropdown from './GenerationDropdown';
import PositionDropdown from './PositionDropdown';
import useMemberFilters from '../../../hooks/useMemberFilters';

const Filters = ({
    allUsers = [],
    activeFilter,
    selectedGeneration,
    generations,
    onApply,
}) => {
    const {
        searchTerm,
        applyFilter,
        applyPosition,
        applyGeneration,
        handleSearchChange,
    } = useMemberFilters({ allUsers, activeFilter, selectedGeneration, onApply });

    const getVariantClass = (variant) => (variant === 'mentor' ? '' : '');

    const makeStyles = (variant = 'default') => {
        const variantClass = getVariantClass(variant);
        const activeStyles = `bg-filter-sage-bg text-pure-white border-2 border-filter-sage-border ${variantClass}`;
        const inactiveStyles = `bg-transparent text-muted-gray border-2 border-brand-stroke hover:border-filter-sage-border hover:bg-filter-sage-bg/20 hover:text-pure-white ${variantClass}`;
        return { activeStyles, inactiveStyles };
    };

    const allStyles = makeStyles('all');
    const allClassName = (activeFilter === 'all') ? allStyles.activeStyles : allStyles.inactiveStyles;


    return (
        <div className="w-full">
            <div className="bg-brand-fill/50 border border-brand-stroke rounded-2xl p-3 md:p-5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap order-1 md:order-1">
                        <FilterButton
                            label="All"
                            onClick={() => applyFilter('all')}
                            className={allClassName}
                        />

                        <PositionDropdown onSelect={applyPosition} activeFilter={activeFilter} />

                        <GenerationDropdown
                            generations={generations}
                            activeGeneration={selectedGeneration}
                            onSelect={applyGeneration}
                            activeFilter={activeFilter}
                        />
                    </div>

                    <div className="w-full md:max-w-xs order-2 md:order-2">
                        <label htmlFor="member-search" className="sr-only">Search members</label>
                        <SearchInput id="member-search" value={searchTerm} onChange={handleSearchChange} placeholder="Search members by name..." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
