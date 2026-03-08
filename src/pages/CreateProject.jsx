import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ProjectCardCreate from '../components/createproject/ProjectCardCreate';
import FilterSearchProject from '../components/createproject/FilterSearchProject';
import CreateProjectModal from '../components/createproject/CreateProjectModal';
import DeleteConfirmModal from '../components/createproject/DeleteConfirmModal';
import EditProjectModal from '../components/createproject/EditProjectModal';
import { getProjectsByCreator, getInvitedProjects, getProjectThumbnailImageUrl, SetAuthToken, getAllUsers, deleteProject } from '../api/api';

// Map status string dari backend → label UI + key filter
const normalizeStatus = (raw = '') => {
  const s = raw.toLowerCase();
  if (s === 'on_progress' || s === 'progress') return { label: 'On Progress', filterKey: 'progress' };
  if (s === 'completed' || s === 'complete') return { label: 'Complete', filterKey: 'complete' };
  return { label: raw, filterKey: 'all' };
};

// Normalisasi satu project dari response backend ke shape yang dipakai ProjectCard
const normalizeProject = (p, idx) => {
  const { label, filterKey } = normalizeStatus(p.status);
  return {
    id: p.hashed_id || idx,
    id_hash: p.hashed_id || '',
    title: p.title || 'Untitled',
    description: p.short_description || p.description || '',
    status: label,
    _filterKey: filterKey,
    thumbnail_url: p.thumbnail || p.thumbnail_url || null,
    // thumbnail pakai endpoint public (browser tidak bisa kirim auth header lewat <img>)
    _thumbnailUrl: getProjectThumbnailImageUrl(p.thumbnail || p.thumbnail_url),
    creator: p.creator || null,
    contributors: Array.isArray(p.contributors) ? p.contributors : [],
  };
};

export default function CreateProject() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // "my" = My Project tab  |  "contributor" = Contributor tab
  const [ownerFilter, setOwnerFilter] = useState('my');

  // status filter (all / progress / complete) — only active under My Project tab
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // data state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myHashedId, setMyHashedId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);   // id_hash of project being edited
  const [deleteTarget, setDeleteTarget] = useState(null);   // { id_hash, title }
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null); // tambah ini

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  // Fetch projects — depends on myHashedId being set first
  const fetchProjects = useCallback(async (hashedId) => {
    if (ownerFilter === 'my' && !hashedId) return;
    try {
      setLoading(true);
      setError(null);
      const res = ownerFilter === 'my'
        ? await getProjectsByCreator(hashedId)
        : await getInvitedProjects();
      const raw = Array.isArray(res?.data) ? res.data : [];
      setProjects(raw.map(normalizeProject));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) { navigate('/login', { replace: true }); return; }
      // 404 = no projects found — treat as empty list, not an error
      if (status === 404) {
        setProjects([]);
        return;
      }
      setError('Gagal memuat data proyek');
    } finally {
      setLoading(false);
    }
  }, [ownerFilter, navigate]);

  // Set auth token on mount, cari hashed_id lewat public users list, lalu fetch projects
  useEffect(() => {
    const token = localStorage.getItem('auth_access_token');
    if (!token) { navigate('/login', { replace: true }); return; }
    SetAuthToken(token);

    const storedUsername = localStorage.getItem('username') || '';
    const storedHashedId = localStorage.getItem('hashed_id') || null;

    // Jika hashed_id sudah tersimpan dari login, langsung pakai
    if (storedHashedId) {
      setMyHashedId(storedHashedId);
      fetchProjects(storedHashedId);
      return;
    }

    // Fallback: cari dari public users list berdasarkan username
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
        // Simpan untuk session berikutnya
        try { localStorage.setItem('hashed_id', hashedId); } catch {}
        setMyHashedId(hashedId);
        fetchProjects(hashedId);
      } catch {
        if (!cancelled) setError('Gagal memuat data pengguna');
      }
    };
    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Delete project — open modal first
  const handleDeleteClick = useCallback((idHash) => {
    const project = projects.find((p) => p.id_hash === idHash);
    setDeleteTarget({ id_hash: idHash, title: project?.title || '' });
  }, [projects]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    try {
      setDeleteError(null) // reset error
      setDeletingId(deleteTarget.id_hash);
      await deleteProject(deleteTarget.id_hash);
      setProjects((prev) => prev.filter((p) => p.id_hash !== deleteTarget.id_hash));
      setDeleteTarget(null);
    } catch (err) {
      const msg = err?.response?.data?.message
      setDeleteError(typeof msg === 'string' ? msg : 'Gagal menghapus proyek')
    } finally {
      setDeletingId(null);
    }
  }, [deleteTarget, navigate]);

  // Re-fetch when tab changes (skip initial mount)
  const isMount = React.useRef(true);
  useEffect(() => {
    if (isMount.current) { isMount.current = false; return; }
    fetchProjects(myHashedId);
  }, [fetchProjects, myHashedId]);

  // ── filtering logic ───────────────────────────────────────────────────────
  const filtered = projects.filter((p) => {
    // Status dropdown hanya berlaku saat tab My Project
    const statusMatch =
      ownerFilter !== 'my' ||
      statusFilter === 'all' ||
      p._filterKey === statusFilter;

    const searchMatch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <div className="p-6 sm:p-8">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <Header
            title="Dashboard Create Project"
            onMobileMenuClick={() => setMobileSidebarOpen(true)}
            onDesktopMenuClick={() => setCollapsed((v) => !v)}
          />

          {/* Create Project button moved into FilterSearchProject component */}

          {/* ── Filter bar ──────────────────────────────────────────────── */}
          <FilterSearchProject
            ownerFilter={ownerFilter}
            setOwnerFilter={setOwnerFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          {/* ── Project cards grid ──────────────────────────────────────── */}
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-gray text-sm">
              Memuat proyek...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-400 text-sm">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-gray">
              <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">Tidak ada proyek ditemukan</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCardCreate
                  key={project.id}
                  project={{ ...project, thumbnail_url: project._thumbnailUrl }}
                  onViewDetail={(idHash) => navigate(`/create-project/${idHash}`)}
                  onEdit={(idHash) => setEditTargetId(idHash)}
                  onDelete={handleDeleteClick}
                  maxDescriptionWords={20}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Project Modal ──────────────────────────────────────── */}
      <EditProjectModal
        key={editTargetId || '__none__'}
        isOpen={!!editTargetId}
        projectId={editTargetId}
        onClose={() => setEditTargetId(null)}
        onSuccess={() => fetchProjects(myHashedId)}
      />

      {/* ── Delete Confirm Modal ─────────────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        projectTitle={deleteTarget?.title}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        error={deleteError}
      />

      {/* ── Create Project Modal ─────────────────────────────────────── */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchProjects(myHashedId)}
      />
    </div>
  );
}
