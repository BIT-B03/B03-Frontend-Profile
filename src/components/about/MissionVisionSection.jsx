import React from 'react'
import { aboutIconMap } from '../../utils/icon'

export default function MissionVisionSection() {
  return (
    <section className="relative py-6 sm:py-10 md:py-14 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#24E1C9]/30 bg-[#24E1C9]/5 text-[11px] tracking-widest text-[#24E1C9]/90 uppercase font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#24E1C9]/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#24E1C9]" />
          </span>
          Our Core
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-12 sm:mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Mission & Vision
          </span>
        </h2>

        {/* Mission and Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
          {/* Mission Card */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#24E1C9]/20 to-[#1F4C74]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-10 backdrop-blur-xl min-h-auto md:min-h-[270px] md:max-h-[270px]">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#24E1C9]/30 to-[#24E1C9]/10 border border-[#24E1C9]/30">
                    <aboutIconMap.mission className="h-7 w-7 text-[#24E1C9]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                To empower a collaborative community of developers, students, and educators by prioritizing experiential learning and collective exploration, ensuring the process of creation is as impactful as the solutions we build.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1F4C74]/20 to-[#24E1C9]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-10 backdrop-blur-xl min-h-auto md:min-h-[270px] md:max-h-[270px]">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#1F4C74]/30 to-[#1F4C74]/10 border border-[#1F4C74]/30">
                    <aboutIconMap.vision className="h-7 w-7 text-[#1F4C74]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                To invent a better future by continually transforming ideas into impactful new applications through exploring imaginatively, experimenting iteratively, collaborating playfully, and analyzing critically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
