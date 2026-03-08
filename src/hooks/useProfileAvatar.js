import { useEffect, useMemo, useRef, useState } from 'react';
import { getAvatarImageUrl } from '../api/api';

const resolveAvatarUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
  return getAvatarImageUrl(value);
};

export default function useProfileAvatar({ profile, setEditSection }) {
  const fileInputRef = useRef(null);
  const [rawImage, setRawImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const resolvedAvatar = useMemo(() => resolveAvatarUrl(profile?.avatar_url), [profile]);
  const displayAvatar = avatarPreview || resolvedAvatar;

  const resetAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onCropSave = (blob) => {
    const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: blob.type });
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
    setCropOpen(false);
    setRawImage(null);
    setEditSection?.('avatar-pending');
  };

  return {
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
  };
}
