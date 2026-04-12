import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteProject,
  getAllUsers,
  getInvitedProjects,
  getProjectsByCreator,
  SetAuthToken,
} from '../api/api';
import { normalizeProject } from '../utils/projectTransform';

export default function useCreateProjectPage({ navigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [ownerFilter, setOwnerFilter] = useState('my');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myHashedId, setMyHashedId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [descriptionPrompt, setDescriptionPrompt] = useState({ open: false, projectId: null });

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const fetchProjects = useCallback(
    async (hashedId) => {
      if (ownerFilter === 'my' && !hashedId) return;
      try {
        setLoading(true);
        setError(null);
        const res =
          ownerFilter === 'my'
            ? await getProjectsByCreator(hashedId)
            : await getInvitedProjects();
        const raw = Array.isArray(res?.data) ? res.data : [];
        setProjects(raw.map(normalizeProject));
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        if (status) {
          setProjects([]);
          return;
        }
        setError('Gagal memuat data proyek');
      } finally {
        setLoading(false);
      }
    },
    [ownerFilter, navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem('auth_access_token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    SetAuthToken(token);

    const storedUsername = localStorage.getItem('username') || '';
    const storedHashedId = localStorage.getItem('hashed_id') || null;

    if (storedHashedId) {
      setMyHashedId(storedHashedId);
      fetchProjects(storedHashedId);
      return;
    }

    let cancelled = false;
    const init = async () => {
      try {
        const res = await getAllUsers();
        const users = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const me = users.find(
          (u) =>
            (u.username || '').toLowerCase() === storedUsername.toLowerCase() ||
            (u.name || '').toLowerCase() === storedUsername.toLowerCase()
        );
        const hashedId = me?.hashed_id || me?.id_hash || null;
        if (cancelled) return;
        if (!hashedId) {
          setError('Tidak dapat menemukan data pengguna yang aktif');
          setLoading(false);
          return;
        }
        try {
          localStorage.setItem('hashed_id', hashedId);
        } catch {
          // ignore storage errors
        }
        setMyHashedId(hashedId);
        fetchProjects(hashedId);
      } catch {
        if (!cancelled) setError('Gagal memuat data pengguna');
      }
    };
    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDeleteClick = useCallback(
    (idHash) => {
      const project = projects.find((p) => p.id_hash === idHash);
      setDeleteTarget({ id_hash: idHash, title: project?.title || '' });
    },
    [projects]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      setDeletingId(deleteTarget.id_hash);
      await deleteProject(deleteTarget.id_hash);
      setProjects((prev) => prev.filter((p) => p.id_hash !== deleteTarget.id_hash));
      setDeleteTarget(null);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setDeleteError(typeof msg === 'string' ? msg : 'Gagal menghapus proyek');
    } finally {
      setDeletingId(null);
    }
  }, [deleteTarget]);

  const handleCreateSuccess = useCallback(
    (createdId) => {
      fetchProjects(myHashedId);
      setDescriptionPrompt({ open: true, projectId: createdId || null });
    },
    [fetchProjects, myHashedId]
  );

  const isMount = useRef(true);
  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }
    fetchProjects(myHashedId);
  }, [fetchProjects, myHashedId]);

  const filteredProjects = projects.filter((project) => {
    const statusMatch =
      ownerFilter !== 'my' ||
      statusFilter === 'all' ||
      project._filterKey === statusFilter;

    const searchMatch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return {
    collapsed,
    setCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    ownerFilter,
    setOwnerFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    projects,
    filteredProjects,
    loading,
    error,
    myHashedId,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editTargetId,
    setEditTargetId,
    deleteTarget,
    setDeleteTarget,
    deletingId,
    deleteError,
    setDeleteError,
    descriptionPrompt,
    setDescriptionPrompt,
    fetchProjects,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCreateSuccess,
  };
}
