import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ProjectCardCreate from '../components/createproject/ProjectCardCreate';
import FilterSearchProject from '../components/createproject/FilterSearchProject';
import CreateProjectModal from '../components/createproject/CreateProjectModal';
import AddDescriptionPromptModal from '../components/createproject/AddDescriptionPromptModal';
import DeleteConfirmModal from '../components/createproject/DeleteConfirmModal';
import EditProjectModal from '../components/createproject/EditProjectModal';
import useCreateProjectPage from '../hooks/useCreateProjectPage';

export default function CreateProject() {
  const navigate = useNavigate();
  const {
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
  } = useCreateProjectPage({ navigate });

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
          ) : filteredProjects.length === 0 ? (
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
              {filteredProjects.map((project) => (
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
        onSuccess={handleCreateSuccess}
      />

      <AddDescriptionPromptModal
        isOpen={descriptionPrompt.open}
        canAddDescription={!!descriptionPrompt.projectId}
        onClose={() => setDescriptionPrompt({ open: false, projectId: null })}
        onAddDescription={() => {
          if (!descriptionPrompt.projectId) {
            setDescriptionPrompt({ open: false, projectId: null });
            return;
          }
          setDescriptionPrompt({ open: false, projectId: null });
          navigate(`/create-project/${descriptionPrompt.projectId}/edit-description`);
        }}
      />
    </div>
  );
}
