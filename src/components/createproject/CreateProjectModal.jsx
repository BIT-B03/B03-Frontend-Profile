import React, { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createProject, getAllUsers } from '../../api/api'

const STATUS_OPTIONS = [
  { value: 'on_progress', label: 'On Progress' },
  { value: 'completed',   label: 'Complete'    },
]

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
const buildObjectUrl = (file) => file ? URL.createObjectURL(file) : null

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  /* ── form fields ──────────────────────────────────────────────────────── */
  const [title,            setTitle]            = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [status,           setStatus]           = useState('on_progress')
  const [thumbnail,        setThumbnail]        = useState(null)       // File
  const [thumbnailPreview, setThumbnailPreview] = useState(null)       // ObjectURL
  const [previews,         setPreviews]         = useState([])         // File[]
  const [previewUrls,      setPreviewUrls]      = useState([])         // ObjectURL[]

  /* ── contributor selection ────────────────────────────────────────────── */
  const [users,             setUsers]             = useState([])
  const [selectedContribs,  setSelectedContribs]  = useState([])        // hashed_id[]
  const [contribDropOpen,   setContribDropOpen]   = useState(false)
  const [contribSearch,     setContribSearch]     = useState('')
  const contribRef = useRef(null)

  /* ── misc ─────────────────────────────────────────────────────────────── */
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error,        setError]        = useState(null)

  const thumbInputRef    = useRef(null)
  const previewInputRef  = useRef(null)

  /* ── fetch users once modal opens ────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    getAllUsers()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
        setUsers(list)
      })
      .catch(() => {})
  }, [isOpen])

  /* ── close contrib dropdown on outside click ──────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (contribRef.current && !contribRef.current.contains(e.target))
        setContribDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── lock body scroll ─────────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ── cleanup object URLs ──────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
      previewUrls.forEach((u) => URL.revokeObjectURL(u))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── reset form ───────────────────────────────────────────────────────── */
  const resetForm = useCallback(() => {
    setTitle('')
    setShortDescription('')
    setStatus('on_progress')
    setThumbnail(null)
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnailPreview(null)
    previewUrls.forEach((u) => URL.revokeObjectURL(u))
    setPreviews([])
    setPreviewUrls([])
    setSelectedContribs([])
    setContribSearch('')
    setError(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    if (isSubmitting) return
    resetForm()
    onClose()
  }

  /* ── thumbnail ────────────────────────────────────────────────────────── */
  const handleThumbnailChange = (file) => {
    if (!file) return
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnail(file)
    setThumbnailPreview(buildObjectUrl(file))
  }

  const onThumbDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleThumbnailChange(file)
  }

  /* ── preview images ───────────────────────────────────────────────────── */
  const addPreviewFiles = (files) => {
    const arr = Array.from(files)
    if (!arr.length) return
    const urls = arr.map(buildObjectUrl)
    setPreviews((prev) => [...prev, ...arr])
    setPreviewUrls((prev) => [...prev, ...urls])
  }

  const removePreview = (idx) => {
    URL.revokeObjectURL(previewUrls[idx])
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx))
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
    // Exclude the logged-in user (they're the creator)
    if (u.hashed_id === myHashedId) return false
    const q = contribSearch.toLowerCase()
    return (
      (u.name     || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q)
    )
  })

  /* ── submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    if (selectedContribs.length === 0) { setError('Pilih minimal 1 kontributor.'); return }
    if (!thumbnail) { setError('Thumbnail wajib diisi.'); return }
    if (previews.length === 0) { setError('Minimal 1 gambar preview wajib diisi.'); return }

    const creatorHashedId = localStorage.getItem('hashed_id') || ''
    if (!creatorHashedId) { setError('Tidak dapat menemukan data pengguna aktif. Silakan login ulang.'); return }

    setError(null)
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title',             title.trim())
      fd.append('description',       '')
      fd.append('short_description', shortDescription.trim())
      fd.append('status',            status)
      fd.append('created_by',    creatorHashedId)
      // Kirim sebagai JSON string agar _normalize_contributors bisa parse semua value
      fd.append('contributors', JSON.stringify(selectedContribs))
      if (thumbnail) fd.append('thumbnail', thumbnail)
      // Backend menggunakan request.files.getlist('preview') — key harus 'preview'
      previews.forEach((f) => fd.append('preview', f))

      const created = await createProject(fd)
      const createdPayload = created?.data ?? created
      const createdId =
        createdPayload?.hashed_id ||
        createdPayload?.id_hash ||
        createdPayload?.idHash ||
        createdPayload?.project?.hashed_id ||
        createdPayload?.project?.id_hash ||
        null
      resetForm()
      onSuccess?.(createdId, created)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── selected contributor labels chip ────────────────────────────────── */
  const selectedLabels = users
    .filter((u) => selectedContribs.includes(u.hashed_id))
    .map((u) => u.name || u.username)

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
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                {/* Title */}
                <Field label="Title Project" required>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    className={inputCls}
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
                    className={inputCls}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Status */}
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

                {/* Contributors */}
                <Field label="Contributor">
                  <div className="relative" ref={contribRef}>
                    <button
                      type="button"
                      onClick={() => setContribDropOpen((v) => !v)}
                      disabled={isSubmitting}
                      className={`${inputCls} text-left flex items-center justify-between gap-2 w-full`}
                    >
                      <span className={selectedLabels.length ? 'text-white' : 'text-gray-500'}>
                        {selectedLabels.length
                          ? selectedLabels.join(', ')
                          : 'Select contributors...'}
                      </span>
                      <svg className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${contribDropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {contribDropOpen && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-gray-700">
                          <input
                            value={contribSearch}
                            onChange={(e) => setContribSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none placeholder-gray-500"
                          />
                        </div>
                        {/* List */}
                        <ul className="max-h-44 overflow-y-auto">
                          {filteredUsers.length === 0 && (
                            <li className="px-3 py-2.5 text-gray-500 text-sm">No users found</li>
                          )}
                          {filteredUsers.map((u) => {
                            const checked = selectedContribs.includes(u.hashed_id)
                            return (
                              <li key={u.hashed_id}>
                                <button
                                  type="button"
                                  onClick={() => toggleContrib(u.hashed_id)}
                                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left transition-colors ${checked ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                >
                                  {/* Checkbox */}
                                  <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-brand-24e1c9 border-brand-24e1c9' : 'border-gray-600'}`}>
                                    {checked && (
                                      <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                  <span>{u.name || u.username}</span>
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

                {/* Thumbnail */}
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
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="thumbnail" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        {thumbnailPreview
                          ? <span className="text-white">{thumbnail?.name}</span>
                          : <><span className="text-white font-medium">Drop JPG here</span> or <span className="text-brand-24e1c9">browse</span></>
                        }
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">Only JPG, PNG files are allowed</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); thumbInputRef.current?.click() }}
                      className="shrink-0 px-3 py-1.5 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold rounded-lg transition whitespace-nowrap"
                    >
                      Choose JPG
                    </button>
                  </div>
                </Field>

                {/* Preview images */}
                <Field label="Preview">
                  <input
                    ref={previewInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={(e) => addPreviewFiles(e.target.files)}
                  />
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onPreviewDrop}
                    onClick={() => previewInputRef.current?.click()}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-500 transition"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        <span className="text-white font-medium">Drop JPG here</span> or <span className="text-brand-24e1c9">browse</span>
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">Only JPG, PNG files are allowed</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); previewInputRef.current?.click() }}
                      className="shrink-0 px-3 py-1.5 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold rounded-lg transition whitespace-nowrap"
                    >
                      Choose JPG
                    </button>
                  </div>

                  {/* Preview thumbnails grid */}
                  {previewUrls.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePreview(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
