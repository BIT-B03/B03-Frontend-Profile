import React from 'react'

export default function AchievementSection() {
  const achievements = [
    {
      number: '500+',
      label: 'Active Members',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.657" />
        </svg>
      )
    },
    {
      number: '85+',
      label: 'Projects Completed',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      number: '120+',
      label: 'Industry Partners',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9.114m5.305 0a8.1 8.1 0 002.052-5.396" />
        </svg>
      )
    },
    {
      number: '15',
      label: 'Countries Reached',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h.01" />
        </svg>
      )
    },
    {
      number: '$2.5M+',
      label: 'Value Created',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '98%',
      label: 'Member Satisfaction',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
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
          By The Numbers
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Our Achievements
          </span>
        </h2>
        
        <p className="text-slate-400 text-lg max-w-2xl mb-12 sm:mb-16">
          Measurable impact through persistence, innovation, and dedication to our community
        </p>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#24E1C9]/10 to-[#1F4C74]/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 backdrop-blur-xl text-center h-full flex flex-col items-center justify-center">
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-[#24E1C9]/20 to-[#1F4C74]/20 border border-[#24E1C9]/30 text-[#24E1C9]">
                  {achievement.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-2">
                  {achievement.number}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {achievement.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
