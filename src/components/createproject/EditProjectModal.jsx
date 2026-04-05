import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  getProjectThumbnailImageUrl,
  getProjectPreviewImageUrl,
  getAvatarImageUrl,
} from '../../api/api'
import useEditProjectModal from '../../hooks/useEditProjectModal'
import ContributorSelect from './editProjectModal/ContributorSelect'
import { Field, PreviewPicker, ThumbnailPicker } from './editProjectModal/FormPieces'
import { INPUT_CLASS, STATUS_OPTIONS } from '../../constants/createProject/constants'

export default function EditProjectModal({ isOpen, projectId, onClose, onSuccess }) {
  const navigate = useNavigate()
  const {
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
    loadingData,
    isSubmitting,
    error,
    handleClose,
    handleThumbnailChange,
    addPreviewFiles,
    removeNewPreview,
    removeExistingPreview,
    handleSubmit,
    setSelectedContribs,
  } = useEditProjectModal({ isOpen, projectId, onClose, onSuccess })

  const currentThumbSrc = thumbObjUrl || (existingThumb ? getProjectThumbnailImageUrl(existingThumb) : null)
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
              <h2 className="text-base font-semibold text-white">Edit Project</h2>
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

            {loadingData ? (
              <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
                <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Memuat data proyek...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 sidebar-scrollbar">
                  <Field label="Title Project" required>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter project title"
                      className={INPUT_CLASS}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field label="Description Project">
                    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-gray-400">
                          Edit deskripsi di halaman khusus agar lebih leluasa.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (!projectId) return
                            handleClose()
                            navigate(`/create-project/${projectId}/edit-description`)
                          }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 rounded-lg bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold transition disabled:opacity-60"
                        >
                          Edit Description
                        </button>
                      </div>
                    </div>
                  </Field>

                  <Field label="Short Description">
                    <input
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Brief summary"
                      className={INPUT_CLASS}
                      disabled={isSubmitting}
                    />
                  </Field>

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

                  <Field label="Thumbnail">
                    <ThumbnailPicker
                      currentThumbSrc={currentThumbSrc}
                      thumbFile={thumbFile}
                      onChange={handleThumbnailChange}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field label="Preview Images">
                    <PreviewPicker
                      existingPreviews={existingPreviews}
                      newPreviews={newPreviews}
                      previewsModified={previewsModified}
                      onAddFiles={addPreviewFiles}
                      onRemoveExisting={removeExistingPreview}
                      onRemoveNew={removeNewPreview}
                      disabled={isSubmitting}
                      getProjectPreviewImageUrl={getProjectPreviewImageUrl}
                    />
                  </Field>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-3 py-2">
                      {error}
                    </p>
                  )}
                </div>

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
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 font-semibold text-sm transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
