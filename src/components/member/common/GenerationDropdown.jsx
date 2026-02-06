import React from 'react';
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../filter/Dropdown';

const GenerationDropdown = ({ generations = [], activeGeneration, onSelect, activeFilter }) => {
    const { isOpen, setIsOpen, dropdownRef, menuRef, menuPos } = useDropdown(false);

    const handleSelect = (generation) => {
        onSelect(generation);
        setIsOpen(false);
    };

    const displayText = activeGeneration ? `Generation ${activeGeneration}` : 'Generation';
    const isFilterActive = activeFilter === 'generation';

    return (
        <Dropdown
            dropdownRef={dropdownRef}
            menuRef={menuRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            menuPos={menuPos}
            isActive={isFilterActive}
            displayText={displayText}
        >
            <button
                onClick={() => handleSelect(null)}
                className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg ${isFilterActive && activeGeneration === null ? 'bg-filter-sage-bg text-pure-white' : 'text-muted-gray hover:bg-filter-sage-bg/20 hover:text-pure-white'}`}
            >
                All Generation
            </button>
            {generations.map((generation) => (
                <button
                    key={generation}
                    onClick={() => handleSelect(generation)}
                    className={`w-full px-4 py-2 text-left transition-colors last:rounded-b-lg ${isFilterActive && activeGeneration === generation ? 'bg-filter-sage-bg text-pure-white' : 'text-muted-gray hover:bg-filter-sage-bg/20 hover:text-pure-white'}`}
                >
                    Generation {generation}
                </button>
            ))}
        </Dropdown>
    );
};

export default GenerationDropdown;
