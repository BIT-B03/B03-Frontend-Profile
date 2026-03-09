import { useCallback, useEffect, useMemo, useState } from 'react';
import useMyProfile from './useMyProfile';
import useProfileAvatar from './useProfileAvatar';
import useProfileStats from './useProfileStats';
import { UpdateMyProfile } from '../api/api';

const SOCIAL_OPTIONS = ['github', 'linkedin', 'instagram', 'facebook', 'youtube'];

const SOCIAL_META = {
  github: { label: 'GitHub' },
  linkedin: { label: 'LinkedIn' },
  instagram: { label: 'Instagram' },
  facebook: { label: 'Facebook' },
  youtube: { label: 'YouTube' }
};

const toSocialArray = (sosmed) =>
  SOCIAL_OPTIONS.map((platform) => ({
    id: `${platform}-${Math.random().toString(36).slice(2, 8)}`,
    platform,
    url: sosmed?.[platform] || '',
  }));

const toSocialObject = (entries) =>
  entries.reduce((acc, item) => {
    if (!item.platform) return acc;
    const url = String(item.url || '').trim();
    if (!url) return acc;
    acc[item.platform] = url;
    return acc;
  }, {});

export default function useProfilePage() {
  const { profile, loading, error, refetch } = useMyProfile();
  const { stats, loading: statsLoading } = useProfileStats();

  const [editSection, setEditSection] = useState(null);
  const [savingSection, setSavingSection] = useState(null);
  const [toast, setToast] = useState({ type: null, text: '' });

  const [form, setForm] = useState({ name: '', username: '', email: '', bio: '', description: '' });
  const [socialLinks, setSocialLinks] = useState([]);

  const {
    fileInputRef,
    rawImage,
    cropOpen,
    setCropOpen,
    setRawImage,
    displayAvatar,
    avatarFile,
    avatarPreview,
    openFilePicker,
    onFileChange,
    onCropSave,
    resetAvatar,
  } = useProfileAvatar({ profile, setEditSection });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      username: profile.username || '',
      email: profile.email || '',
      bio: profile.bio || '',
      description: profile.description || '',
    });
    setSocialLinks(toSocialArray(profile.sosmed));
  }, [profile]);

  const socials = useMemo(() => {
    const raw = profile?.sosmed || {};
    return Object.entries(raw)
      .filter(([platform]) => SOCIAL_OPTIONS.includes(platform))
      .filter(([, v]) => v && v.trim() !== '');
  }, [profile]);

  const socialsDraftFilled = useMemo(() => socialLinks.filter((i) => i.platform), [socialLinks]);

  const updateField = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const updateSocial = (id, key, value) =>
    setSocialLinks((p) => p.map((i) => (i.id === id ? { ...i, [key]: value } : i)));

  const cancelSection = (key) => {
    if (!profile) return;
    if (key === 'header' || key === 'account') {
      setForm({
        name: profile.name || '',
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        description: profile.description || '',
      });
    }
    if (key === 'about') setForm((p) => ({ ...p, description: profile.description || '' }));
    if (key === 'social') setSocialLinks(toSocialArray(profile.sosmed));
    if (key === 'avatar') resetAvatar();
    setEditSection(null);
  };

  const save = useCallback(async (sectionKey) => {
    setSavingSection(sectionKey);
    setToast({ type: null, text: '' });
    try {
      let payload;

      if (sectionKey === 'avatar') {
        payload = new FormData();
        if (avatarFile) payload.append('avatar_url', avatarFile);
      } else if (sectionKey === 'social') {
        payload = { sosmed: toSocialObject(socialsDraftFilled) };
      } else if (sectionKey === 'about') {
        payload = { description: form.description || '' };
      } else if (sectionKey === 'account') {
        payload = { email: form.email.trim(), username: form.username.trim() };
      } else if (sectionKey === 'header') {
        payload = { name: form.name.trim(), bio: form.bio || '' };
      }

      await UpdateMyProfile(payload);
      await refetch();
      setToast({ type: 'success', text: 'Changes saved successfully.' });
      setEditSection(null);

      if (sectionKey === 'avatar' && avatarFile) resetAvatar();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', text: err?.message || 'Failed to save changes.' });
    } finally {
      setSavingSection(null);
    }
  }, [form, socialsDraftFilled, avatarFile, avatarPreview, refetch]);

  const isEditing = (key) => editSection === key;
  const isOtherEditing = (key) => !!editSection && editSection !== key && editSection !== 'avatar-pending';

  const positionStyle = (() => {
    const p = (profile?.position || '').toLowerCase();
    if (p.includes('mentor')) return { color: '#e8647a', background: 'rgba(180,30,60,0.12)', border: '1px solid rgba(180,30,60,0.25)' };
    if (p.includes('co-coord')) return { color: '#fbbf24', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)' };
    if (p.includes('coord')) return { color: '#63a5fa', background: 'rgba(60,120,220,0.12)', border: '1px solid rgba(60,120,220,0.25)' };
    return { color: 'rgba(36,225,201,0.9)', background: 'rgba(36,225,201,0.08)', border: '1px solid rgba(36,225,201,0.22)' };
  })();

  return {
    profile,
    loading,
    error,
    refetch,
    stats,
    statsLoading,
    toast,
    setToast,
    editSection,
    setEditSection,
    savingSection,
    form,
    updateField,
    socialLinks,
    updateSocial,
    socials,
    displayAvatar,
    fileInputRef,
    rawImage,
    cropOpen,
    setCropOpen,
    setRawImage,
    openFilePicker,
    onFileChange,
    onCropSave,
    save,
    cancelSection,
    isEditing,
    isOtherEditing,
    positionStyle,
    SOCIAL_META,
  };
}
