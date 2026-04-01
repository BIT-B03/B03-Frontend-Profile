import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import BusinessSection from '../components/homepage/BusinessSection'
import WhyChooseUs from '../components/homepage/WhyChooseUs'
import Footer from '../components/homepage/Footer'

export default function HomePage() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'People', href: '/people' },
    { label: 'Project', href: '/project' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-black text-white">
      <Navbar navItems={navItems} />
      <section>
        <HeroSection />
      </section>
      
      <main className="max-w-5xl mx-auto px-6">
        <section>
          <BusinessSection />
        </section>
        <section>
          <WhyChooseUs />
        </section>
      </main>

      <section>
        <Footer />
      </section>
    </div>
  )
}
