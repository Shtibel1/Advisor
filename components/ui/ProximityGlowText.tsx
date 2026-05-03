'use client'

import { useEffect, useRef } from 'react'

const RADIUS = 160

// cyan-400 #22d3ee  /  blue-300 #93c5fd
const CYAN: [number, number, number] = [34, 211, 238]
const BLUE: [number, number, number] = [147, 197, 253]

function lerpRGB(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(
    a[1] + (b[1] - a[1]) * t,
  )},${Math.round(a[2] + (b[2] - a[2]) * t)})`
}

// Mirrors: from-cyan-400 via-blue-300 to-cyan-400 (left direction in RTL)
function getGradientColor(pos: number): string {
  return pos <= 0.5
    ? lerpRGB(CYAN, BLUE, pos * 2)
    : lerpRGB(BLUE, CYAN, (pos - 0.5) * 2)
}

interface Props {
  text: string
  /** Render each char with its interpolated gradient color instead of inheriting white */
  isGradient?: boolean
  className?: string
}

export default function ProximityGlowText({ text, isGradient, className }: Props) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const chars = Array.from(text)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY
      charRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(mx - cx, my - cy)
        const ratio = Math.max(0, 1 - dist / RADIUS)
        if (ratio > 0) {
          const a1 = (ratio * 1).toFixed(2)
          const a2 = (ratio * 0.55).toFixed(2)
          const a3 = (ratio * 0.25).toFixed(2)
          el.style.textShadow = `0 0 2px rgba(6,182,212,${a1}), 0 0 12px rgba(6,182,212,${a2}), 0 0 28px rgba(6,182,212,${a3})`
        } else {
          el.style.textShadow = ''
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <span className={className}>
      {chars.map((char, i) => {
        const gradColor = isGradient
          ? getGradientColor(i / Math.max(chars.length - 1, 1))
          : undefined
        return (
          <span
            key={i}
            ref={(el) => { charRefs.current[i] = el }}
            style={{
              display: 'inline-block',
              transition: 'text-shadow 0.12s ease-out',
              ...(gradColor ? { color: gradColor } : {}),
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </span>
  )
}
