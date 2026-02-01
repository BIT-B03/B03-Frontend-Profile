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
    <footer className="mt-20 border-t border-white/6 pt-8 pb-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
        <div className="mb-4 md:mb-0">
          <div>phone: +62 0812 3456 7890</div>
          <div>businessincubationteam@gmail.com</div>
        </div>

        <div className="text-center">
          <div>Copyright 2025 @BIT-BO3</div>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {socialLinks.map((social, index) => (
            <button
              key={index}
              className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center"
            >
              <img src={social.icon} alt={social.alt} className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
