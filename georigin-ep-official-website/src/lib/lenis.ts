import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance
}

export function getLenis() {
  return lenisInstance
}

/** Smooth-scroll to an in-page anchor via Lenis (falls back to native). */
export function scrollToAnchor(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: -60, duration: 1.2 })
  } else {
    ;(el as HTMLElement).scrollIntoView({ behavior: 'smooth' })
  }
}
