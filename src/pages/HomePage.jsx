import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import BusinessSection from '../components/homepage/BusinessSection'
import WhyChooseUs from '../components/homepage/WhyChooseUs'
import Footer from '../components/homepage/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-black text-white pt-3">
      <Navbar />
      <HeroSection />
      
      <main className="max-w-5xl mx-auto px-6">
        <BusinessSection />
        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  )
}
