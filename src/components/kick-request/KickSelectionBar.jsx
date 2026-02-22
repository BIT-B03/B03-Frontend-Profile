/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { useSelectionLabel } from '../../hooks/useSelectionKick';

export default function KickSelectionBar({ count, onCancel, onConfirm }) {
    const label = useSelectionLabel(count);

    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 z-40 px-4 pb-5"
        >
            <div className="mx-auto w-full max-w-4xl rounded-3xl border border-pure-white/10 bg-dark-bg/95 backdrop-blur-xl shadow-2xl px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center sm:text-left">
                    <p className="text-pure-white font-semibold">{label}</p>
                    <p className="text-sm text-muted-gray">Ready for removal from lab</p>
                </div>
                <div className="flex flex-row sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 sm:flex-none px-2 py-2 sm:px-3 sm:py-3 rounded-lg sm:rounded-2xl border border-white/10 text-pure-white text-sm sm:text-base hover:bg-white/10 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none px-2 py-2 sm:px-3 sm:py-3 rounded-lg sm:rounded-2xl bg-brand-24e1c9 text-dark-bg font-semibold text-sm sm:text-base shadow-[0_10px_30px_rgba(36,225,201,0.2)] hover:opacity-90 transition"
                    >
                        Add Reason
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
