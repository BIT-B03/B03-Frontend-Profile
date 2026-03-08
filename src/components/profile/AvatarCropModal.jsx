import React from 'react';
import ImageCropModal from '../common/ImageCropModal';

const AvatarCropModal = ({ open, imageSrc, onClose, onSave }) => (
  <ImageCropModal
    open={open}
    imageSrc={imageSrc}
    onClose={onClose}
    onSave={onSave}
    title="Crop Avatar"
    subtitle="Adjust the frame to get the best crop."
    maxWidthClass="max-w-3xl"
    cropShape="round"
    aspect={1}
    showGrid={false}
  />
);

export default AvatarCropModal;
