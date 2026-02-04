import React from 'react'
import twitterImg from '../../assets/twitter.png'
import facebookImg from '../../assets/facebook.png'
import linkedinImg from '../../assets/linkedin.png'

const socialLinks = [
  { icon: twitterImg, alt: 'Twitter' },
  { icon: facebookImg, alt: 'Facebook' },
  { icon: linkedinImg, alt: 'LinkedIn' }
]

export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 border-t border-white/6 pt-8 pb-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-sm text-slate-400">
        <div className="text-center md:text-left">
          <div className="leading-relaxed">phone: +62 0812 3456 7890</div>
          <div className="leading-relaxed break-all sm:break-normal">businessincubationteam@gmail.com</div>
        </div>

        <div className="text-center order-last md:order-none">
          <div>Copyright 2025 @BIT-BO3</div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {socialLinks.map((social, index) => (
            <button
              key={index}
              type="button"
              aria-label={social.alt}
              className="w-9 h-9 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-white/5 transition"
            >
              <img src={social.icon} alt={social.alt} className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
