'use client'

import { CountUp } from '@/components/ui/CountUp'
import ProximityGlowText from '@/components/ui/ProximityGlowText'
import { MdKeyboardArrowDown } from 'react-icons/md'
import config from '@/data/siteConfig.json'

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

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] pt-16">

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.9) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/3 -translate-y-1/2 start-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />
      {/* Fade to section below */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse flex-shrink-0" />
          ייעוץ ומימוש בינה מלאכותית לעסקים
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.2] mb-6 tracking-tight">
          <ProximityGlowText text="הופכים בינה מלאכותית" />
          <br />
          <ProximityGlowText text="לרווח נקי בעסק שלך" isGradient />
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-blue-200/75 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          אנחנו לא רק מייעצים &ndash;{' '}
          <strong className="text-white font-semibold">אנחנו מממשים</strong>.
          {' '}פתרונות AI מוכנים לייצור, משולבים בצורה מאובטחת ומדרגית בתהליכי העסק שלך.
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-8 border-t border-blue-900/60 mb-10">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp target={config.projectsCompleted} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">פרויקטים</div>
          </div>
          <div className="text-center border-x border-blue-900/60">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp target={config.timeSavedPercent} suffix="%" />
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">חיסכון בזמן</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">אוטומציה</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/30"
          >
            קביעת שיחת ייעוץ חינם
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="w-full sm:w-auto border border-blue-700/60 hover:border-cyan-500/60 text-gray-300 hover:text-cyan-300 font-medium px-8 py-4 rounded-xl text-lg transition-all hover:bg-blue-900/30 inline-flex items-center justify-center gap-2"
          >
            גלה את השירותים <MdKeyboardArrowDown size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}
