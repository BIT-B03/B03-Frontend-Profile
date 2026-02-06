import React from 'react';
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../filter/Dropdown';

const PositionDropdown = ({ onSelect, activeFilter }) => {
    const { isOpen, setIsOpen, dropdownRef, menuRef, menuPos } = useDropdown(false);

    const handleSelect = (pos) => {
        onSelect(pos);
        setIsOpen(false);
    };

    const positions = ['Mentor', 'Coordinator', 'Co-coordinator', 'Members'];

    const isActivePosition = (pos) => {
        if (pos === 'Mentor') return activeFilter === 'mentor' || activeFilter === `position:${pos}`;
        return activeFilter === `position:${pos}`;
    };

    const displayText = (() => {
        const active = positions.find(p => isActivePosition(p));
        return active || 'Position';
    })();

    const isAnyActive = positions.some(p => isActivePosition(p));

    return (
        <Dropdown
            dropdownRef={dropdownRef}
            menuRef={menuRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            menuPos={menuPos}
            isActive={isAnyActive}
            displayText={displayText}
        >
            {positions.map((pos, idx) => (
                <button
                    key={pos}
                    onClick={() => handleSelect(pos)}
                    className={`w-full px-4 py-2 text-left transition-colors ${idx === 0 ? 'first:rounded-t-lg' : ''} ${idx === positions.length - 1 ? 'last:rounded-b-lg' : ''} ${isActivePosition(pos) ? 'bg-filter-sage-bg text-pure-white' : 'text-muted-gray hover:bg-filter-sage-bg/20 hover:text-pure-white'}`}
                >
                    {pos}
                </button>
            ))}
        </Dropdown>
    );
};

export default PositionDropdown;
