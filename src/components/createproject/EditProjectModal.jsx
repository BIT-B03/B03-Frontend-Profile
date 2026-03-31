import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  getProjectThumbnailImageUrl,
  getProjectPreviewImageUrl,
} from '../../api/api'
import useEditProjectModal from '../../hooks/useEditProjectModal'
import ImageCropModal from '../common/ImageCropModal'
import useImageCropQueue from '../../hooks/useImageCropQueue'

const STATUS_OPTIONS = [
  { value: 'on_progress', label: 'On Progress' },
  { value: 'completed', label: 'Complete' },
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
const buildObjectUrl = (file) => (file ? URL.createObjectURL(file) : null)

const normalizeStatusValue = (raw = '') => {
  const s = raw.toLowerCase()
  if (s === 'on_progress' || s === 'progress' || s === 'on progress') return 'on_progress'
  if (s === 'completed' || s === 'complete') return 'completed'
  return 'on_progress'
}

export default function EditProjectModal({ isOpen, projectId, onClose, onSuccess }) {
  /* ── form fields ──────────────────────────────────────────────────────── */
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [status, setStatus] = useState('on_progress')

  /* ── thumbnail ────────────────────────────────────────────────────────── */
  const [thumbFile, setThumbFile] = useState(null)    // new File
  const [thumbObjUrl, setThumbObjUrl] = useState(null)    // Object URL for new file
  const [existingThumb, setExistingThumb] = useState(null)    // filename from server

  /* ── previews ─────────────────────────────────────────────────────────── */
  const [existingPreviews, setExistingPreviews] = useState([])   // filenames from server
  // Single array of { file: File, url: string } — keeps files & URLs always in sync
  const [newPreviews, setNewPreviews] = useState([])   // { file, url }[]
  const [previewsModified, setPreviewsModified] = useState(false)

  /* ── contributors ─────────────────────────────────────────────────────── */
  const [users, setUsers] = useState([])
  const [selectedContribs, setSelectedContribs] = useState([])    // hashed_id[]
  const [contribDropOpen, setContribDropOpen] = useState(false)
  const [contribSearch, setContribSearch] = useState('')
  const contribRef = useRef(null)

  /* ── misc ─────────────────────────────────────────────────────────────── */
  const [loadingData, setLoadingData] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const thumbInputRef = useRef(null)
  const previewInputRef = useRef(null)

  /* ── fetch project + users when modal opens ───────────────────────────── */
  // NOTE: EditProjectModal uses key={projectId} in the parent so a fresh component
  // instance is created each time a different project is opened. This means the
  // effect only ever runs once per mount — no ref guard needed.
  useEffect(() => {
    if (!isOpen || !projectId) return

    setLoadingData(true)
    setError(null)

    Promise.all([getProjectDetail(projectId), getAllUsers()])
      .then(([projectRes, usersRes]) => {
        const p = projectRes?.data || projectRes
        const usersList = Array.isArray(usersRes?.data)
          ? usersRes.data
          : Array.isArray(usersRes) ? usersRes : []

        setUsers(usersList)
        setTitle(p.title || '')
        setDescription(p.description || '')
        setShortDescription(p.short_description || '')
        setStatus(normalizeStatusValue(p.status || ''))
        setExistingThumb(p.thumbnail || p.thumbnail_url || null)

        // Existing preview filenames
        // Authenticated API returns key 'preview' (array of objects with .filename)
        const previews = Array.isArray(p.preview) ? p.preview
          : Array.isArray(p.previews) ? p.previews
            : []
        setExistingPreviews(
          previews
            .map((pr) => {
              if (typeof pr === 'string') return pr
              // { filename: '...' } shape (ProjectPreview model)
              return pr.filename || pr.preview_url || pr.preview || pr.url || ''
            })
            .filter(Boolean)
        )

        // Contributors → user hashed_ids
        // Authenticated endpoint uses joinedload(Contributor.user), so the user fields
        // are nested under c.user. Public API flattens them onto c directly.
        // Priority: c.user.hashed_id  →  c.user.id_hash  →  c.hashed_id  →  c.id_hash
        const contribs = Array.isArray(p.contributors) ? p.contributors : []
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
        )
      })
      .catch(() => setError('Gagal memuat data proyek'))
      .finally(() => setLoadingData(false))
  }, [isOpen, projectId])

  /* ── close contrib dropdown on outside click ──────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (contribRef.current && !contribRef.current.contains(e.target)) {
        setContribDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── lock body scroll ─────────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ── cleanup object URLs on unmount ───────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl)
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── reset ────────────────────────────────────────────────────────────── */
  const resetForm = useCallback(() => {
    setTitle('')
    setDescription('')
    setShortDescription('')
    setStatus('on_progress')
    setThumbFile(null)
    if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl)
    setThumbObjUrl(null)
    setExistingThumb(null)
    setNewPreviews((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return [] })
    setExistingPreviews([])
    setPreviewsModified(false)
    setSelectedContribs([])
    setContribSearch('')
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCropResult = useCallback((croppedFile, target) => {
    if (target === 'thumbnail') {
      if (thumbObjUrl) URL.revokeObjectURL(thumbObjUrl)
      setThumbFile(croppedFile)
      setThumbObjUrl(buildObjectUrl(croppedFile))
      setExistingThumb(null)
      return
    }

    if (target === 'preview') {
      const url = buildObjectUrl(croppedFile)
      setNewPreviews((prev) => [...prev, { file: croppedFile, url }])
      setPreviewsModified(true)
    }
  }, [thumbObjUrl])

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
  })

  const handleClose = () => {
    if (isSubmitting) return
    closeCrop()
    resetForm()
    onClose()
  }

  /* ── thumbnail ────────────────────────────────────────────────────────── */
  const handleThumbnailChange = (file) => {
    if (!file) return
    openCrop(file, 'thumbnail')
  }

  const onThumbDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleThumbnailChange(file)
  }

  /* ── preview images ───────────────────────────────────────────────────── */
  const addPreviewFiles = (files) => {
    openCropQueue(files, 'preview')
  }

  const removeNewPreview = (idx) => {
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url)
      return prev.filter((_, i) => i !== idx)
    })
    setPreviewsModified(true)
  }

  const removeExistingPreview = (idx) => {
    setExistingPreviews((prev) => prev.filter((_, i) => i !== idx))
    setPreviewsModified(true)
  }


  const onPreviewDrop = (e) => {
    e.preventDefault()
    addPreviewFiles(e.dataTransfer.files)
  }

  /* ── contributors ─────────────────────────────────────────────────────── */
  const toggleContrib = (hashedId) => {
    setSelectedContribs((prev) =>
      prev.includes(hashedId) ? prev.filter((id) => id !== hashedId) : [...prev, hashedId]
    )
  }

  const myHashedId = localStorage.getItem('hashed_id') || ''

  const filteredUsers = users.filter((u) => {
    if (u.hashed_id === myHashedId) return false
    const q = contribSearch.toLowerCase()
    return (
      !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.position || '').toLowerCase().includes(q)
    )
  })

  /* ── submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Judul proyek wajib diisi'); return }
    if (selectedContribs.length === 0) { setError('Minimal 1 kontributor harus dipilih'); return }

    setIsSubmitting(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('description', description)
      fd.append('short_description', shortDescription)
      fd.append('status', status)

      if (thumbFile) fd.append('thumbnail', thumbFile)

      // Only send preview fields if user modified the previews section.
      // existing_previews → JSON array of filenames to KEEP (strings, no files)
      // preview           → new file uploads only
      // Separating the two keys removes all ambiguity in parse_request_data.
      if (previewsModified) {
        // Tell backend which existing filenames to retain (as a JSON array)
        fd.append('existing_previews', JSON.stringify(existingPreviews))
        // Send only newly added files under 'preview'
        newPreviews.forEach(({ file }) => fd.append('preview', file))
      }

      // Send as JSON string — same as CreateProjectModal — so _normalize_contributors() can parse it
      fd.append('contributors', JSON.stringify(selectedContribs))

      await editProject(projectId, fd)
      resetForm()
      onClose()
      onSuccess?.()
    } catch (err) {
      const msg = err?.response?.data?.message
      setError(typeof msg === 'string' ? msg : 'Gagal menyimpan perubahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedLabels = users
    .filter((u) => selectedContribs.includes(u.hashed_id))
    .map((u) => u.name || u.username)

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
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors ${selected ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
      <ImageCropModal {...cropModalProps} />
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
