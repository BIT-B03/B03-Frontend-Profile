import React, { useCallback, useMemo, useState } from 'react';
import Dropdown from '../filter/Dropdown';
import FilterButton from '../filter/FilterButton';
import SearchInput from '../filter/SearchInput';
import useDropdown from '../../hooks/useDropdown';
import useMemberFilters from '../../hooks/useMemberFilters';

export default function KickRequestFilters({ allUsers, onApply }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const positionDropdown = useDropdown();
    const generationDropdown = useDropdown();

    const generations = useMemo(() => {
        const genSet = new Set();
        allUsers.forEach((user) => {
            if (user.generation && user.position !== 'Mentor') genSet.add(user.generation);
        });
        return Array.from(genSet).sort((a, b) => b - a);
    }, [allUsers]);

    const positions = useMemo(() => {
        const posSet = new Set();
        allUsers.forEach((user) => {
            if (user.position) posSet.add(user.position);
        });
        return Array.from(posSet).sort();
    }, [allUsers]);

    const {
        searchTerm,
        applyFilter,
        applyPosition,
        applyGeneration,
        handleSearchChange,
    } = useMemberFilters({
        allUsers,
        activeFilter,
        selectedGeneration,
        onApply: useCallback(
            ({ filtered, activeFilter: nextActive, selectedGeneration: nextGen }) => {
                setActiveFilter(nextActive);
                setSelectedGeneration(nextGen ?? null);
                if (!nextActive?.startsWith('position:')) {
                    setSelectedPosition(null);
                }
                if (onApply) {
                    onApply({ filtered, activeFilter: nextActive, selectedGeneration: nextGen });
                }
            },
            [onApply]
        ),
    });

    const handleAllFilter = () => {
        setSelectedPosition(null);
        applyFilter('all');
    };

    const handlePositionSelect = (position) => {
        setSelectedPosition(position);
        applyPosition(position);
    };

    const handleGenerationSelect = (generation) => {
        setSelectedGeneration(generation);
        applyGeneration(generation);
    };

    const filterButtonClass = (active) =>
        active
            ? 'bg-filter-sage-bg text-pure-white border-2 border-filter-sage-border'
            : 'bg-transparent text-muted-gray border-2 border-brand-stroke hover:border-filter-sage-border hover:bg-filter-sage-bg/20 hover:text-pure-white';

    const isPositionActive = activeFilter?.startsWith('position:');

    return (
        <div className="bg-brand-fill/50 border border-brand-stroke rounded-2xl p-3 md:p-5 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <FilterButton label="All" onClick={handleAllFilter} className={filterButtonClass(activeFilter === 'all')} />

                    <Dropdown
                        dropdownRef={positionDropdown.dropdownRef}
                        menuRef={positionDropdown.menuRef}
                        isOpen={positionDropdown.isOpen}
                        setIsOpen={positionDropdown.setIsOpen}
                        menuPos={positionDropdown.menuPos}
                        isActive={isPositionActive}
                        displayText={selectedPosition || 'Position'}
                    >
                        <div className="py-2">
                            {positions.map((position) => (
                                <button
                                    type="button"
                                    key={position}
                                    onClick={() => {
                                        handlePositionSelect(position);
                                        positionDropdown.setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-pure-white hover:bg-white/5"
                                >
                                    {position}
                                </button>
                            ))}
                        </div>
                    </Dropdown>

                    <Dropdown
                        dropdownRef={generationDropdown.dropdownRef}
                        menuRef={generationDropdown.menuRef}
                        isOpen={generationDropdown.isOpen}
                        setIsOpen={generationDropdown.setIsOpen}
                        menuPos={generationDropdown.menuPos}
                        isActive={activeFilter === 'generation'}
                        displayText={selectedGeneration ? `Gen ${selectedGeneration}` : 'Generation'}
                    >
                        <div className="py-2">
                            {generations.map((generation) => (
                                <button
                                    type="button"
                                    key={generation}
                                    onClick={() => {
                                        handleGenerationSelect(generation);
                                        generationDropdown.setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-pure-white hover:bg-white/5"
                                >
                                    Generation {generation}
                                </button>
                            ))}
                        </div>
                    </Dropdown>
                </div>

                <div className="w-full md:max-w-xs">
                    <label htmlFor="kick-member-search" className="sr-only">
                        Search members
                    </label>
                    <SearchInput
                        id="kick-member-search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search members by name..."
                    />
                </div>
            </div>
        </div>
    );
}
