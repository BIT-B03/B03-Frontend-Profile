import React from 'react'
import { ourProjectIconMap } from '../../utils/icon'

const cards = [
  {
    label: 'TOTAL PROJECT',
    key: 'total',
    icon: ourProjectIconMap.totalProjects,
    accentColor: '#979797',
    glowColor: 'rgba(151,151,151,0.20)',
    borderColor: 'rgba(151,151,151,0.25)',
    iconBg: 'rgba(151,151,151,0.10)',
    numberColor: '#B0B0B0',
  },
  {
    label: 'ON PROGRESS',
    key: 'progress',
    icon: ourProjectIconMap.inProgress,
    accentColor: '#980000',
    glowColor: 'rgba(152,0,0,0.30)',
    borderColor: 'rgba(152,0,0,0.30)',
    iconBg: 'rgba(152,0,0,0.15)',
    numberColor: '#DC2626',
  },
  {
    label: 'COMPLETED',
    key: 'complete',
    icon: ourProjectIconMap.completed,
    accentColor: '#22A5A7',
    glowColor: 'rgba(34,165,167,0.30)',
    borderColor: 'rgba(34,165,167,0.25)',
    iconBg: 'rgba(34,165,167,0.12)',
    numberColor: '#22A5A7',
  },
]

export default function StatsSection({ stats = { total: 0, progress: 0, complete: 0 } }) {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-12 relative z-10 -mt-20 md:-mt-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(({ label, key, icon: Icon, accentColor, glowColor, borderColor, iconBg, numberColor }) => (
          <div
            key={key}
            className="group relative rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default border border-white/10 ring-1 ring-white/10"
            style={{
              background: `radial-gradient(ellipse 120% 60% at 50% 120%, ${accentColor}55 0%, transparent 70%), rgba(8,10,15,0.92)`,
              boxShadow: `0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 32px ${glowColor}, 0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`
              e.currentTarget.style.borderColor = accentColor + '60'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`
              e.currentTarget.style.borderColor = borderColor
            }}
          >
            {/* Glassmorphism noise overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
              aria-hidden
            />

            {/* Subtle top-edge highlight */}
            <span
              className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)` }}
              aria-hidden
            />

            {/* bottom accent glow */}
            <span
              className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-50 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              aria-hidden
            />

            <div className="flex items-center gap-4 relative z-[1]">
              {/* icon box */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: iconBg,
                  border: `1px solid ${accentColor}30`,
                  boxShadow: `0 0 18px ${glowColor}`,
                }}
              >
                <Icon className="w-7 h-7" style={{ color: numberColor }} aria-hidden />
              </div>

              {/* label + number */}
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-200 leading-tight">
                  {label.charAt(0) + label.slice(1).toLowerCase()}
                </p>
                <p
                  className="text-4xl md:text-5xl font-extrabold tabular-nums leading-none"
                  style={{ color: numberColor }}
                >
                  {stats[key]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}