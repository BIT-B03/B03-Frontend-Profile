import React from 'react'

export default function TimelineSection() {
  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started with a vision to build a community of innovators and creative minds. Our first members gathered around a shared passion for technology and learning.'
    },
    {
      year: '2021',
      title: 'Expanding Network',
      description: 'Grew to 100+ active members. Launched our first major projects and established partnerships with industry leaders to mentor our community.'
    },
    {
      year: '2022',
      title: 'Achieving Impact',
      description: 'Completed 20+ successful projects. Transitioned from learning hub to innovation incubator, helping members turn ideas into reality.'
    },
    {
      year: '2023',
      title: 'Going Global',
      description: 'Expanded internationally with collaborations across continents. Established mentorship programs with Fortune 500 companies and leading startups.'
    },
    {
      year: '2024',
      title: 'Next Frontier',
      description: 'Focusing on AI integration, blockchain innovation, and emerging technologies. Building the next generation of tech leaders and innovators.'
    },
    {
      year: '2025',
      title: 'New Horizons',
      description: 'Launching advanced incubation programs, establishing innovation labs, and creating pathways for members to scale their impact globally.'
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
          Our Journey
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Milestone Timeline
          </span>
        </h2>
        
        <p className="text-slate-400 text-lg max-w-2xl mb-12 sm:mb-16">
          From humble beginnings to becoming a beacon of innovation and collaboration
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#24E1C9]/40 via-[#24E1C9]/20 to-transparent" />

          {/* Timeline items */}
          <div className="space-y-12 sm:space-y-16">
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`relative flex gap-6 sm:gap-0 ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="flex flex-col items-center">
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-9 h-9 rounded-full border-2 border-[#24E1C9] bg-dark-bg flex items-center justify-center z-10">
                    <div className="w-3 h-3 rounded-full bg-[#24E1C9] animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pl-4 sm:pl-0 ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                  <div className="group relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#24E1C9]/5 to-[#1F4C74]/5 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                    <div className="relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#24E1C9]/10 border border-[#24E1C9]/30 text-sm font-bold text-[#24E1C9] mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
