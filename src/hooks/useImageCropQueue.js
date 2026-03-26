import { useCallback, useEffect, useState } from 'react';

const revokeObjectUrl = (url) => {
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};

export default function useImageCropQueue({
    aspect = 1,
    cropShape = 'rect',
    showGrid = false,
    title = 'Crop Image',
    subtitle = 'Adjust the frame to get the best crop.',
    saveLabel = 'Save Crop',
    onCropped,
} = {}) {
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [target, setTarget] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [queue, setQueue] = useState([]);

    const openSingle = useCallback(
        (file, nextQueue, targetType) => {
            if (!file) return;
            setTarget(targetType);
            setCurrentFile(file);
            setQueue(nextQueue || []);
            const objectUrl = URL.createObjectURL(file);
            setImageSrc((prev) => {
                revokeObjectUrl(prev);
                return objectUrl;
            });
            setOpen(true);
        },
        []
    );

    const openCrop = useCallback(
        (file, targetType) => {
            openSingle(file, [], targetType);
        },
        [openSingle]
    );

    const openCropQueue = useCallback(
        (files, targetType) => {
            const arr = Array.from(files || []);
            if (!arr.length) return;
            const [first, ...rest] = arr;
            openSingle(first, rest, targetType);
        },
        [openSingle]
    );

    const closeCrop = useCallback(() => {
        setOpen(false);
        setTarget(null);
        setCurrentFile(null);
        setQueue([]);
        setImageSrc((prev) => {
            revokeObjectUrl(prev);
            return null;
        });
    }, []);

    const handleSave = useCallback(
        (blob) => {
            if (!blob) return;
            const fileName = currentFile?.name || `cropped-${Date.now()}.jpg`;
            const mimeType = blob.type || currentFile?.type || 'image/jpeg';
            const croppedFile = new File([blob], fileName, { type: mimeType });
            onCropped?.(croppedFile, target);

            if (queue.length > 0) {
                const [next, ...rest] = queue;
                openSingle(next, rest, target);
            } else {
                closeCrop();
            }
        },
        [currentFile, target, queue, onCropped, openSingle, closeCrop]
    );

    useEffect(() => {
        return () => {
            revokeObjectUrl(imageSrc);
        };
    }, [imageSrc]);

    const modalProps = {
        open,
        imageSrc,
        onClose: closeCrop,
        onSave: handleSave,
        aspect,
        cropShape,
        showGrid,
        title,
        subtitle,
        saveLabel,
    };

    return {
        modalProps,
        openCrop,
        openCropQueue,
        closeCrop,
    };
}
