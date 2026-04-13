import React, { useEffect, useMemo, useRef, useState } from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import MemberSettingsProfileCard from './MemberSettingsProfileCard';
import MemberSettingsFields from './MemberSettingsFields';
import {
    deleteMemberDisplay,
    editMemberDisplay,
    getAdminMemberDetail,
    getMemberDisplayPublicUrl,
    uploadMemberDisplay,
} from '../../api/api';

export default function MemberSettingsModal({ isOpen, member, formState, onChange, onClose, onSave, isSaving, onMemberPatched }) {
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError, setPhotoError] = useState(null);
    const [photoSuccessMessage, setPhotoSuccessMessage] = useState(null);
    const successTimerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        setPhotoError(null);
        setPhotoSuccessMessage(null);
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }
        setPhotoUploading(false);
        setPhotoPreviewUrl(null);
    }, [isOpen, member?.hashed_id]);

    useEffect(() => {
        if (!photoSuccessMessage) return undefined;
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(() => {
            setPhotoSuccessMessage(null);
            successTimerRef.current = null;
        }, 3000);
        return () => {
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
                successTimerRef.current = null;
            }
        };
    }, [photoSuccessMessage]);

    useEffect(() => {
        return () => {
            if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
            if (successTimerRef.current) {
                clearTimeout(successTimerRef.current);
                successTimerRef.current = null;
            }
        };
    }, [photoPreviewUrl]);

    useEffect(() => {
        if (!isOpen || !member?.hashed_id) return undefined;

        let cancelled = false;
        const fetchProfile = async () => {
            try {
                setProfileLoading(true);
                setProfileError(null);
                const response = await getAdminMemberDetail(member.hashed_id);
                if (cancelled) return;
                const data = response?.data ?? response ?? null;
                setProfile(data);
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load member profile', err);
                setProfileError('Tidak dapat memuat profil');
            } finally {
                if (!cancelled) setProfileLoading(false);
            }
        };

        fetchProfile();
        return () => {
            cancelled = true;
        };
    }, [isOpen, member?.hashed_id]);

    const photoSrc = useMemo(() => {
        if (photoPreviewUrl) return photoPreviewUrl;
        const src = profile?.display_url || profile?.avatar_url || member?.display_url || member?.avatar_url || null;
        return src ? getMemberDisplayPublicUrl(src) : null;
    }, [photoPreviewUrl, profile?.display_url, profile?.avatar_url, member?.display_url, member?.avatar_url]);

    const photoAlt = profile?.name || member?.name || 'Selected member';
    const photoPlaceholderLetter = (photoAlt || '').trim().charAt(0).toUpperCase() || '?';

    const handlePickPhoto = async (file, validationError) => {
        if (validationError) {
            setPhotoError(validationError);
            setPhotoSuccessMessage(null);
            return;
        }
        if (!file || !member?.hashed_id) return;

        if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
        const objectUrl = URL.createObjectURL(file);
        setPhotoPreviewUrl(objectUrl);

        try {
            setPhotoUploading(true);
            setPhotoError(null);
            setPhotoSuccessMessage(null);
            const hasDisplay = Boolean(profile?.display_url || member?.display_url);
            if (hasDisplay) {
                await editMemberDisplay(member.hashed_id, file);
            } else {
                await uploadMemberDisplay(member.hashed_id, file);
            }
            const fresh = await getAdminMemberDetail(member.hashed_id);
            const data = fresh?.data ?? fresh ?? null;
            setProfile(data);

            if (onMemberPatched) {
                onMemberPatched(member.hashed_id, { display_url: data?.display_url ?? null });
            }

            setPhotoSuccessMessage('Display photo updated.');
            setPhotoPreviewUrl(null);
        } catch (err) {
            console.error('Failed to upload member photo', err);
            setPhotoError('Gagal mengunggah foto. Coba lagi.');
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!member?.hashed_id) return;
        try {
            setPhotoUploading(true);
            setPhotoError(null);
            setPhotoSuccessMessage(null);
            await deleteMemberDisplay(member.hashed_id);
            const fresh = await getAdminMemberDetail(member.hashed_id);
            const data = fresh?.data ?? fresh ?? null;
            setProfile(data);

            if (onMemberPatched) {
                onMemberPatched(member.hashed_id, { display_url: data?.display_url ?? null });
            }
        } catch (err) {
            console.error('Failed to delete member display', err);
            setPhotoError('Gagal menghapus display. Coba lagi.');
        } finally {
            setPhotoUploading(false);
        }
    };

    return (
        <BlurFrame isOpen={isOpen} onClose={onClose}>
            <div className="relative px-6 py-5 border-b border-brand-stroke/40 bg-gradient-to-r from-brand-fill/60 via-brand-fill/40 to-brand-fill/60 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <MemberSettingsProfileCard
                            member={member}
                            profile={profile}
                            profileLoading={profileLoading}
                            profileError={profileError}
                        />
                    </div>
                    <div className="ml-4">
                        <CloseButton onClick={onClose} disabled={isSaving} />
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6 bg-gradient-to-b from-transparent to-brand-fill/20">
                <MemberSettingsFields
                    formState={formState}
                    onChange={onChange}
                    photoSrc={photoSrc}
                    photoAlt={photoAlt}
                    photoPlaceholderLetter={photoPlaceholderLetter}
                    photoDisabled={isSaving}
                    photoIsUploading={photoUploading}
                    photoError={photoError}
                    photoSuccessMessage={photoSuccessMessage}
                    onPickPhoto={handlePickPhoto}
                    onDeletePhoto={handleDeletePhoto}
                    disabled={isSaving}
                />
            </div>

            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-brand-stroke/40 bg-gradient-to-r from-brand-fill/60 via-brand-fill/40 to-brand-fill/60 backdrop-blur-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-brand-stroke text-pure-white text-sm sm:text-base hover:bg-white/5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-brand-24e1c9 text-dark-bg font-semibold text-sm sm:text-base shadow-[0_12px_35px_rgba(36,225,201,0.2)] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSaving}
                >
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                        {isSaving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span>Save Changes</span>
                            </>
                        )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-1f4c74 to-brand-24e1c9 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
            </div>
        </BlurFrame>
    );
}
