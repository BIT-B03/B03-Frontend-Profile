import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/homepage/Footer'
import GlowSvg from '../assets/glow.svg'
import StatsSection from '../components/ourproject/StatsSection'
import FilterSearch from '../components/ourproject/FilterSearch'
import ProjectsGrid from '../components/ourproject/ProjectsGrid'
import Pagination from '../components/filter/Pagination'
import useOurProjectPageData from '../hooks/useOurProjectPageData'

export default function OurProject() {
  const navigate = useNavigate()
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'People', href: '/people' },
    { label: 'Project', href: '/project' }
  ];

  const {
    activeFilter,
    searchQuery,
    stats,
    projects,
    loading,
    isTransitioning,
    error,
    currentPage,
    setPage,
    totalPages,
    handleSetActiveFilter,
    handleSetSearchQuery,
  } = useOurProjectPageData({ itemsPerPage: 12, debounceMs: 500 })

  // Handle navigate to detail
  const handleViewDetail = (id_hash) => {
    navigate(`/projects/${id_hash}`)
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-black text-white overflow-x-hidden">
      <Navbar navItems={navItems} />

      {/* Hero Section */}
      <section className="relative pb-10 md:pb-20">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10 pt-28">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Project</h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            A collection of internal and client-based projects developed by our team. Each project
            is built with robust architecture, high data security, and stable performance.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center w-full pointer-events-none z-0">
          <img
            src={GlowSvg}
            alt="glow"
            className="w-screen h-auto opacity-80 transform scale-150 md:scale-100 origin-bottom -translate-y-12 md:translate-y-8"
          />
        </div>
      </section>

      <StatsSection stats={stats} />

      <FilterSearch
        activeFilter={activeFilter}
        setActiveFilter={handleSetActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
      />

      <ProjectsGrid
        loading={loading}
        error={error}
        filteredProjects={projects}
        onViewDetail={handleViewDetail}
      />

      {!error && totalPages > 1 && (
        <div className={`max-w-5xl mx-auto px-6 pb-12 ${isTransitioning ? 'opacity-75 pointer-events-none transition-opacity duration-300' : ''}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Footer */}
      <section>
        <Footer />
      </section>
    </div>
  )
}
