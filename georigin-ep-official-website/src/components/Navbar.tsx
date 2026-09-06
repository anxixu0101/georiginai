import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollToAnchor } from '@/lib/lenis'

/* ------------------------------------------------------------------ */
/* Custom 20x20 inline SVG nav icons — static at rest, animate on     */
/* hover/focus (CSS gates in index.css).                              */
/* ------------------------------------------------------------------ */

function JoystickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 16.5a6 3 0 0 1 12 0" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
      <g className="ep-icon-joystick-stick">
        <line x1="10" y1="16" x2="10" y2="8.5" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <circle className="ep-icon-joystick-ball" cx="10" cy="6.5" r="2.75" fill="#FFD21F" stroke="#141414" strokeWidth="1.5" />
    </svg>
  )
}

function RadarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="#141414" strokeWidth="1.5" />
      <g className="ep-icon-radar-sweep">
        <path d="M10 10 L10 2.2 A7.8 7.8 0 0 1 15.5 4.6 Z" fill="#FFD21F" stroke="#141414" strokeWidth="1" strokeLinejoin="round" />
      </g>
      <circle className="ep-icon-radar-blip-a" cx="7" cy="12" r="1.3" fill="#141414" />
      <circle className="ep-icon-radar-blip-b" cx="13" cy="12.5" r="1.3" fill="#141414" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="10.5" height="12" rx="2" fill="#fff" stroke="#141414" strokeWidth="1.5" />
      <line className="ep-icon-note-line" x1="5" y1="8.5" x2="10.5" y2="8.5" stroke="#FFD21F" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="9" y2="12" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
      <g className="ep-icon-pencil">
        <path d="M12.5 15.5 L16.5 8.5 L18.2 9.8 L14.2 16.8 L11.9 17.6 Z" fill="#FFD21F" stroke="#141414" strokeWidth="1.3" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <g className="ep-icon-hand-left">
        <path d="M2.5 13.5 L6.5 6.5 L9.5 8.5 L7 14 Z" fill="#fff" stroke="#141414" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g className="ep-icon-hand-right">
        <path d="M17.5 13.5 L13.5 6.5 L10.5 8.5 L13 14 Z" fill="#fff" stroke="#141414" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <path
        className="ep-icon-spark"
        d="M10 1.8 l1 2.1 2.1.8 -2.1.8 -1 2.1 -1 -2.1 -2.1 -.8 2.1 -.8 z"
        fill="#FFD21F"
        stroke="#141414"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */

type NavKey = 'console' | 'games' | 'notes' | 'contact'

const NAV_ITEMS: { key: NavKey; label: string; icon: ComponentType }[] = [
  { key: 'console', label: 'CONSOLE', icon: JoystickIcon },
  { key: 'games', label: 'GAMES', icon: RadarIcon },
  { key: 'notes', label: 'NOTES', icon: PencilIcon },
  { key: 'contact', label: 'CONTACT', icon: HandshakeIcon },
]

/** Route map per design.md §7: on home, everything smooth-scrolls in-page. */
const ROUTES: Record<NavKey, { homeAnchor: string; href: string }> = {
  console: { homeAnchor: '#console', href: '/#console' },
  games: { homeAnchor: '#games', href: '/games' },
  notes: { homeAnchor: '#notes', href: '/devlog' },
  contact: { homeAnchor: '#contact', href: '/#contact' },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (key: NavKey) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    const item = ROUTES[key]
    if (isHome) {
      scrollToAnchor(item.homeAnchor)
      window.history.replaceState(null, '', item.homeAnchor)
    } else if (key === 'games' || key === 'notes') {
      navigate(item.href)
    } else {
      navigate(item.href)
      // Home page picks up the hash on mount and scrolls there.
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-black/[0.08] bg-[rgba(248,248,246,0.6)] backdrop-blur-[16px] backdrop-saturate-150"
      >
        <div className="mx-auto flex h-full max-w-ep items-center justify-between px-6 lg:px-16">
          <Link to="/" className="flex items-center gap-2.5" aria-label="GEORIGIN home">
            <span className="block h-2.5 w-2.5 bg-ep-accent ring-1 ring-ep-ink" />
            <span className="font-archivo text-[14px] font-black tracking-[0.08em] text-ep-ink">GEORIGIN</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={isHome ? ROUTES[key].homeAnchor : ROUTES[key].href}
                onClick={go(key)}
                className="ep-nav-item group flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[11.5px] tracking-[0.14em] text-ep-ink transition-colors duration-200 hover:bg-ep-ink hover:text-white focus-visible:bg-ep-ink focus-visible:text-white focus-visible:outline-none"
              >
                <Icon />
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span
              className={`absolute h-[2px] w-5 bg-ep-ink transition-transform duration-300 ${
                open ? 'translate-y-0 rotate-45' : '-translate-y-[4px]'
              }`}
            />
            <span
              className={`absolute h-[2px] w-5 bg-ep-ink transition-transform duration-300 ${
                open ? 'translate-y-0 -rotate-45' : 'translate-y-[4px]'
              }`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isHome && !open && (
          <motion.a
            href="#development"
            onClick={(event) => {
              event.preventDefault()
              scrollToAnchor('#development')
              window.history.replaceState(null, '', '#development')
            }}
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed left-0 right-0 top-[60px] z-[49] flex h-8 items-center justify-center border-b border-ep-ink bg-ep-accent px-4 font-mono text-[9px] font-bold tracking-[0.12em] text-ep-ink transition-colors hover:bg-white sm:text-[10px]"
          >
            <span className="sm:hidden">V1 PROTOTYPE · V2 IN DEVELOPMENT →</span>
            <span className="hidden sm:inline">
              V1 WORKING PROTOTYPE · NOT THE FINAL RETAIL HARDWARE · V2 IN DEVELOPMENT →
            </span>
          </motion.a>
        )}
      </AnimatePresence>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="ep-nav-overlay fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-white pt-[60px] md:hidden"
          >
            {NAV_ITEMS.map(({ key, label, icon: Icon }, i) => (
              <motion.a
                key={key}
                href={isHome ? ROUTES[key].homeAnchor : ROUTES[key].href}
                onClick={go(key)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                className="ep-nav-item flex items-center gap-4 font-archivo text-2xl font-extrabold tracking-tight text-ep-ink"
              >
                <Icon />
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
