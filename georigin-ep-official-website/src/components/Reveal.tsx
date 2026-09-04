import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger between direct [data-reveal-item] children. */
  stagger?: number
  delay?: number
  y?: number
  /** Viewport start position, e.g. 'top 80%'. */
  start?: string
}

/**
 * GSAP ScrollTrigger reveal (design.md §5): opacity 0→1, translateY→0,
 * 0.8s, trigger at 80% viewport. If direct children carry
 * `data-reveal-item`, they stagger in; otherwise the wrapper reveals.
 */
export default function Reveal({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  y = 34,
  start = 'top 80%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll(':scope > [data-reveal-item]')
      const targets = items.length > 0 ? items : [el]
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [stagger, delay, y, start])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
