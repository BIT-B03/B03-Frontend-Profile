import React from 'react'

export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="bg-[#040409] border border-white/6 rounded-2xl p-5 flex flex-col relative min-h-[180px]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-transparent border border-white/10 flex items-center justify-center flex-shrink-0">
          <img src={icon} alt={title} className="w-7 h-7" />
        </div>
      </div>
      
      <div className="flex-1 pr-14">
        <h4 className="font-semibold text-white text-base mb-2">{title}</h4>
        <p className="text-xs text-slate-300/80 leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  )
}
