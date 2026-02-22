import { useCallback, useState } from 'react';

export default function useSelection(initialIds = []) {
    const [selected, setSelected] = useState(() => new Set(initialIds));

    const has = useCallback((id) => selected.has(id), [selected]);

    const toggle = useCallback((id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clear = useCallback(() => setSelected(new Set()), []);

    const toArray = useCallback(() => Array.from(selected), [selected]);

    return {
        selected,
        has,
        toggle,
        clear,
        count: selected.size,
        toArray,
    };
}

export function useSelectionLabel(count) {
    return count === 1 ? '1 Member Selected' : `${count} Members Selected`;
}
