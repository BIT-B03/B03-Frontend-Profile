import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  getProjectThumbnailImageUrl,
  getProjectPreviewImageUrl,
} from '../../api/api'
import useEditProjectModal from '../../hooks/useEditProjectModal'

const STATUS_OPTIONS = [
  { value: 'on_progress', label: 'On Progress' },
  { value: 'completed',   label: 'Complete'    },
]

export default function EditProjectModal({ isOpen, projectId, onClose, onSuccess }) {
  const navigate = useNavigate()
  const {
    title,
    setTitle,
    description,
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
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                  <Field label="Title Project" required>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter project title"
                      className={inputCls}
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
                      className={inputCls}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                      disabled={isSubmitting}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Contributor">
                    <div className="relative" ref={contribRef}>
                      <button
                        type="button"
                        onClick={() => setContribDropOpen((v) => !v)}
                        disabled={isSubmitting}
                        className={`${inputCls} text-left flex items-center justify-between gap-2 w-full`}
                      >
                        <span className={selectedLabels.length ? 'text-white truncate' : 'text-gray-500'}>
                          {selectedLabels.length ? selectedLabels.join(', ') : 'Select contributors...'}
                        </span>
                        <svg
                          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${contribDropOpen ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {contribDropOpen && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                          <div className="p-2 border-b border-gray-700">
                            <input
                              value={contribSearch}
                              onChange={(e) => setContribSearch(e.target.value)}
                              placeholder="Search..."
                              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none placeholder-gray-500"
                            />
                          </div>
                          <ul className="max-h-44 overflow-y-auto">
                            {filteredUsers.length === 0 && (
                              <li className="px-3 py-2.5 text-gray-500 text-sm">No users found</li>
                            )}
                            {filteredUsers.map((u) => {
                              const selected = selectedContribs.includes(u.hashed_id)
                              return (
                                <li key={u.hashed_id}>
                                  <button
                                    type="button"
                                    onClick={() => toggleContrib(u.hashed_id)}
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors ${
                                      selected ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                  >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                      {(u.name || u.username || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <p className="font-medium truncate">{u.name || u.username}</p>
                                      {u.position && <p className="text-xs text-gray-500 truncate">{u.position}</p>}
                                    </div>
                                    {selected && (
                                      <svg className="w-4 h-4 text-brand-24e1c9 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                          {selectedContribs.length > 0 && (
                            <div className="border-t border-gray-700 px-3 py-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setSelectedContribs([])}
                                className="text-xs text-gray-400 hover:text-white transition"
                              >
                                Clear all
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Field>

                  <Field label="Thumbnail">
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
                    />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onThumbDrop}
                      onClick={() => thumbInputRef.current?.click()}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-500 transition"
                    >
                      {currentThumbSrc ? (
                        <img src={currentThumbSrc} alt="thumbnail" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">
                          {currentThumbSrc
                            ? <span className="text-white">{thumbFile ? thumbFile.name : 'Current thumbnail (click to replace)'}</span>
                            : <><span className="text-white font-medium">Drop image here</span> or <span className="text-brand-24e1c9">browse</span></>
                          }
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5">JPG, PNG, WebP supported</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); thumbInputRef.current?.click() }}
                        className="shrink-0 px-3 py-1.5 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold rounded-lg transition whitespace-nowrap"
                      >
                        {currentThumbSrc ? 'Replace' : 'Choose'}
                      </button>
                    </div>
                  </Field>

                  <Field label="Preview Images">
                    <input
                      ref={previewInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={(e) => addPreviewFiles(e.target.files)}
                    />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onPreviewDrop}
                      onClick={() => previewInputRef.current?.click()}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-500 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">
                          <span className="text-white font-medium">Drop images here</span> or <span className="text-brand-24e1c9">browse</span>
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5">
                          {previewsModified
                            ? 'Previews will be replaced on save'
                            : 'Add new previews — existing ones are preserved'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); previewInputRef.current?.click() }}
                        className="shrink-0 px-3 py-1.5 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold rounded-lg transition whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>

                    {existingPreviews.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-500 mb-1.5">Current previews</p>
                        <div className="grid grid-cols-4 gap-2">
                          {existingPreviews.map((filename, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={getProjectPreviewImageUrl(filename)}
                                alt={`existing-preview-${idx}`}
                                className="w-full aspect-square object-cover rounded-lg opacity-80"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingPreview(idx)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {newPreviews.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-500 mb-1.5">New previews</p>
                        <div className="grid grid-cols-4 gap-2">
                          {newPreviews.map(({ url }, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`new-preview-${idx}`}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeNewPreview(idx)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

/* ── helpers ──────────────────────────────────────────────────────────────── */
const inputCls = 'w-full px-3 py-2 rounded-xl bg-gray-800/60 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-24e1c9 focus:ring-1 focus:ring-brand-24e1c9/50 transition'

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-300">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
