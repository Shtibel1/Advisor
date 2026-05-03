'use client'

import { useState, useRef, useEffect } from 'react'

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.disconnect()
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic — fast start, smooth finish
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

export function CountUp({
  target,
  suffix = '',
  className = '',
  duration = 1800,
}: {
  target: number
  suffix?: string
  className?: string
  duration?: number
}) {
  const { count, ref } = useCountUp(target, duration)
  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
