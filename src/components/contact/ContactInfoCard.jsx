import React from 'react';

export default function ContactInfoCard({ icon, title, lines, meta }) {
    return (
        <div className="rounded-xl p-6 sm:p-6 bg-[rgba(255,255,255,0.02)] border border-filter-sage-border/10 backdrop-blur-[6px] group hover:border-filter-sage-border/40 hover:shadow-[0_6px_20px_rgba(34,165,167,0.08)] transition-colors duration-200">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(25,123,125,0.25)] border border-[rgba(34,165,167,0.12)] text-brand-24e1c9/90 transition-colors duration-200 group-hover:border-filter-sage-border/40">
                    {icon}
                </div>
                <div className="space-y-1">
                    <p className="text-xs pt-0.5 font-semibold uppercase tracking-[0.2em] text-muted-gray">{title}</p>
                    <div className="text-sm sm:text-base text-pure-white font-normal">
                        {lines.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                    {meta && <p className="text-xs sm:text-sm text-muted-gray">{meta}</p>}
                </div>
            </div>
        </div>
    );
}
