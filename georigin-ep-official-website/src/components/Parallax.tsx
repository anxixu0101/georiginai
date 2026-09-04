import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Pixels the element drifts (down positive) while scrolling through the viewport. */
  drift?: number
  /** Slow scale target reached at the end of the scroll range. */
  scaleTo?: number
}

/**
 * GSAP scrub wrapper (isolated per react-dev.md library-isolation rule).
 * Wraps children in its own div and only ever touches that div.
 */
export default function Parallax({ children, className, drift = 0, scaleTo }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 0, scale: 1 },
        {
          y: drift,
          scale: scaleTo ?? 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [drift, scaleTo])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
