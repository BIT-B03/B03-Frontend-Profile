import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AddDescriptionPromptModal({
    isOpen,
    onClose,
    onAddDescription,
    canAddDescription,
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
                    <motion.div
                        className="w-full max-w-md rounded-2xl bg-[#0f1117] border border-gray-800 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <div className="px-6 py-5 border-b border-gray-800">
                            <p className="text-xs text-gray-400">Langkah ini bisa dilewati</p>
                            <h2 className="text-base font-semibold text-white mt-1">Tambahkan Deskripsi</h2>
                        </div>
                        <div className="px-6 py-5 space-y-3 text-sm text-gray-300">
                            <p>
                                Project sudah tersimpan. Kamu bisa menambahkan deskripsi rich text sekarang,
                                atau lewati dan isi nanti.
                            </p>
                            {!canAddDescription && (
                                <p className="text-xs text-red-300/80">
                                    ID project tidak ditemukan. Kamu tetap bisa menambahkan deskripsi dari halaman detail project.
                                </p>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3 bg-gray-900/40">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl border border-gray-700 text-white text-sm hover:bg-white/5 transition"
                            >
                                Lewati
                            </button>
                            <button
                                type="button"
                                onClick={onAddDescription}
                                disabled={!canAddDescription}
                                className="px-5 py-2 rounded-xl bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tambahkan Deskripsi
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
