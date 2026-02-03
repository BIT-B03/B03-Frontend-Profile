import React, { useState } from 'react'
import Logo from '../assets/git-lab-svgrepo-com.svg'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full mt-4">
      <nav className="bg-[rgba(8,10,15,0.9)] backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg mx-3 border border-white/10 ring-1 ring-white/10">
        <div className="w-full flex items-center gap-4 pl-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full">
              <img src={Logo} alt="BIT-BO03 logo" className="w-8 h-8" />
            </div>
          </div>

          <ul className="hidden md:flex space-x-4 text-sm font-medium">
            <li><a href="/" className="hover:opacity-90">Home</a></li>
            <li><a href="#" className="hover:opacity-90">Project</a></li>
            <li><a href="/people" className="hover:opacity-90">People</a></li>
          </ul>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Sign in - same shape as desktop, slightly compact on mobile */}
            <a
              href="#"
              className="inline-flex items-center justify-center text-sm opacity-90 hover:opacity-100 px-2 py-1 rounded-md md:px-3 md:py-1.5"
            >
              Sign in
            </a>

            {/* Get Started - same shape as desktop, slightly compact on mobile */}
            <button className="bg-brand-getstarted text-pure-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90 font-bold text-sm relative overflow-hidden btn-flash">
              <span className="relative z-10">Get Started</span>
            </button>

            {/* mobile hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800/50 hover:bg-slate-800/60 transition"
            >
              <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <path d="M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 12h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 17h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="md:hidden mt-3 px-4 pb-4">
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="#" className="block py-2 px-2 rounded hover:bg-white/5">Home</a></li>
              <li><a href="#" className="block py-2 px-2 rounded hover:bg-white/5">Project</a></li>
              <li><a href="#" className="block py-2 px-2 rounded hover:bg-white/5">People</a></li>
            </ul>

            {/* removed duplicated buttons from dropdown so buttons remain in navbar */}
          </div>
        )}
      </nav>
    </header>
  )
}
