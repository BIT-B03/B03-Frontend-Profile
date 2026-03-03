import React from 'react'

export default function BusinessSection() {
  return (
    <section className="text-center px-6">
      <div className="max-w-10xl mx-auto">
        {/* eyebrow badge */}
        <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#24E1C9]/30 bg-[#24E1C9]/5 text-[11px] tracking-widest text-[#24E1C9]/90 uppercase font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#24E1C9]/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#24E1C9]" />
          </span>
          Who We Are
        </div>

        {/* heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 sm:whitespace-nowrap">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Business Incubation
          </span>
          <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-[#24E1C9] to-[#1F4C74]">
            Team
          </span>
        </h2>

        {/* description */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          A community of developers, students, and educators working together to explore new
          opportunities for innovation. We believe in the process as much as the product.
        </p>
      </div>
    </section>
  )
}
