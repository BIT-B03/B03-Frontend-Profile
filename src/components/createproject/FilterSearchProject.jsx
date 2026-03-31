import React, { useState, useRef, useEffect } from 'react'
import AllProjectSvg from '../../assets/allproject.svg'
import OnProgressSvg from '../../assets/onprogres.svg'
import CompleteSvg from '../../assets/complete.svg'
import SearchSvg from '../../assets/search.svg'

const STATUS_OPTIONS = [
  { key: 'all',      label: 'All Project', icon: AllProjectSvg },
  { key: 'progress', label: 'Onprogress',  icon: OnProgressSvg },
  { key: 'complete', label: 'Complate',    icon: CompleteSvg   },
]

// Style per status untuk button aktif
const STATUS_ACTIVE_STYLE = {
  all:      'bg-filter-all-bg border-filter-all-border ring-[rgba(183,183,183,0.15)] text-white border-2 ring-1',
  progress: 'bg-red-900/40 border-red-500 ring-[rgba(239,68,68,0.15)] text-red-300 border-2 ring-1',
  complete: 'bg-green-900/40 border-green-500 ring-[rgba(34,197,94,0.15)] text-green-300 border-2 ring-1',
}

// Style badge per status
const STATUS_BADGE_STYLE = {
  progress: 'bg-red-500/30 text-red-300',
  complete: 'bg-green-500/30 text-green-300',
}

export default function FilterSearchProject({
  ownerFilter,
  setOwnerFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onCreateClick,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const activeStatus = STATUS_OPTIONS.find((s) => s.key === statusFilter) || STATUS_OPTIONS[0]

  const handleMyProject = () => {
    if (ownerFilter !== 'my') {
      setOwnerFilter('my')
      setDropdownOpen(true)
    } else {
      setDropdownOpen((prev) => !prev)
    }
  }

  const handleContributor = () => {
    setOwnerFilter('contributor')
    setDropdownOpen(false)
  }

  const handleSelectStatus = (key) => {
    setStatusFilter(key)
    setDropdownOpen(false)
  }

  return (
    <section className="mb-6 relative z-30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-900/30 border border-gray-800 rounded-xl p-4 backdrop-blur">

        {/* ── Left: My Project (with status dropdown) + Contributor ──────── */}
        <div className="flex items-center gap-2">

          {/* My Project */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleMyProject}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm rounded-lg font-medium transition border whitespace-nowrap ${
                ownerFilter === 'my'
                  ? STATUS_ACTIVE_STYLE[statusFilter] || STATUS_ACTIVE_STYLE.all
                  : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-filter-all-border hover:bg-[rgba(183,183,183,0.2)]'
              }`}
            >
              <img src={activeStatus.icon} alt="" className="w-3 h-3 md:w-4 md:h-4" />
              {activeStatus.label}

              {/* Chevron */}
              <svg
                className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${
                  dropdownOpen && ownerFilter === 'my' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && ownerFilter === 'my' && (
              <div className="absolute top-full left-0 mt-1.5 z-50 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectStatus(opt.key)}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm transition-colors ${
                      statusFilter === opt.key
                        ? opt.key === 'progress'
                          ? 'bg-red-900/30 text-red-300 font-medium'
                          : opt.key === 'complete'
                          ? 'bg-green-900/30 text-green-300 font-medium'
                          : 'bg-white/10 text-white font-medium'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <img src={opt.icon} alt="" className="w-4 h-4 shrink-0" />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contributor */}
          <button
            onClick={handleContributor}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm rounded-lg font-medium transition border whitespace-nowrap ${
              ownerFilter === 'contributor'
                ? 'text-white border-2 ring-1 bg-filter-sage-bg border-filter-sage-border ring-[rgba(34,165,167,0.12)]'
                : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-filter-sage-border hover:bg-[rgba(34,165,167,0.2)]'
            }`}
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-2-3.46M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0zM3 10a3 3 0 116 0 3 3 0 01-6 0z"
              />
            </svg>
            Contributor
          </button>

          {/* Create Project (desktop) - tampil di md+ dan berada di sebelah Contributor */}
          <div className="hidden md:flex items-center self-center md:ml-2">
            <button
              onClick={onCreateClick}
              className="flex items-center gap-1.5 h-10 px-3 bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 font-semibold text-xs md:text-sm rounded-lg transition whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </button>
          </div>

          {/* Create Project (mobile) - kecil '+' dan berada di sebelah Contributor */}
          <button
            onClick={onCreateClick}
            className="md:hidden flex items-center justify-center w-9 h-9 ml-1 rounded-md bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 transition"
            aria-label="Create Project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* ── Right: Search + Create button ──────────────────────────────── */}
        <div className="relative flex items-center gap-3 w-full md:flex-1 md:max-w-sm">
          <input
            type="text"
            placeholder="Search....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-10 pl-10 pr-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <img
            src={SearchSvg}
            alt="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          />
          
        </div>

      </div>
    </section>
  )
}
