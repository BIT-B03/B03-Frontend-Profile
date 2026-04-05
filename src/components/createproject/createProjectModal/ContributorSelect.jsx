import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function ContributorSelect({
  users,
  value,
  onChange,
  disabled,
  getAvatarImageUrl,
  inputClassName,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const myHashedId = localStorage.getItem('hashed_id') || ''

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => {
      if (u.hashed_id === myHashedId) return false
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q)
      )
    })
  }, [users, search, myHashedId])

  const selectedLabels = useMemo(() => {
    return users
      .filter((u) => value.includes(u.hashed_id))
      .map((u) => u.name || u.username)
  }, [users, value])

  const toggleContrib = (hashedId) => {
    if (value.includes(hashedId)) {
      onChange(value.filter((id) => id !== hashedId))
      return
    }
    onChange([...value, hashedId])
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={disabled}
        className={`${inputClassName} text-left flex items-center justify-between gap-2 w-full`}
      >
        <span className={selectedLabels.length ? 'text-white' : 'text-gray-500'}>
          {selectedLabels.length ? selectedLabels.join(', ') : 'Select contributors...'}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-gray-700">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none placeholder-gray-500"
            />
          </div>
          <ul className="max-h-44 overflow-y-auto sidebar-scrollbar">
            {filteredUsers.length === 0 && (
              <li className="px-3 py-2.5 text-gray-500 text-sm">No users found</li>
            )}
            {filteredUsers.map((u) => {
              const checked = value.includes(u.hashed_id)
              const avatarUrl = u.avatar_url ? getAvatarImageUrl(u.avatar_url) : null
              const initials = (u.name || u.username || '?')[0].toUpperCase()
              return (
                <li key={u.hashed_id}>
                  <button
                    type="button"
                    onClick={() => toggleContrib(u.hashed_id)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left transition-colors ${
                      checked
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={u.name || u.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium truncate">{u.name || u.username}</p>
                      {u.position && (
                        <p className="text-xs text-gray-500 truncate">{u.position}</p>
                      )}
                    </div>

                    {checked && (
                      <svg
                        className="w-4 h-4 text-brand-24e1c9 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              )}
            )}
          </ul>
          {value.length > 0 && (
            <div className="border-t border-gray-700 px-3 py-2 flex justify-end">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
