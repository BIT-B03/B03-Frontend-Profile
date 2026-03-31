import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinUsSection() {
  const navigate = useNavigate()

  const handleJoinClick = (e) => {
    e.preventDefault()
    navigate('/register')
  }

  const handleLearnClick = (e) => {
    e.preventDefault()
    navigate('/people')
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at center, rgba(36, 225, 201, 0.5) 0%, rgba(31, 76, 116, 0.3) 100%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#24E1C9]/30 bg-[#24E1C9]/5 text-[11px] tracking-widest text-[#24E1C9]/90 uppercase font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#24E1C9]/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#24E1C9]" />
          </span>
          Be Part of Us
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Ready to Make an
          </span>
          <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-[#24E1C9] to-[#1F4C74]">
            Impact?
          </span>
        </h2>
        
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed">
          Join our vibrant community of innovators, creators, and change-makers. Whether you're looking to learn, build, or lead—there's a place for you here. Let's create something extraordinary together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleJoinClick}
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#22979F] to-[#205D7E] text-white font-bold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[#24E1C9]/20 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          <button
            onClick={handleLearnClick}
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#24E1C9] text-[#24E1C9] font-bold rounded-lg transition-all duration-200 hover:bg-[#24E1C9]/10 hover:shadow-lg hover:shadow-[#24E1C9]/20 group"
          >
            <span className="flex items-center gap-2">
              Meet Our Community
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Highlight cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🚀',
              title: 'Accelerated Growth',
              desc: 'Mentorship and resources to fast-track your success'
            },
            {
              icon: '🤝',
              title: 'Strong Network',
              desc: 'Connect with peers, mentors, and industry leaders'
            },
            {
              icon: '🌟',
              title: 'Opportunities',
              desc: 'Access to exclusive projects, funding, and partnerships'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 sm:p-6 backdrop-blur-xl text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
