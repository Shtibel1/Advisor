'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

type AccessibilityState = {
  fontSize: number          // 0 = normal, 1 = large, 2 = largest
  highContrast: boolean
  grayscale: boolean
  underlineLinks: boolean
  readableFont: boolean
  stopAnimations: boolean
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  stopAnimations: false,
}

const STORAGE_KEY = 'accessibility-prefs'

// ─── CSS class helpers ────────────────────────────────────────────────────────

const FONT_CLASSES = ['', 'a11y-font-large', 'a11y-font-largest']

function applyClasses(state: AccessibilityState) {
  const html = document.documentElement
  // font size
  html.classList.remove('a11y-font-large', 'a11y-font-largest')
  if (FONT_CLASSES[state.fontSize]) html.classList.add(FONT_CLASSES[state.fontSize])
  // toggles
  html.classList.toggle('a11y-high-contrast', state.highContrast)
  html.classList.toggle('a11y-grayscale', state.grayscale)
  html.classList.toggle('a11y-underline-links', state.underlineLinks)
  html.classList.toggle('a11y-readable-font', state.readableFont)
  html.classList.toggle('a11y-stop-animations', state.stopAnimations)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE)
  const menuRef = useRef<HTMLDivElement>(null)

  // Load prefs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: AccessibilityState = JSON.parse(saved)
        setState(parsed)
        applyClasses(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist changes and apply CSS
  const update = useCallback((partial: Partial<AccessibilityState>) => {
    setState(prev => {
      const next = { ...prev, ...partial }
      applyClasses(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setState(DEFAULT_STATE)
    applyClasses(DEFAULT_STATE)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-[9999]" dir="rtl">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/40 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
      >
        <WheelchairIcon />
      </button>

      {/* Panel */}
      {open && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="הגדרות נגישות"
          className="absolute bottom-16 left-0 w-72 rounded-2xl bg-[#0A1628] border border-blue-900/60 shadow-2xl shadow-black/60 p-4 space-y-1"
        >
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-900/40">
            <h2 className="text-white font-bold text-base">הגדרות נגישות</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט נגישות"
              className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-300 text-sm">גודל טקסט</span>
            <div className="flex gap-2" role="group" aria-label="גודל טקסט">
              <button
                onClick={() => update({ fontSize: Math.max(0, state.fontSize - 1) })}
                disabled={state.fontSize === 0}
                aria-label="הקטן טקסט"
                className="w-8 h-8 rounded-lg bg-blue-900/50 hover:bg-blue-800/70 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                A<span className="text-xs">-</span>
              </button>
              <span className="flex items-center text-gray-400 text-xs min-w-[2rem] justify-center">
                {state.fontSize === 0 ? 'רגיל' : state.fontSize === 1 ? 'גדול' : 'גדול מאוד'}
              </span>
              <button
                onClick={() => update({ fontSize: Math.min(2, state.fontSize + 1) })}
                disabled={state.fontSize === 2}
                aria-label="הגדל טקסט"
                className="w-8 h-8 rounded-lg bg-blue-900/50 hover:bg-blue-800/70 disabled:opacity-30 text-white font-bold text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                A<span className="text-xs">+</span>
              </button>
            </div>
          </div>

          <ToggleRow
            label="ניגודיות גבוהה"
            icon="🔆"
            checked={state.highContrast}
            onChange={v => update({ highContrast: v })}
          />
          <ToggleRow
            label="גוני אפור"
            icon="🩶"
            checked={state.grayscale}
            onChange={v => update({ grayscale: v })}
          />
          <ToggleRow
            label="הדגש קישורים"
            icon="🔗"
            checked={state.underlineLinks}
            onChange={v => update({ underlineLinks: v })}
          />
          <ToggleRow
            label="פונט קריא"
            icon="Aa"
            checked={state.readableFont}
            onChange={v => update({ readableFont: v })}
          />
          <ToggleRow
            label="עצור אנימציות"
            icon="⏸"
            checked={state.stopAnimations}
            onChange={v => update({ stopAnimations: v })}
          />

          <div className="pt-3 mt-2 border-t border-blue-900/40 flex items-center justify-between gap-3">
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-white transition-colors underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              אפס הגדרות
            </button>
            <Link
              href="/accessibility"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              onClick={() => setOpen(false)}
            >
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToggleRow({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string
  icon: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  const id = `a11y-${label.replace(/\s+/g, '-')}`
  return (
    <div className="flex items-center justify-between py-2">
      <label htmlFor={id} className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer select-none">
        <span aria-hidden="true" className="text-base leading-none">{icon}</span>
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          checked ? 'bg-cyan-500' : 'bg-blue-900/60'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            checked ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function WheelchairIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="1.5" />
      <path d="M9 9h6l1 5H9z" />
      <path d="M9 14l-1 4h8" />
      <circle cx="8" cy="20" r="2" />
      <circle cx="16" cy="20" r="2" />
    </svg>
  )
}
