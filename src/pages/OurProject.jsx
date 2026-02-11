import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/homepage/Footer'
import GlowSvg from '../assets/glow.svg'
import StatsSection from '../components/ourproject/StatsSection'
import FilterSearch from '../components/ourproject/FilterSearch'
import ProjectsGrid from '../components/ourproject/ProjectsGrid'
import axios from 'axios'

export default function OurProject() {
  const navigate = useNavigate()
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
    { label: 'People', href: '/people' },
    { label: 'Project', href: '#project' }
  ]

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  // default to public project blueprint prefix used by Flask
  const [apiBase, setApiBase] = useState('/api/projectPublic')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch projects dari backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)

        // try with /api prefix first (common when backend mounted at /api)
        let response = null
        let lastError = null
        try {
          // try the public blueprint path registered as '/api/projectPublic'
          response = await axios.get('/api/projectPublic/projects')
          setApiBase('/api/projectPublic')
        } catch (err) {
          lastError = err
          console.warn('/api/projectPublic/projects failed:', err?.response?.status, err?.message)
          try {
            // fallback to direct backend absolute URL if proxy not working
            response = await axios.get('http://127.0.0.1:5000/api/projectPublic/projects')
            setApiBase('http://127.0.0.1:5000/api/projectPublic')
          } catch (err2) {
            // both attempts failed - log details and throw to outer catch
            console.error('/projects fallback failed:', err2?.response?.status, err2?.message)
            // enhance error with both responses for debugging
            const status1 = lastError?.response?.status
            const data1 = lastError?.response?.data
            const status2 = err2?.response?.status
            const data2 = err2?.response?.data
            console.error('API attempts results:', { '/api/projects': { status: status1, data: data1 }, '/projects': { status: status2, data: data2 } })
            throw err2
          }
        }

        // backend may return { count, data: [ ... ], message } or an array directly
        console.log('projects response', response.data)
        const rawItems = (response.data && response.data.data) ? response.data.data : response.data
        const items = Array.isArray(rawItems) ? rawItems : []

        if (!Array.isArray(rawItems)) {
          console.error('Unexpected projects payload, expected array but got:', rawItems)
        }

        // normalize to shape used by UI
        const mapped = items.map((p, idx) => {
          const raw = String(p.status || '').toLowerCase()
          let normalizedStatus = p.status || ''
          if (raw === 'on_progress' || raw === 'in_progress' || raw.includes('progress')) {
            normalizedStatus = 'In Progress'
          } else if (raw === 'complete' || raw === 'completed' || raw.includes('complete')) {
            normalizedStatus = 'Complete'
          }

          return {
            id: p.id || idx,
            id_hash: p.hashed_id || p.id_hash || '',
            title: p.title || p.name || 'Untitled',
            description: p.short_description || p.description || '',
            status: normalizedStatus,
            thumbnail_url: p.thumbnail || p.thumbnail_url || '',
            // Sertakan creator dari backend jika ada
            creator: p.creator || null,
            // Hitung total anggota: creator + contributors (hindari duplikat)
            contributors: Array.isArray(p.contributors) ? p.contributors : [],
            team_members: (Array.isArray(p.contributors) ? p.contributors.length : 0) + (p.creator ? 1 : 0),
            apiBase: apiBase,
          }
        })

        setProjects(mapped)
        setFilteredProjects(mapped)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Gagal memuat data proyek')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Handle filter dan search
  useEffect(() => {
    let filtered = projects

    // Apply filter by status
    if (activeFilter === 'progress') {
      filtered = filtered.filter(p => String(p.status || '').toLowerCase().includes('progress'))
    } else if (activeFilter === 'complete') {
      filtered = filtered.filter(p => String(p.status || '').toLowerCase().includes('complete'))
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProjects(filtered)
  }, [activeFilter, searchQuery, projects])

  // Hitung statistik
  const stats = {
    total: projects.length,
    progress: projects.filter(p => String(p.status || '').toLowerCase().includes('progress')).length,
    complete: projects.filter(p => String(p.status || '').toLowerCase().includes('complete')).length
  }

  // Helper function untuk get status style
  const getStatusStyles = (status) => {
    if (status === 'In Progress') {
      return 'bg-red-500'
    }
    return 'bg-green-500'
  }

  // Handle navigate to detail
  const handleViewDetail = (id_hash) => {
    navigate(`/projects/${id_hash}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-black text-white">
      <Navbar navItems={navItems} />

      {/* Hero Section */}
      <section className="relative pb-0 md:pb-40">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10 pt-28">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Project</h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            A collection of internal and client-based projects developed by our team. Each project
            is built with robust architecture, high data security, and stable performance.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center w-full pointer-events-none overflow-hidden">
          <img
            src={GlowSvg}
            alt="glow"
            className="w-screen h-auto opacity-80 transform scale-150 md:scale-100 origin-bottom translate-y-8 md:translate-y-0"
          />
        </div>
      </section>

      <StatsSection stats={stats} />

      <FilterSearch
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ProjectsGrid
        loading={loading}
        error={error}
        filteredProjects={filteredProjects}
        onViewDetail={handleViewDetail}
      />

      {/* Footer */}
      <section>
        <Footer />
      </section>
    </div>
  )
}
