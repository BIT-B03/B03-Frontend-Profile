import React from 'react'
import AllProjectSvg from '../../assets/allproject.svg'
import OnProgressSvg from '../../assets/onprogres.svg'
import CompleteSvg from '../../assets/complete.svg'
import SearchSvg from '../../assets/search.svg'
// using native buttons here to avoid layout side-effects from wrapper component

export default function FilterSearch({ activeFilter, setActiveFilter, searchQuery, setSearchQuery }) {
  // Konsistenkan efek aktif tapi tetap gunakan warna per-status
  const activeBase = 'text-white border-2 ring-1'
  const inactiveBase = 'bg-gray-800/50 text-gray-300 border-gray-700'

  const allActiveClasses = `${activeBase} bg-filter-all-bg border-filter-all-border ring-[rgba(183,183,183,0.15)] hover:bg-[rgba(183,183,183,0.5)] hover:border-filter-all-border`
  const allInactiveClasses = `${inactiveBase} hover:border-filter-all-border hover:bg-[rgba(183,183,183,0.5)]`

  const progressActiveClasses = `${activeBase} bg-filter-red-bg border-filter-red-border ring-[rgba(222,0,0,0.12)] hover:bg-[rgba(222,0,0,0.5)] hover:border-filter-red-border`
  const progressInactiveClasses = `${inactiveBase} hover:border-filter-red-border hover:bg-[rgba(222,0,0,0.5)]`

  const completeActiveClasses = `${activeBase} bg-filter-sage-bg border-filter-sage-border ring-[rgba(34,165,167,0.12)] hover:bg-[rgba(34,165,167,0.5)] hover:border-filter-sage-border`
  const completeInactiveClasses = `${inactiveBase} hover:border-filter-sage-border hover:bg-[rgba(34,165,167,0.5)]`
  return (
    <section className="max-w-5xl mx-auto px-6 mb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gray-900/30 border border-gray-800 rounded-xl p-4 backdrop-blur">
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:flex md:gap-7 md:justify-start">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1 w-auto justify-center px-1.5 py-1.5 md:px-3 md:py-1.5 md:h-10 text-[10px] md:text-sm rounded-lg font-medium transition border whitespace-nowrap ${
              activeFilter === 'all' ? allActiveClasses : allInactiveClasses
            }`}
          >
            <img src={AllProjectSvg} alt="All Project" className="w-3 h-3 md:w-4 md:h-4" />
            All Project
          </button>

          <button
            onClick={() => setActiveFilter('progress')}
            className={`flex items-center gap-1 w-auto justify-center px-1.5 py-1.5 md:px-3 md:py-1.5 md:h-10 text-[10px] md:text-sm rounded-lg font-medium transition border whitespace-nowrap ${
              activeFilter === 'progress' ? progressActiveClasses : progressInactiveClasses
            }`}
          >
            <img src={OnProgressSvg} alt="On Progress" className="w-3 h-3 md:w-4 md:h-4" />
            On Progress
          </button>

          <button
            onClick={() => setActiveFilter('complete')}
            className={`flex items-center gap-1 w-auto justify-center px-1.5 py-1.5 md:px-3 md:py-1.5 md:h-10 text-[10px] md:text-sm rounded-lg font-medium transition border whitespace-nowrap ${
              activeFilter === 'complete' ? completeActiveClasses : completeInactiveClasses
            }`}
          >
            <img src={CompleteSvg} alt="Complete" className="w-3 h-3 md:w-4 md:h-4" />
            Complete
          </button>
        </div>

        <div className="relative w-full md:w-auto md:flex-1 md:max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm md:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <img
              src={SearchSvg}
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
