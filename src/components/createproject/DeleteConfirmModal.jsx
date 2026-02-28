import React, { useState, useEffect } from 'react'

export default function DeleteConfirmModal({ isOpen, projectTitle, onCancel, onConfirm, loading, error }) {
  const [inputValue, setInputValue] = useState('')

  // Reset input setiap modal dibuka
  useEffect(() => {
    if (isOpen) setInputValue('')
  }, [isOpen])

  if (!isOpen) return null

  const isValid = inputValue === 'delete'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-base">Confirm Deletion</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning info */}
        <div className="flex items-start gap-2 bg-filter-red-bg border border-filter-red-border rounded-lg px-3 py-2.5 mb-5">
          <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <p className="text-red-300 text-xs leading-relaxed">
            You are about to permanently delete{' '}
            <span className="font-bold text-white">{projectTitle || 'this project'}</span>.
            This action cannot be undone.
          </p>
        </div>

        {/* Input confirmation */}
        <div className="mb-5">
          <label className="block text-gray-400 text-xs mb-1.5">
            Type <span className="font-bold text-white">delete</span> to confirm
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='delete'
            className="w-full h-10 px-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-filter-red-border focus:ring-1 focus:ring-filter-red-border transition"
            autoFocus
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValid || loading}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition ${
              isValid && !loading
                ? 'bg-filter-red-bg border-filter-red-border text-white hover:bg-[rgba(222,0,0,0.6)] cursor-pointer'
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-10 0h14"
                  />
                </svg>
                Delete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
