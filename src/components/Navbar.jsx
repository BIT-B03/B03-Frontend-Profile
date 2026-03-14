import React, { useState, useEffect } from 'react'
import Logo from '../assets/git-lab-svgrepo-com.svg'
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
                  href="/register"
                  onClick={(e) => { e.preventDefault(); navigate('/register') }}
                  className="inline-flex items-center justify-center text-xs sm:text-sm px-2 py-1 rounded-md md:px-3 md:py-1.5 transition-all duration-200 border border-transparent hover:bg-[rgba(34,165,167,0.45)] hover:border-[#22A5A7] hover:text-pure-white"
                >
                  Sign in
                </a>

                <button
                  onClick={(e) => { e.preventDefault(); navigate('/login') }}
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
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={[
                      'block py-2 px-2 rounded transition-all duration-300 border border-transparent',
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
          </div>
        )}
      </nav>
    </header>
  )
}
