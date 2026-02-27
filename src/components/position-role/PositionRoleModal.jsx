import React, { useEffect, useState } from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import PositionRoleProfileCard from './PositionRoleProfileCard';
import PositionRoleFields from './PositionRoleFields';
import { getAdminMemberDetail } from '../../api/api';

export default function PositionRoleModal({ isOpen, member, formState, onChange, onClose, onSave, isSaving }) {
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

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

    return (
        <BlurFrame isOpen={isOpen} onClose={onClose}>
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-brand-stroke/40 bg-gradient-to-r from-brand-fill/60 via-brand-fill/40 to-brand-fill/60 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-pure-white tracking-tight">Edit Member</h2>
                    </div>
                </div>
                <CloseButton onClick={onClose} disabled={isSaving} />
            </div>

            <div className="px-6 py-6 space-y-6 bg-gradient-to-b from-transparent to-brand-fill/20">
                <PositionRoleProfileCard
                    member={member}
                    profile={profile}
                    profileLoading={profileLoading}
                    profileError={profileError}
                />

                <PositionRoleFields
                    formState={formState}
                    onChange={onChange}
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
