/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ImageWithSkeleton from '../member/common/ImageWithSkeleton';
import ImageCropModal from '../common/ImageCropModal';

export default function MemberSettingsPhotoField({
    src,
    alt,
    placeholderLetter,
    disabled,
    isUploading,
    error,
    successMessage,
    onPickFile,
    onDeleteFile,
}) {
    const inputRef = useRef(null);
    const [rawImage, setRawImage] = useState(null);
    const [isCropOpen, setIsCropOpen] = useState(false);

    useEffect(() => {
        return () => {
            if (rawImage && typeof rawImage === 'string' && rawImage.startsWith('blob:')) {
                URL.revokeObjectURL(rawImage);
            }
        };
    }, [rawImage]);

    const handleChooseClick = () => {
        if (disabled || isUploading) return;
        inputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        e.target.value = '';
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) {
            onPickFile?.(null, 'File harus berupa gambar.');
            return;
        }
        const preview = URL.createObjectURL(file);
        setRawImage(preview);
        setIsCropOpen(true);
    };

    const handleDeleteClick = () => {
        if (disabled || isUploading) return;
        onDeleteFile?.();
    };

    const handleCropSave = (blob) => {
        if (!blob) return;
        const file = new File([blob], `member-settings-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
        onPickFile?.(file, null);
        if (rawImage && rawImage.startsWith('blob:')) {
            URL.revokeObjectURL(rawImage);
        }
        setRawImage(null);
        setIsCropOpen(false);
    };

    const handleCropClose = () => {
        if (rawImage && rawImage.startsWith('blob:')) {
            URL.revokeObjectURL(rawImage);
        }
        setRawImage(null);
        setIsCropOpen(false);
        inputRef.current && (inputRef.current.value = '');
    };

    return (
        <div className="sm:col-span-2">
            <div className="flex items-center mb-2">
                <p className="text-sm font-semibold text-pure-white tracking-wide">Profile Photo</p>
            </div>

            <div className="rounded-2xl border border-brand-stroke/40 bg-brand-fill/40 backdrop-blur-xl p-4 sm:p-5 transition-colors duration-300 hover:border-brand-24e1c9">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-center">
                    <div className="w-28 sm:w-32 flex-shrink-0 rounded-2xl overflow-hidden border border-brand-stroke/60 bg-brand-fill/30">
                        <ImageWithSkeleton
                            src={src}
                            alt={alt}
                            placeholderLetter={placeholderLetter}
                            className="rounded-2xl"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-muted-gray leading-relaxed">
                            This photo will be displayed on the community members' page.
                        </p>

                        {error && (
                            <div className="mt-3 rounded-xl border border-filter-red-border bg-filter-red-bg/20 px-4 py-2.5 text-sm text-filter-red-border">
                                {error}
                            </div>
                        )}

                        <AnimatePresence>
                            {successMessage && !error && (
                                <motion.div
                                    key="photo-success"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className="mt-3 inline-flex w-fit rounded-xl border border-brand-24e1c9/60 bg-brand-24e1c9/10 px-3 py-2.5 text-sm text-brand-24e1c9"
                                >
                                    {successMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-4 flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={disabled || isUploading}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={handleChooseClick}
                                disabled={disabled || isUploading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm sm:text-base font-semibold text-pure-white hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                            />
                                        </svg>
                                        <span>Choose Photo</span>
                                    </>
                                )}
                            </button>

                            {onDeleteFile && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={disabled || isUploading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-filter-red-border bg-filter-red-bg/30 px-4 py-2.5 text-sm sm:text-base font-semibold text-filter-red-border hover:bg-filter-red-bg/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ImageCropModal
                open={isCropOpen}
                imageSrc={rawImage}
                onClose={handleCropClose}
                onSave={handleCropSave}
                title="Crop Display Photo"
                subtitle="Adjust the frame to get the best crop."
                maxWidthClass="max-w-3xl"
                cropShape="rect"
                aspect={4 / 6}
                showGrid={true}
            />
        </div>
    );
}
