import React from 'react'
import { aboutIconMap } from '../../utils/icon'

export default function TeamValuesSection() {
  const values = [
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork. Every member brings unique skills and perspectives that create something greater together.',
      icon: aboutIconMap.collaboration,
    },
    {
      title: 'Innovation',
      description: 'We push boundaries and explore new possibilities. Innovation is at the heart of everything we do, from projects to processes.',
      icon: aboutIconMap.innovation,
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty. Trust is the foundation of our community and every interaction we build.',
      icon: aboutIconMap.integrity,
    },
    {
      title: 'Growth',
      description: 'We embrace continuous learning and development. Every challenge is an opportunity to grow stronger and wiser.',
      icon: aboutIconMap.growth,
    }
  ]

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#24E1C9]/30 bg-[#24E1C9]/5 text-[11px] tracking-widest text-[#24E1C9]/90 uppercase font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#24E1C9]/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#24E1C9]" />
          </span>
          Guiding Principles
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Our Values
          </span>
        </h2>
        
        <p className="text-slate-400 text-lg max-w-2xl mb-12 sm:mb-16">
          These principles guide every decision we make and shape our culture
        </p>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((value, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#24E1C9]/10 to-[#1F4C74]/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-[#24E1C9]/20 to-[#1F4C74]/20 border border-[#24E1C9]/30">
                      <value.icon className="h-6 w-6 text-[#24E1C9]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{value.title}</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
