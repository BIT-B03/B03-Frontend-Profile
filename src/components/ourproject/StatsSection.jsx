import React from 'react'
import AllProjectSvg from '../../assets/allproject.svg'
import OnProgressSvg from '../../assets/onprogres.svg'
import CompleteSvg from '../../assets/complete.svg'

export default function StatsSection({ stats = { total: 0, progress: 0, complete: 0 } }) {
  const cardStyle = {}

  return (
    <section className="max-w-5xl mx-auto px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 rounded-2xl p-6 text-left transition backdrop-blur-md hover:border-opacity-60 bg-[rgba(8,10,15,0.75)] border-filter-all-border" style={cardStyle}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <img src={AllProjectSvg} alt="All Project" className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-gray-100 text-sm font-medium">Total Project</p>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="border-2 rounded-2xl p-6 text-left transition backdrop-blur-md hover:border-opacity-60 bg-[rgba(8,10,15,0.75)] border-filter-red-border" style={cardStyle}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <img src={OnProgressSvg} alt="On Progress" className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-gray-100 text-sm font-medium">On Progress</p>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.progress}</p>
            </div>
          </div>
        </div>

        <div className="border-2 rounded-2xl p-6 text-left transition backdrop-blur-md hover:border-opacity-60 bg-[rgba(8,10,15,0.75)] border-filter-sage-border" style={cardStyle}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <img src={CompleteSvg} alt="Complete" className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-gray-100 text-sm font-medium">Completed</p>
              <p className="text-3xl md:text-4xl font-bold text-white">{stats.complete}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
