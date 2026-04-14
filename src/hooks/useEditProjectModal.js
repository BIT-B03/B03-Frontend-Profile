import { useCallback, useEffect, useRef, useState } from 'react';
import {
    getAllUsers,
    getProjectDetail,
    editProject,
} from '../api/api';
import { buildObjectUrl } from '../utils/createprojectmodal';
import useImageCropQueue from './useImageCropQueue';

const normalizeStatusValue = (raw = '') => {
    const s = raw.toLowerCase();
    if (s === 'on_progress' || s === 'progress' || s === 'on progress') return 'on_progress';
    if (s === 'completed' || s === 'complete') return 'completed';
    return 'on_progress';
};

export default function useEditProjectModal({ isOpen, projectId, onClose, onSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [status, setStatus] = useState('on_progress');

    const [thumbFile, setThumbFile] = useState(null);
    const [thumbObjUrl, setThumbObjUrl] = useState(null);
    const [existingThumb, setExistingThumb] = useState(null);

    const [existingPreviews, setExistingPreviews] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [previewsModified, setPreviewsModified] = useState(false);

    const [users, setUsers] = useState([]);
    const [selectedContribs, setSelectedContribs] = useState([]);

    const [loadingData, setLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const latestThumbUrlRef = useRef(null);
    const latestPreviewsRef = useRef([]);

    useEffect(() => {
        latestThumbUrlRef.current = thumbObjUrl;
    }, [thumbObjUrl]);

    useEffect(() => {
        latestPreviewsRef.current = newPreviews;
    }, [newPreviews]);

    useEffect(() => {
        if (!isOpen || !projectId) return;

        setLoadingData(true);
        setError(null);

        Promise.all([getProjectDetail(projectId), getAllUsers()])
            .then(([projectRes, usersRes]) => {
                const p = projectRes?.data || projectRes;
                const usersList = Array.isArray(usersRes?.data)
                    ? usersRes.data
                    : Array.isArray(usersRes) ? usersRes : [];

                setUsers(usersList);
                setTitle(p.title || '');
                setDescription(p.description || '');
                setShortDescription(p.short_description || '');
                setStatus(normalizeStatusValue(p.status || ''));
                setExistingThumb(p.thumbnail || p.thumbnail_url || null);

                const previews = Array.isArray(p.preview) ? p.preview
                    : Array.isArray(p.previews) ? p.previews
                        : [];
                setExistingPreviews(
                    previews
                        .map((pr) => {
                            if (typeof pr === 'string') return pr;
                            return pr.filename || pr.preview_url || pr.preview || pr.url || '';
                        })
                        .filter(Boolean)
                );

                const contribs = Array.isArray(p.contributors) ? p.contributors : [];
                setSelectedContribs(
                    contribs
                        .map((c) =>
                            c.user?.hashed_id ||
                            c.user?.id_hash ||
                            c.hashed_id ||
                            c.id_hash ||
                            null
                        )
                        .filter(Boolean)
                );
            })
            .catch(() => setError('Gagal memuat data proyek'))
            .finally(() => setLoadingData(false));
    }, [isOpen, projectId]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        return () => {
            const thumbUrl = latestThumbUrlRef.current;
            if (thumbUrl) URL.revokeObjectURL(thumbUrl);
            latestPreviewsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, []);

    const handleCropResult = useCallback((croppedFile, target) => {
        if (target === 'thumbnail') {
            if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl);
            setThumbFile(croppedFile);
            setThumbObjUrl(buildObjectUrl(croppedFile));
            setExistingThumb(null);
            return;
        }

        if (target === 'preview') {
            const url = buildObjectUrl(croppedFile);
            setNewPreviews((prev) => [...prev, { file: croppedFile, url }]);
            setPreviewsModified(true);
        }
    }, [thumbObjUrl]);

    const {
        modalProps: cropModalProps,
        openCrop,
        openCropQueue,
        closeCrop,
    } = useImageCropQueue({
        aspect: 16 / 9,
        cropShape: 'rect',
        showGrid: true,
        title: 'Crop Image',
        subtitle: 'Adjust the frame for a 16:9 crop.',
        saveLabel: 'Use Image',
        onCropped: handleCropResult,
    });

    const resetForm = useCallback(() => {
        setTitle('');
        setDescription('');
        setShortDescription('');
        setStatus('on_progress');
        setThumbFile(null);
        if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl);
        setThumbObjUrl(null);
        setExistingThumb(null);
        setNewPreviews((prev) => {
            prev.forEach((p) => URL.revokeObjectURL(p.url));
            return [];
        });
        setExistingPreviews([]);
        setPreviewsModified(false);
        setSelectedContribs([]);
        setError(null);
    }, [thumbObjUrl]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        closeCrop();
        resetForm();
        onClose();
    }, [isSubmitting, closeCrop, onClose, resetForm]);

    const handleThumbnailChange = useCallback((file) => {
        if (!file) return;
        openCrop(file, 'thumbnail');
    }, [openCrop]);

    const addPreviewFiles = useCallback((files) => {
        openCropQueue(files, 'preview');
    }, [openCropQueue]);

    const removeNewPreview = useCallback((idx) => {
        setNewPreviews((prev) => {
            if (!prev[idx]) return prev;
            URL.revokeObjectURL(prev[idx].url);
            return prev.filter((_, i) => i !== idx);
        });
        setPreviewsModified(true);
    }, []);

    const removeExistingPreview = useCallback((idx) => {
        setExistingPreviews((prev) => prev.filter((_, i) => i !== idx));
        setPreviewsModified(true);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!title.trim()) { setError('Judul proyek wajib diisi'); return; }
        if (selectedContribs.length === 0) { setError('Minimal 1 kontributor harus dipilih'); return; }

        setIsSubmitting(true);
        setError(null);

        try {
            const fd = new FormData();
            fd.append('title', title.trim());
            fd.append('description', description);
            fd.append('short_description', shortDescription);
            fd.append('status', status);

            if (thumbFile) fd.append('thumbnail', thumbFile);

            if (previewsModified) {
                fd.append('existing_previews', JSON.stringify(existingPreviews));
                newPreviews.forEach(({ file }) => fd.append('preview', file));
            }

            fd.append('contributors', JSON.stringify(selectedContribs));

            await editProject(projectId, fd);
            resetForm();
            onClose();
            onSuccess?.();
        } catch (err) {
            const msg = err?.response?.data?.message;
            setError(typeof msg === 'string' ? msg : 'Gagal menyimpan perubahan');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        description,
        existingPreviews,
        newPreviews,
        onClose,
        onSuccess,
        previewsModified,
        projectId,
        resetForm,
        selectedContribs,
        shortDescription,
        status,
        thumbFile,
        title,
    ]);

    return {
        title,
        setTitle,
        shortDescription,
        setShortDescription,
        status,
        setStatus,
        thumbFile,
        thumbObjUrl,
        existingThumb,
        existingPreviews,
        newPreviews,
        previewsModified,
        users,
        selectedContribs,
        setSelectedContribs,
        loadingData,
        isSubmitting,
        error,
        handleClose,
        handleThumbnailChange,
        addPreviewFiles,
        removeNewPreview,
        removeExistingPreview,
        handleSubmit,
        cropModalProps,
    };
}
