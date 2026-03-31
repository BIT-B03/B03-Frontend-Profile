import React from 'react'
import Navbar from '../components/Navbar'
import AboutHeroSection from '../components/about/AboutHeroSection'
import MissionVisionSection from '../components/about/MissionVisionSection'
import TeamValuesSection from '../components/about/TeamValuesSection'
import Footer from '../components/homepage/Footer'

export default function AboutPage() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '#contact' },
    { label: 'People', href: '/people' },
    { label: 'Project', href: '/project' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-black text-white">
      <Navbar navItems={navItems} />
      
      <section>
        <AboutHeroSection />
      </section>

      <main className="max-w-5xl mx-auto px-6">
        <section>
          <MissionVisionSection />
        </section>

        <section>
          <TeamValuesSection />
        </section>
      </main>

      <section>
        <Footer />
      </section>
    </div>
  )
}
