'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[130px] z-[1]"
      style={{
        background:
          'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(37,99,235,0.12) 40%, transparent 70%)',
        willChange: 'transform',
        transition: 'transform 0.18s ease-out',
      }}
    />
  )
}
