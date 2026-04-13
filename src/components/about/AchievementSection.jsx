import React from 'react'
import { aboutIconMap } from '../../utils/icon'

export default function AchievementSection() {
  const achievements = [
    {
      number: '500+',
      label: 'Active Members',
      icon: aboutIconMap.activeMembers,
    },
    {
      number: '85+',
      label: 'Projects Completed',
      icon: aboutIconMap.projectsCompleted,
    },
    {
      number: '120+',
      label: 'Industry Partners',
      icon: aboutIconMap.industryPartners,
    },
    {
      number: '15',
      label: 'Countries Reached',
      icon: aboutIconMap.countriesReached,
    },
    {
      number: '$2.5M+',
      label: 'Value Created',
      icon: aboutIconMap.valueCreated,
    },
    {
      number: '98%',
      label: 'Member Satisfaction',
      icon: aboutIconMap.memberSatisfaction,
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
                  <achievement.icon className="h-8 w-8" />
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
