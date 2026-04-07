import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getAvatarImageUrl } from '../../api/api'
import ContributorSelect from './createProjectModal/ContributorSelect'
import { Field, PreviewPicker, ThumbnailPicker } from './createProjectModal/FormPieces'
import { INPUT_CLASS, STATUS_OPTIONS } from '../../constants/createProject/constants'
import useCreateProjectForm from '../../hooks/useCreateProjectForm'

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const {
    title,
    setTitle,
    shortDescription,
    setShortDescription,
    status,
    setStatus,
    thumbnail,
    thumbnailPreview,
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
  } = useCreateProjectForm({ isOpen, onClose, onSuccess })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
          <motion.div
            className="w-full max-w-lg rounded-2xl bg-[#0f1117] border border-gray-800 shadow-2xl flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
              <h2 className="text-base font-semibold text-white">Create Project</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white transition text-xl leading-none disabled:opacity-40"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* ── Scrollable body ─────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 sidebar-scrollbar">

                {/* Title */}
                <Field label="Title Project" required>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    className={INPUT_CLASS}
                    disabled={isSubmitting}
                  />
                </Field>

                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 px-3 py-2.5 text-xs text-gray-400">
                  Deskripsi rich text ditambahkan setelah project berhasil dibuat.
                </div>

                {/* Short Description */}
                <Field label="Short Description">
                  <input
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief summary"
                    className={INPUT_CLASS}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Status */}
                <Field label="Status">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`${INPUT_CLASS} cursor-pointer`}
                    disabled={isSubmitting}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>

                {/* Contributors */}
                <Field label="Contributor">
                  <ContributorSelect
                    users={users}
                    value={selectedContribs}
                    onChange={setSelectedContribs}
                    disabled={isSubmitting}
                    getAvatarImageUrl={getAvatarImageUrl}
                    inputClassName={INPUT_CLASS}
                  />
                </Field>

                {/* Thumbnail */}
                <Field label="Thumbnail">
                  <ThumbnailPicker
                    file={thumbnail}
                    previewUrl={thumbnailPreview}
                    onChange={handleThumbnailChange}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Preview images */}
                <Field label="Preview">
                  <PreviewPicker
                    previewUrls={previewUrls}
                    onAddFiles={addPreviewFiles}
                    onRemove={removePreview}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-3 py-2">{error}</p>
                )}
              </div>

              {/* ── Footer ──────────────────────────────────────────────── */}
              <div className="shrink-0 px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3 bg-gray-900/40">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl border border-gray-700 text-white text-sm hover:bg-white/5 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 font-semibold text-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
