import React from 'react';
import { createPortal } from 'react-dom';

const Dropdown = ({
    dropdownRef,
    menuRef,
    isOpen,
    setIsOpen,
    menuPos,
    isActive = false,
    displayText = '',
    children,
}) => {
    const triggerClass = isActive
        ? 'bg-filter-sage-bg text-pure-white border-2 border-filter-sage-border'
        : 'bg-transparent text-muted-gray border-2 border-brand-stroke hover:border-filter-sage-border hover:bg-filter-sage-bg/20 hover:text-pure-white';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`px-3.5 py-2 md:px-6 md:py-2 text-sm md:text-base font-medium transition-all duration-300 border-2 flex items-center gap-2 ${triggerClass}`}
                style={{ borderRadius: '10px' }}
            >
                <span>{displayText}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && menuPos && createPortal(
                <div
                    ref={menuRef}
                    className="bg-brand-fill border border-brand-stroke rounded-lg shadow-lg"
                    style={{
                        position: 'fixed',
                        top: menuPos ? `${menuPos.top}px` : '-9999px',
                        left: menuPos ? `${menuPos.left}px` : '-9999px',
                        width: menuPos ? `${menuPos.width}px` : 'auto',
                        zIndex: 9999,
                    }}
                >
                    {children}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Dropdown;
