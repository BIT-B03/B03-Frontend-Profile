import React, { useEffect, useMemo, useRef, useState } from 'react';
import AvatarCropModal from './AvatarCropModal';
import { getAvatarImageUrl } from '../../api/api';

const resolveAvatarUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return getAvatarImageUrl(value);
};

const AvatarUploader = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const currentAvatar = useMemo(() => resolveAvatarUrl(value), [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (blob) => {
    const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: blob.type });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setRawImage(null);
    setIsCropOpen(false);
    onChange?.(file);
  };

  const handleCropClose = () => {
    setIsCropOpen(false);
    setRawImage(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          {(previewUrl || currentAvatar) ? (
            <img
              src={previewUrl || currentAvatar}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-pure-white/50">
              ?
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-pure-white font-semibold">Avatar</p>
            <p className="text-xs text-muted-gray">Upload a square photo. You can crop before saving.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSelectFile}
              className="px-4 py-2 rounded-lg bg-white/10 text-pure-white hover:bg-white/20 transition"
            >
              Upload New
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  onChange?.(null);
                }}
                className="px-4 py-2 rounded-lg border border-white/15 text-pure-white/70 hover:text-pure-white hover:border-white/30 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <AvatarCropModal
        open={isCropOpen}
        imageSrc={rawImage}
        onClose={handleCropClose}
        onSave={handleCropSave}
      />
    </div>
  );
};

export default AvatarUploader;
