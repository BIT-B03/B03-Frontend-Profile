import { useState, useRef, useEffect } from 'react';

export default function useDropdown(initialOpen = false) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const [menuPos, setMenuPos] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (dropdownRef.current && dropdownRef.current.contains(target)) return;
            if (menuRef.current && menuRef.current.contains(target)) return;
            setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const computePos = () => {
            if (!dropdownRef.current) return;
            const rect = dropdownRef.current.getBoundingClientRect();
            setMenuPos({ top: rect.bottom, left: rect.left, width: rect.width });
        };

        computePos();
        const onResize = () => computePos();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onResize);
        };
    }, [isOpen]);

    return {
        isOpen,
        setIsOpen,
        dropdownRef,
        menuRef,
        menuPos,
    };
}
