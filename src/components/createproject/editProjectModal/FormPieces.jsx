import React, { useRef } from 'react'

export function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export function ThumbnailPicker({ currentThumbSrc, thumbFile, onChange, disabled }) {
  const inputRef = useRef(null)

  const handleFileChange = (nextFile) => {
    if (!nextFile) return
    onChange(nextFile)
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFileChange(e.dataTransfer.files?.[0])
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-500 transition"
      >
        {currentThumbSrc ? (
          <img
            src={currentThumbSrc}
            alt="thumbnail"
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">
            {currentThumbSrc ? (
              <span className="text-white">
                {thumbFile ? thumbFile.name : 'Current thumbnail (click to replace)'}
              </span>
            ) : (
              <>
                <span className="text-white font-medium">Drop image here</span> or{' '}
                <span className="text-brand-24e1c9">browse</span>
              </>
            )}
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5">JPG, PNG, WebP supported</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
          className="shrink-0 px-3 py-1.5 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-xs font-semibold rounded-lg transition whitespace-nowrap"
        >
          {currentThumbSrc ? 'Replace' : 'Choose'}
        </button>
      </div>
    </>
  )
}

export function PreviewPicker({
  existingPreviews,
  newPreviews,
  previewsModified,
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
  disabled,
  getProjectPreviewImageUrl,
}) {
  const inputRef = useRef(null)

  const handleAddFiles = (files) => {
    if (!files?.length) return
    onAddFiles(files)
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleAddFiles(e.dataTransfer.files)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleAddFiles(e.target.files)}
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-500 transition"
      >
        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">Drop images here</span> or{' '}
            <span className="text-brand-24e1c9">browse</span>
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5">
            {previewsModified
              ? 'Previews will be replaced on save'
              : 'Add new previews - existing ones are preserved'}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
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
                  onClick={() => onRemoveExisting(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  x
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
                  onClick={() => onRemoveNew(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
