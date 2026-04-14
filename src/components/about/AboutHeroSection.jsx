import React from 'react'

export default function AboutHeroSection() {
  return (
    <header className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 md:min-h-[70vh] md:flex md:items-center md:justify-center">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-brand-vignette opacity-80" />

        {/* Gradient blob */}
        <div className="absolute inset-0 flex items-start justify-center">
          <div
            className="rounded-full blur-[90px] w-[120vw] h-[70vh] translate-y-0 max-w-none opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at center, rgba(36, 225, 201, 0.8) 0%, rgba(31, 76, 116, 0.4) 40%, rgba(15, 23, 42, 0.6) 70%, rgba(0,0,0,1) 100%)',
            }}
          />
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.30) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.30) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 70%)',
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center px-6">
          <span className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#24E1C9]/40 bg-[#24E1C9]/10 text-[12px] tracking-widest text-[#24E1C9] uppercase font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#24E1C9]/60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#24E1C9]" />
            </span>
            About BIT-B03
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6 sm:mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-300">
              Empowering
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#24E1C9] to-[#357cbb]">
              Innovation
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
           We are a community where people connect, share and build together, with a focus on making ideas useful and impactful. By working together and thinking creatively.
          </p>
        </div>
      </div>
    </header>
  )
}
