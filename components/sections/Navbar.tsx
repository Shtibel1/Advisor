'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MenuIcon, XIcon } from '@/components/ui/Icons'
import { ChevronDown } from 'lucide-react'

const NAV_SECTIONS = [
  { id: 'pain-points', label: 'האתגרים'  },
  { id: 'services',   label: 'שירותים'  },
  { id: 'about',      label: 'אודות'    },
  { id: 'contact',    label: 'צור קשר'  },
]

type Demo = {
  label: string
  color: string
  ping: string
  border: string
  hover: string
} & ({ href: string; action?: never } | { action: () => void; href?: never })

const DEMOS: Demo[] = [
  {
    href: '/demos/rag',
    label: 'סוכן ידע ארגוני',
    color: 'text-cyan-400',
    ping: 'bg-cyan-400',
    border: 'border-cyan-500/30',
    hover: 'hover:bg-cyan-400/10',
  },
  {
    action: () => {
      // @ts-expect-error voiceflow is injected by external script
      window.voiceflow?.chat?.open()
    },
    label: "צ'אט-בוט חכם",
    color: 'text-blue-400',
    ping: 'bg-blue-400',
    border: 'border-blue-500/30',
    hover: 'hover:bg-blue-400/10',
  },
  {
    href: '/demos/whatsapp',
    label: 'צ׳אט-בוט WhatsApp',
    color: 'text-[#25D366]',
    ping: 'bg-[#25D366]',
    border: 'border-[#25D366]/30',
    hover: 'hover:bg-[#25D366]/10',
  },
  {
    href: '/demos/finance',
    label: 'דוחות פיננסיים',
    color: 'text-violet-400',
    ping: 'bg-violet-400',
    border: 'border-violet-500/30',
    hover: 'hover:bg-violet-400/10',
  },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const start = window.scrollY
  const target = el.getBoundingClientRect().top + window.scrollY - 64
  const distance = target - start
  const duration = 600
  let startTime: number | null = null
  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    window.scrollTo(0, start + distance * ease)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false)
  const [demoOpen, setDemoOpen]     = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const demoRef = useRef<HTMLDivElement>(null)

  // Close demo dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleLink = (id: string) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  const linkClass = (id: string) =>
    `font-medium transition-all duration-200 relative after:absolute after:bottom-[-4px] after:right-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-200 ${
      activeSection === id
        ? 'text-cyan-400 after:w-full'
        : 'text-gray-300 hover:text-cyan-400 after:w-0 hover:after:w-full'
    }`

  const mobileLinkClass = (id: string) =>
    `py-2 font-medium border-b border-blue-900/30 transition-colors text-right ${
      activeSection === id ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
    }`

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">Nadav</span>
            <span className="text-2xl font-bold text-cyan-400">AI</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button key={id} onClick={() => handleLink(id)} className={linkClass(id)}>
                {label}
              </button>
            ))}

            {/* Demos dropdown */}
            <div className="relative" ref={demoRef}>
              <button
                onClick={() => setDemoOpen(!demoOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                דמואים חיים
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${demoOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {demoOpen && (
                <div className="absolute top-full mt-2 left-0 w-52 rounded-xl border border-blue-900/60 bg-[#0D1E35]/95 backdrop-blur-sm shadow-xl shadow-black/40 overflow-hidden z-50">
                  {DEMOS.map((demo) => {
                    const shared = `flex items-center gap-3 px-4 py-3 text-sm font-medium ${demo.color} ${demo.hover} border-b ${demo.border} last:border-b-0 transition-colors`
                    const dot = (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${demo.ping} opacity-60`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${demo.ping}`} />
                      </span>
                    )
                    return demo.href ? (
                      <Link key={demo.label} href={demo.href} onClick={() => setDemoOpen(false)} className={shared}>
                        {dot}{demo.label}
                      </Link>
                    ) : (
                      <button key={demo.label} onClick={() => { demo.action?.(); setDemoOpen(false) }} className={`w-full text-right ${shared}`}>
                        {dot}{demo.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => handleLink('contact')}
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            >
              קביעת שיחה
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="פתח תפריט ניווט"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D1E35] border-t border-blue-900/50 px-4 py-6 flex flex-col gap-4">
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => handleLink(id)} className={mobileLinkClass(id)}>
              {label}
            </button>
          ))}

          {/* Mobile demos list */}
          <div className="rounded-xl border border-blue-900/40 overflow-hidden">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest bg-[#0A1628]">
              דמואים חיים
            </p>
            {DEMOS.map((demo) => {
              const shared = `flex items-center gap-3 px-4 py-3 text-sm font-medium ${demo.color} ${demo.hover} border-t ${demo.border} transition-colors`
              const dot = (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${demo.ping} opacity-60`} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${demo.ping}`} />
                </span>
              )
              return demo.href ? (
                <Link key={demo.label} href={demo.href} onClick={() => setMenuOpen(false)} className={shared}>
                  {dot}{demo.label}
                </Link>
              ) : (
                <button key={demo.label} onClick={() => { demo.action?.(); setMenuOpen(false) }} className={`w-full text-right ${shared}`}>
                  {dot}{demo.label}
                </button>
              )
            })}
          </div>
          <button onClick={() => handleLink('contact')} className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-3 rounded-lg text-center transition-colors mt-2">
            קביעת שיחת ייעוץ
          </button>
        </div>
      )}
    </nav>
  )
}
