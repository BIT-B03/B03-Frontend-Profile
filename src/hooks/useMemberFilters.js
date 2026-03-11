import { useState, useCallback } from 'react';

export default function useMemberFilters({ activeFilter, selectedGeneration, onApply }) {
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
        const query = (typeof searchValue === 'string' ? searchValue : searchTerm).trim();
        const resolvedPosition = typeof nextFilter === 'string' && nextFilter.startsWith('position:')
            ? (positionValue ?? nextFilter.split(':')[1])
            : positionValue;

        onApply({
            activeFilter: nextFilter,
            selectedGeneration: normalizedGeneration,
            positionValue: resolvedPosition,
            searchTerm: query,
            skipAnimation,
        });
    }, [activeFilter, selectedGeneration, onApply, searchTerm]);

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
            filterType: 'all',
            generationValue: null,
            positionValue: null,
            searchValue: value,
            skipAnimation: false,
        });
    }, [processAndApply]);

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
