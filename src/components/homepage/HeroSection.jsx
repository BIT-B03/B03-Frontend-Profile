import React from 'react'

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24 sm:min-h-[100svh] sm:flex sm:items-center sm:justify-center">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-brand-vignette opacity-80" />

        <div className="absolute inset-0 flex items-start justify-center">
          <div
            className="rounded-full blur-[90px] w-[120vw] h-[90vh] translate-y-10 max-w-none opacity-90"
            style={{
              background:
                'radial-gradient(ellipse 60% 30% at center, rgba(16,185,129,0.95) 0%, rgba(34,211,238,0.55) 33%, rgba(15,23,42,0.72) 66%, rgba(0,0,0,1) 100%)',
            }}
          />
        </div>

        {/* subtle tech grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.30) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.30) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 55% 45% at 50% 38%, black 0%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 50% 38%, black 0%, transparent 72%)',
          }}
        />

        {/* orbits */}
        <div className="absolute left-1/2 top-[54%] sm:top-[52%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[340px] h-[340px] min-[420px]:w-[420px] min-[420px]:h-[420px] sm:w-[560px] sm:h-[560px] lg:w-[640px] lg:h-[640px]">
            <div className="absolute inset-0 rounded-full border border-white/8 opacity-40 animate-[spin_55s_linear_infinite]" />
            <div className="absolute inset-[13%] rounded-full border border-white/10 opacity-35 animate-[spin_35s_linear_infinite]" />
            <div className="absolute inset-[27%] rounded-full border border-white/12 opacity-30 animate-[spin_24s_linear_infinite]" />

            {/* nodes */}
            <div className="absolute left-[8%] top-[28%] w-2 h-2 rounded-full bg-emerald-300/80 shadow-[0_0_24px_rgba(16,185,129,0.65)]" />
            <div className="absolute right-[11%] top-[45%] w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_24px_rgba(34,211,238,0.55)]" />
            <div className="absolute left-[42%] bottom-[10%] w-2 h-2 rounded-full bg-sky-300/70 shadow-[0_0_26px_rgba(56,189,248,0.45)]" />
          </div>
        </div>

        {/* ambient blobs */}
        <div className="absolute -left-32 top-12 sm:top-24 w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full bg-emerald-400/12 blur-3xl animate-float-soft" />
        <div className="absolute -right-40 top-24 sm:top-44 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-cyan-400/10 blur-3xl animate-float-soft [animation-delay:900ms]" />

        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.95] mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">Create.</span>
            <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-[#24E1C9] to-[#1F4C74]">Own.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            To grow knowledge and community by bringing library principles to technological frontiers.
          </p>

          {/* tech pills (still centered) */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {['Open Knowledge', 'Community-Driven', 'Digital Archives', 'Future-Ready Systems'].map((label) => (
              <span
                key={label}
                className="glass-sm rounded-full px-3.5 py-1.5 text-xs text-slate-100/90 border-white/10"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* glass terminal card */}
        <div className="mt-8 sm:mt-12 px-6">
          <div className="max-w-3xl mx-auto glass rounded-2xl border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/70" />
                <span className="ml-2 text-[10px] sm:text-[11px] tracking-widest text-slate-200/70">LIBRARY TECH CONSOLE</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-200/70">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300/40 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300/80" />
                  </span>
                  ONLINE
                </span>
              </div>
            </div>

            <div className="relative rounded-xl bg-black/35 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)', backgroundSize: '100% 22px' }} />
              <div className="absolute -inset-x-10 top-0 h-10 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-scanline" />
              <pre className="relative p-4 sm:p-5 text-[12px] sm:text-[13px] leading-relaxed text-slate-100/80 font-mono whitespace-pre-wrap">
{`> init knowledge-graph --mode=community
✔ indexing collections…
✔ connecting people ↔ projects ↔ ideas
✔ publishing insights to the frontier

status: ready`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
