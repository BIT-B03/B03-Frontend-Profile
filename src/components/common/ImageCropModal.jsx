import React, { useCallback, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImage from '../../utils/cropImage';

const ImageCropModal = ({
  open,
  imageSrc,
  onClose,
  onSave,
  title = 'Crop Image',
  subtitle = 'Adjust the frame to get the best crop.',
  maxWidthClass = 'max-w-3xl',
  panelClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  cropperHeightClassName = 'h-[340px] sm:h-[420px]',
  aspect = 1,
  cropShape = 'round',
  showGrid = false,
  initialZoom = 1.2,
  minZoom = 1,
  maxZoom = 3,
  zoomStep = 0.05,
  zoomLabel = 'Zoom',
  cancelLabel = 'Cancel',
  saveLabel = 'Save Crop',
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const resolvedPanelClassName = useMemo(() => {
    const classes = [
      'w-full',
      maxWidthClass,
      'rounded-2xl',
      'border',
      'border-white/10',
      'bg-[#0b0f18]',
      'shadow-2xl',
      'overflow-hidden',
      panelClassName,
    ];
    return classes.filter(Boolean).join(' ');
  }, [maxWidthClass, panelClassName]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onSave?.(blob);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className={resolvedPanelClassName}>
        <div className={`flex items-center justify-between px-6 py-4 border-b border-white/10 ${headerClassName}`.trim()}>
          <div>
            <p className="text-pure-white font-semibold text-lg">{title}</p>
            {subtitle ? <p className="text-xs text-muted-gray">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-gray hover:text-pure-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={`relative ${cropperHeightClassName} bg-black ${bodyClassName}`.trim()}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={showGrid}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className={`px-6 py-5 space-y-4 ${footerClassName}`.trim()}>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-gray">{zoomLabel}</span>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={zoomStep}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-white/15 text-pure-white/80 hover:text-pure-white hover:border-white/30 transition"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2 rounded-lg bg-brand-getstarted text-pure-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {isProcessing ? 'Processing...' : saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
