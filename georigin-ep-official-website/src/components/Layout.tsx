import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import Lenis from 'lenis'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { setLenisInstance } from '@/lib/lenis'

/**
 * Shared layout: fixed navbar + 60px content offset + footer.
 * Owns the site-wide Lenis smooth-scroll instance.
 * Full-bleed hero sections opt out of the offset inside the page
 * (negative top margin), never by editing this component.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    setLenisInstance(lenis)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [])

  // Reset scroll on route change (hash scrolling is handled by pages).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-[100dvh] bg-ep-base text-ep-ink">
      <Navbar />
      <main className="pt-[60px]">{children}</main>
      <Footer />
    </div>
  )
}
