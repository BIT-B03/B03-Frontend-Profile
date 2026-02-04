import React from 'react'

export default function HeroSection() {
  return (
    <header className="relative overflow-visible pb-40">
      <div className="relative z-10 pt-64 pb-28">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-7xl md:text-8xl font-extrabold leading-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">Create.</span>
            <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-[#24E1C9] to-[#1F4C74]">Own.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            To grow knowledge and community by bringing library principles to technological frontiers.
          </p>
        </div>
      </div>

      {/* radial spotlight */}
      <div className="absolute inset-0 flex items-start justify-center -z-0 pointer-events-none">
        <div
          className="rounded-full blur-[90px] w-[120vw] h-[90vh] translate-y-12 max-w-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 30% at center, rgba(16,185,129,0.95) 0%, rgba(34,211,238,0.55) 33%, rgba(15,23,42,0.7) 66%, rgba(0,0,0,1) 100%)',
          }}
        />
      </div>
    </header>
  )
}
