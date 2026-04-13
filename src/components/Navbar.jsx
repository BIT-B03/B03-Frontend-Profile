import React, { useState, useEffect } from 'react'
import Logo from '../assets/bitlogo.png'
import { useNavigate } from 'react-router-dom'

export default function Navbar({
  navItems = [
    { label: 'Home', href: '#' },
    { label: 'Project', href: '#' },
    { label: 'People', href: '#' }
  ],
  showNavItems = true,
  brandText = '',
  rightCtaText = '',
  rightCtaHref = '/login',
  rightCtaLinkText = 'Log in',
}) {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''))

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  const handleNavClick = (e, href) => {
    e.preventDefault()

    // direct route links like "/people"
    if (href.startsWith('/')) {
      navigate(href)
      setOpen(false)
      return
    }

    // anchor on the same page
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
      return
    }

    // fallback: map some hashes to routes when not on homepage
    if (href === '#people') {
      navigate('/people')
      setOpen(false)
      return
    }
    if (href === '#home') {
      navigate('/')
      setOpen(false)
      return
    }
    if (href === '#about') {
      navigate('/about')
      setOpen(false)
      return
    }

    // default fallback navigate to home
    navigate('/')
    setOpen(false)
  }

  const hasNavItems = showNavItems && navItems.length > 0

  return (
    <header className="fixed top-2 sm:top-3 z-50 w-full">
      <nav className="bg-[rgba(8,10,15,0.75)] backdrop-blur-md text-white px-3 py-2 sm:px-4 md:px-6 md:py-3 rounded-xl shadow-lg mx-2 sm:mx-3 border border-white/10 ring-1 ring-white/10">
        <div className="w-full flex flex-wrap items-center gap-3 sm:gap-4 pl-2 sm:pl-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Go to home"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 transition cursor-pointer"
            >
              <img src={Logo} alt="BIT-B03 logo" className="w-8 h-8" />
            </button>
            {brandText && (
              <span className="text-xs sm:text-sm md:text-base font-semibold text-pure-white truncate max-w-[110px] sm:max-w-[180px]">
                {brandText}
              </span>
            )}
          </div>

          {hasNavItems && (
            <ul className="hidden md:flex space-x-4 text-sm font-medium">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={[
                      'px-3 py-1.5 rounded-lg transition-all duration-300 border border-transparent',
                      activeSection === item.href.replace('#', '')
                        ? 'bg-brand-getstarted text-pure-white font-bold'
                        : 'hover:bg-[rgba(34,165,167,0.45)] hover:border-[#22A5A7] hover:text-pure-white',
                    ].join(' ')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          

          <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap justify-end">
            {rightCtaText ? (
              <span className="inline-flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-1 text-xs sm:text-sm md:text-base text-pure-white/90 leading-tight text-right">
                <span className="whitespace-normal">{rightCtaText}</span>
                <a
                  href={rightCtaHref}
                  onClick={(e) => { e.preventDefault(); navigate(rightCtaHref) }}
                  className="text-brand-24e1c9 hover:underline whitespace-nowrap"
                >
                  {rightCtaLinkText}
                </a>
              </span>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={(e) => { e.preventDefault(); navigate('/login') }}
                  className="hidden md:inline-flex items-center justify-center text-xs sm:text-sm px-2 py-1 rounded-md md:px-3 md:py-1.5 transition-all duration-200 border border-transparent hover:bg-[rgba(34,165,167,0.45)] hover:border-[#22A5A7] hover:text-pure-white"
                >
                  Sign in
                </a>

                <button
                  onClick={(e) => { e.preventDefault(); navigate('/register') }}
                  className="bg-brand-getstarted text-pure-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90 font-bold text-xs sm:text-sm relative overflow-hidden btn-flash"
                >
                  <span className="relative z-10">Get Started</span>
                </button>
              </>
            )}

            {hasNavItems && (
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
            )}
          </div>
        </div>
        

        {hasNavItems && open && (
          <div className="md:hidden mt-3 px-4 pb-4">
            <ul className="flex flex-col gap-3 text-sm font-medium">
              {navItems.map((item, idx) => {
                const iconMap = {
                  'Home': (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  ),
                  'About': (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">i</text>
                    </svg>
                  ),
                  'Contact': (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  'People': (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                  'Project': (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18"/>
                      <path d="M9 3v18"/>
                    </svg>
                  ),
                }
                return (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={[
                        'flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-300 border border-transparent',
                        activeSection === item.href.replace('#', '')
                          ? 'bg-brand-getstarted text-pure-white font-bold'
                          : 'hover:bg-[rgba(34,165,167,0.2)] hover:border-[#22A5A7] hover:text-pure-white text-pure-white/80',
                      ].join(' ')}
                    >
                      <span className="text-white/70 group-hover:text-white">{iconMap[item.label] || null}</span>
                      {item.label}
                    </a>
                  </li>
                )
              })}
              {!rightCtaText && (
                <li className="mt-2 pt-2 border-t border-white/10">
                  <a
                    href="/login"
                    onClick={(e) => { e.preventDefault(); navigate('/login'); setOpen(false) }}
                    className="flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-300 border-2 border-[#22A5A7] bg-[rgba(34,165,167,0.15)] hover:bg-[rgba(34,165,167,0.35)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(34,165,167,0.4)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-brand-24e1c9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-brand-24e1c9 font-semibold">Sign in</span>
                        <span className="text-xs text-brand-24e1c9/70">Access your account</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-brand-24e1c9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}