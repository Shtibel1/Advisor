'use client'

import { useState } from 'react'
import { MenuIcon, XIcon } from '@/components/ui/Icons'

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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLink = (id: string) => {
    setMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* In RTL flex-row, first child = rightmost (logo), last child = leftmost (nav links) */}
        <div className="flex items-center justify-between h-16">

          {/* Logo — appears on the RIGHT in RTL */}
          <a href="#" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">Nadav</span>
            <span className="text-2xl font-bold text-cyan-400">AI</span>
          </a>

          {/* Desktop Nav — appears on the LEFT in RTL */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleLink('services')} className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">שירותים</button>
            <button onClick={() => handleLink('about')}    className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">אודות</button>
            <button onClick={() => handleLink('contact')}  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">צור קשר</button>
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
          <button onClick={() => handleLink('services')} className="text-gray-300 hover:text-cyan-400 py-2 font-medium border-b border-blue-900/30 transition-colors text-right">שירותים</button>
          <button onClick={() => handleLink('about')}    className="text-gray-300 hover:text-cyan-400 py-2 font-medium border-b border-blue-900/30 transition-colors text-right">אודות</button>
          <button onClick={() => handleLink('contact')}  className="text-gray-300 hover:text-cyan-400 py-2 font-medium border-b border-blue-900/30 transition-colors text-right">צור קשר</button>
          <button onClick={() => handleLink('contact')}  className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-3 rounded-lg text-center transition-colors mt-2">
            קביעת שיחת ייעוץ
          </button>
        </div>
      )}
    </nav>
  )
}
