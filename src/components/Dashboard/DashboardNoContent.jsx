import React from 'react';

function GlowOrb({ className = '', color = '#24e1c9', size = 'w-64 h-64', opacity = 0.08 }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${size} ${className}`}
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity }}
    />
  );
}

const INSIGHT_CARDS = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 7h18M3 12h18M3 17h18" />
    ),
    title: 'Project',
    desc: 'Pantau jumlah project aktif, selesai, dan yang sedang berjalan.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    title: 'Kontributor',
    desc: 'Lihat progres kontribusi anggota tim dalam setiap sprint.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    title: 'Aktivitas Terkini',
    desc: 'Rekap project terbaru yang sedang dalam pengerjaan.',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    title: 'Keseluruhan',
    desc: 'Gambaran umum progres semua metrik dalam satu ringkasan.',
  },
];

function InsightCard({ icon, title, desc }) {
  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(36,225,201,0.08)',
      }}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(36,225,201,0.2), transparent)' }}
      />
      <div
        className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(36,225,201,0.1) 0%, rgba(31,76,116,0.18) 100%)',
          border: '1px solid rgba(36,225,201,0.15)',
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ color: 'rgba(36,225,201,0.7)' }}>
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(156,163,175,0.7)' }}>{desc}</p>
      </div>
    </div>
  );
}

export default function DashboardNoContent() {
  return (
    <div className="relative w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">
      {/* Ambient glow orbs */}
      <GlowOrb className="top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" size="w-96 h-96" opacity={0.07} />
      <GlowOrb className="top-1/3 right-1/4 translate-x-1/2 -translate-y-1/3" color="#1f4c74" size="w-80 h-80" opacity={0.12} />
      <GlowOrb className="bottom-1/4 left-1/2 -translate-x-1/2" size="w-72 h-72" opacity={0.05} />

      {/* Center hero message */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 px-6">
        {/* Icon container with glow */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30 scale-150"
            style={{ background: 'radial-gradient(circle, #24e1c9 0%, transparent 70%)' }}
          />
          <div
            className="relative w-20 h-20 rounded-2xl grid place-items-center"
            style={{
              background: 'linear-gradient(135deg, rgba(36,225,201,0.12) 0%, rgba(31,76,116,0.2) 100%)',
              border: '1px solid rgba(36,225,201,0.2)',
              boxShadow: '0 0 32px rgba(36,225,201,0.1)',
            }}
          >
            <svg
              className="w-9 h-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'rgba(36,225,201,0.7)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <h3
          className="text-xl font-bold mb-2"
          style={{ color: '#fff' }}
        >
          Belum ada Statistik
        </h3>
        <p
          className="text-sm max-w-xs leading-relaxed"
          style={{ color: 'rgba(156,163,175,0.8)' }}
        >
          Data statistik untuk akun ini masih kosong. Statistik akan muncul setelah ada aktivitas tercatat.
        </p>

        {/* thin accent line */}
        <div
          className="mt-8 w-32 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(36,225,201,0.4), transparent)' }}
        />
      </div>

      {/* Insight cards — fills space, responsive */}
      <div className="relative z-10 pb-8">
        <p
          className="text-[10px] mb-4 tracking-widest uppercase"
          style={{ color: 'rgba(36,225,201,0.35)' }}
        >
          Yang akan tersedia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {INSIGHT_CARDS.map((card) => (
            <InsightCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
