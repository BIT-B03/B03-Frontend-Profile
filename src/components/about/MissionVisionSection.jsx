import React from 'react'

export default function MissionVisionSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-6">
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
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#24E1C9]/30 to-[#24E1C9]/10 border border-[#24E1C9]/30">
                    <svg className="h-7 w-7 text-[#24E1C9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                To empower the community by fostering innovation, collaboration, and knowledge sharing. We create spaces where ideas transform into impactful projects that drive positive change in technology and society.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1F4C74]/20 to-[#24E1C9]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#1F4C74]/30 to-[#1F4C74]/10 border border-[#1F4C74]/30">
                    <svg className="h-7 w-7 text-[#1F4C74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                To become a leading hub of innovation where brilliant minds converge to build the future. We envision a world where technology and community thrive together, creating unlimited possibilities for growth and impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
