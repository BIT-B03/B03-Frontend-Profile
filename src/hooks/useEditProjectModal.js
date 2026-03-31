import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    getAllUsers,
    getProjectDetail,
    editProject,
} from '../api/api';

const buildObjectUrl = (file) => (file ? URL.createObjectURL(file) : null);

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
    const [contribDropOpen, setContribDropOpen] = useState(false);
    const [contribSearch, setContribSearch] = useState('');
    const contribRef = useRef(null);

    const [loadingData, setLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const thumbInputRef = useRef(null);
    const previewInputRef = useRef(null);

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
        const handler = (e) => {
            if (contribRef.current && !contribRef.current.contains(e.target)) {
                setContribDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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
        setContribSearch('');
        setError(null);
    }, [thumbObjUrl]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        resetForm();
        onClose();
    }, [isSubmitting, onClose, resetForm]);

    const handleThumbnailChange = useCallback((file) => {
        if (!file) return;
        if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl);
        setThumbFile(file);
        setThumbObjUrl(buildObjectUrl(file));
        setExistingThumb(null);
    }, [thumbObjUrl]);

    const onThumbDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleThumbnailChange(file);
    }, [handleThumbnailChange]);

    const addPreviewFiles = useCallback((files) => {
        const arr = Array.from(files || []);
        if (!arr.length) return;
        const entries = arr.map((file) => ({ file, url: buildObjectUrl(file) }));
        setNewPreviews((prev) => [...prev, ...entries]);
        setPreviewsModified(true);
    }, []);

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

    const onPreviewDrop = useCallback((e) => {
        e.preventDefault();
        addPreviewFiles(e.dataTransfer.files);
    }, [addPreviewFiles]);

    const toggleContrib = useCallback((hashedId) => {
        setSelectedContribs((prev) =>
            prev.includes(hashedId) ? prev.filter((id) => id !== hashedId) : [...prev, hashedId]
        );
    }, []);

    const myHashedId = useMemo(() => localStorage.getItem('hashed_id') || '', []);

    const filteredUsers = useMemo(() => users.filter((u) => {
        if (u.hashed_id === myHashedId) return false;
        const q = contribSearch.toLowerCase();
        return (
            !q ||
            (u.name || '').toLowerCase().includes(q) ||
            (u.username || '').toLowerCase().includes(q) ||
            (u.position || '').toLowerCase().includes(q)
        );
    }), [users, myHashedId, contribSearch]);

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

    const selectedLabels = useMemo(() => users
        .filter((u) => selectedContribs.includes(u.hashed_id))
        .map((u) => u.name || u.username)
    , [users, selectedContribs]);

    return {
        title,
        setTitle,
        description,
        setDescription,
        shortDescription,
        setShortDescription,
        status,
        setStatus,
        thumbFile,
        setThumbFile,
        thumbObjUrl,
        setThumbObjUrl,
        existingThumb,
        setExistingThumb,
        existingPreviews,
        setExistingPreviews,
        newPreviews,
        setNewPreviews,
        previewsModified,
        setPreviewsModified,
        users,
        selectedContribs,
        setSelectedContribs,
        contribDropOpen,
        setContribDropOpen,
        contribSearch,
        setContribSearch,
        contribRef,
        loadingData,
        isSubmitting,
        error,
        thumbInputRef,
        previewInputRef,
        handleClose,
        handleThumbnailChange,
        onThumbDrop,
        addPreviewFiles,
        removeNewPreview,
        removeExistingPreview,
        onPreviewDrop,
        toggleContrib,
        filteredUsers,
        handleSubmit,
        selectedLabels,
    };
}
