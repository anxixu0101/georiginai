import { useEffect } from 'react'
import { useLocation } from 'react-router'
import Hero from '@/components/home/Hero'
import LogoReveal from '@/components/home/LogoReveal'
import Hardware from '@/components/home/Hardware'
import DevLogTeaser from '@/components/home/DevLogTeaser'
import FinalCTA from '@/components/home/FinalCTA'
import { scrollToAnchor } from '@/lib/lenis'

export default function Home() {
  const { hash } = useLocation()

  // Deep links like /#console scroll to the section once mounted.
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => scrollToAnchor(hash), 400)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <>
      <Hero />
      <LogoReveal />
      <Hardware />
      <DevLogTeaser />
      <FinalCTA />
    </>
  )
}
