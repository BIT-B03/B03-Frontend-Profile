import { useState, useCallback } from 'react';
import { sortMembers } from '../utils/members';

export default function useMemberFilters({ allUsers = [], activeFilter, selectedGeneration, onApply }) {
    const [searchTerm, setSearchTerm] = useState('');

    const processAndApply = useCallback(({
        filterType = activeFilter || 'all',
        generationValue = selectedGeneration,
        positionValue = undefined,
        searchValue,
        skipAnimation = false,
    } = {}) => {
        if (!onApply) return;

        const nextFilter = filterType || 'all';
        const normalizedGeneration = nextFilter === 'generation' ? generationValue ?? null : null;

        let baseList;
        if (nextFilter === 'mentor') {
            const mentorsOnly = allUsers.filter(user => user.position === 'Mentor');
            baseList = sortMembers(mentorsOnly);
        } else if (nextFilter === 'generation') {
            baseList = sortMembers(allUsers, { generationFilter: normalizedGeneration, excludeMentors: true });
        } else if (typeof nextFilter === 'string' && nextFilter.startsWith('position:')) {
            const pos = positionValue ?? nextFilter.split(':')[1];
            const byPos = allUsers.filter(user => user.position === pos);
            baseList = sortMembers(byPos);
        } else {
            baseList = sortMembers(allUsers);
        }

        const query = (typeof searchValue === 'string' ? searchValue : searchTerm).trim().toLowerCase();
        const filteredBySearch = query
            ? baseList.filter(user => (user.name || '').toLowerCase().includes(query))
            : baseList;

        onApply({
            filtered: filteredBySearch,
            activeFilter: nextFilter,
            selectedGeneration: normalizedGeneration,
            skipAnimation,
        });
    }, [allUsers, activeFilter, selectedGeneration, onApply, searchTerm]);

    const applyFilter = useCallback((filterType) => {
        processAndApply({
            filterType,
            generationValue: filterType === 'generation' ? selectedGeneration : null,
            searchValue: searchTerm,
        });
    }, [processAndApply, selectedGeneration, searchTerm]);

    const applyPosition = useCallback((position) => {
        processAndApply({
            filterType: `position:${position}`,
            positionValue: position,
            searchValue: searchTerm,
        });
    }, [processAndApply, searchTerm]);

    const applyGeneration = useCallback((generation) => {
        processAndApply({
            filterType: 'generation',
            generationValue: generation,
            searchValue: searchTerm,
        });
    }, [processAndApply, searchTerm]);

    const handleSearchChange = useCallback((event) => {
        const value = event.target.value;
        setSearchTerm(value);
        processAndApply({
            filterType: activeFilter || 'all',
            generationValue: activeFilter === 'generation' ? selectedGeneration : null,
            searchValue: value,
            skipAnimation: false,
        });
    }, [processAndApply, activeFilter, selectedGeneration]);

    return {
        searchTerm,
        setSearchTerm,
        processAndApply,
        applyFilter,
        applyPosition,
        applyGeneration,
        handleSearchChange,
    };
}
