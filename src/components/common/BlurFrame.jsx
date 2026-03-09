/* eslint-disable no-unused-vars */
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function CloseButton({ onClick, disabled, className = '', ariaLabel = 'Close' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-xl text-muted-gray hover:text-pure-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 ${className}`.trim()}
            aria-label={ariaLabel}
            disabled={disabled}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}

export default function BlurFrame({ isOpen, children, onClose, panelClassName = '' }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={onClose}
                >
                    <motion.div
                        className={`w-full max-w-lg rounded-3xl bg-dark-bg border border-brand-stroke shadow-2xl overflow-hidden ${panelClassName}`}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hidden">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
