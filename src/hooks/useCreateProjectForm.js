import { useCallback, useEffect, useRef, useState } from 'react';
import { createProject, getAllUsers } from '../api/api';
import { buildObjectUrl } from '../utils/createprojectmodal';

export default function useCreateProjectForm({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [status, setStatus] = useState('on_progress');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [users, setUsers] = useState([]);
  const [selectedContribs, setSelectedContribs] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const latestThumbnailPreviewRef = useRef(null);
  const latestPreviewUrlsRef = useRef([]);

  useEffect(() => {
    latestThumbnailPreviewRef.current = thumbnailPreview;
  }, [thumbnailPreview]);

  useEffect(() => {
    latestPreviewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    if (!isOpen) return;
    getAllUsers()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setUsers(list);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (latestThumbnailPreviewRef.current) {
        URL.revokeObjectURL(latestThumbnailPreviewRef.current);
      }
      latestPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const resetForm = useCallback(() => {
    setTitle('');
    setShortDescription('');
    setStatus('on_progress');
    setThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setPreviewUrls([]);
    setSelectedContribs([]);
    setError(null);
  }, [previewUrls, thumbnailPreview]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }, [isSubmitting, onClose, resetForm]);

  const handleThumbnailChange = useCallback(
    (file) => {
      if (!file) return;
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnail(file);
      setThumbnailPreview(buildObjectUrl(file));
    },
    [thumbnailPreview]
  );

  const addPreviewFiles = useCallback((files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const urls = arr.map(buildObjectUrl);
    setPreviews((prev) => [...prev, ...arr]);
    setPreviewUrls((prev) => [...prev, ...urls]);
  }, []);

  const removePreview = useCallback((idx) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  }, [previewUrls]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!thumbnail) { setError('Thumbnail wajib diisi.'); return; }
    if (previews.length === 0) { setError('Minimal 1 gambar preview wajib diisi.'); return; }

    const creatorHashedId = localStorage.getItem('hashed_id') || '';
    if (!creatorHashedId) {
      setError('Tidak dapat menemukan data pengguna aktif. Silakan login ulang.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', '');
      fd.append('short_description', shortDescription.trim());
      fd.append('status', status);
      fd.append('created_by', creatorHashedId);
      fd.append('contributors', JSON.stringify(selectedContribs));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      previews.forEach((f) => fd.append('preview', f));

      const created = await createProject(fd);
      const createdPayload = created?.data ?? created;
      const createdId =
        createdPayload?.hashed_id ||
        createdPayload?.id_hash ||
        createdPayload?.idHash ||
        createdPayload?.project?.hashed_id ||
        createdPayload?.project?.id_hash ||
        null;
      resetForm();
      onSuccess?.(createdId, created);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    onClose,
    onSuccess,
    previews,
    resetForm,
    selectedContribs,
    shortDescription,
    status,
    thumbnail,
    title,
  ]);

  return {
    title,
    setTitle,
    shortDescription,
    setShortDescription,
    status,
    setStatus,
    thumbnail,
    thumbnailPreview,
    previews,
    previewUrls,
    users,
    selectedContribs,
    setSelectedContribs,
    isSubmitting,
    error,
    handleThumbnailChange,
    addPreviewFiles,
    removePreview,
    handleSubmit,
    handleClose,
  };
}
