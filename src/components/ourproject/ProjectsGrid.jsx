import React from 'react'
import ProjectCard from './ProjectCard'

export default function ProjectsGrid({ loading, error, filteredProjects, onViewDetail }) {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Memuat proyek...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Tidak ada proyek ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onViewDetail={onViewDetail} />
          ))}
        </div>
      )}
    </section>
  )
}
