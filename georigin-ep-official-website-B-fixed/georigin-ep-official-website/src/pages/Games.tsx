import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import GameCard from '@/components/GameCard'
import Parallax from '@/components/Parallax'
import Reveal from '@/components/Reveal'
import SubscribeForm from '@/components/SubscribeForm'
import { YOUTUBE_VIDEO_URL } from '@/lib/site'

gsap.registerPlugin(ScrollTrigger)

const HERO_GRADIENT = 'linear-gradient(180deg, #f2f2f0 0%, #ececea 60%, #e9e9e7 100%)'

interface LibraryGame {
  title: string
  tag: string
  image: string
  tagline: string
  description: string
}

const LIBRARY: LibraryGame[] = [
  {
    title: 'STAR DRIFT',
    tag: 'SHMUP',
    image: '/assets/device-yellow-space.jpg',
    tagline: 'Dodge the drift.',
    description:
      'A pocket space shooter about momentum. Your ship never stops moving — the knob is your only brake, your only rudder, your only hope.',
  },
  {
    title: 'PAPER TRAIL',
    tag: 'RPG',
    image: '/assets/game-entry.jpg',
    tagline: 'Every note is a clue.',
    description:
      'A warm, paper-textured mystery told through found letters. Read, connect, and decide what the trail really means.',
  },
  {
    title: 'NIGHT TRAIN 04',
    tag: 'AVG',
    image: '/assets/game-train.jpg',
    tagline: 'Last stop: unknown.',
    description:
      'A rainy-night visual novel set on a sleeper train that never arrives. Talk to the other passengers. One of them knows why.',
  },
  {
    title: 'ECLIPSE RACER',
    tag: 'RACER',
    image: '/assets/game-gothic.jpg',
    tagline: 'Race the apocalypse.',
    description:
      'Gothic street racing under a dying sun. Drift through cathedrals of rust while the eclipse counts down overhead.',
  },
]

/* ------------------------------------------------------------------ */
/* Editorial row: image slides in from one side, text from the other, */
/* with a slow 0.96→1 scale scrub on the artwork for depth.           */
/* ------------------------------------------------------------------ */

function EditorialRow({ game, index }: { game: LibraryGame; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const flip = index % 2 === 1

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const image = el.querySelector('[data-row-image]')
      const text = el.querySelector('[data-row-text]')
      const dir = flip ? 1 : -1
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })
      tl.fromTo(
        image,
        { opacity: 0, x: dir * -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
      ).fromTo(
        text,
        { opacity: 0, x: dir * 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        0.1,
      )
      gsap.fromTo(
        el.querySelector('[data-row-card]'),
        { scale: 0.96 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [flip])

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
    >
      {/* Artwork side */}
      <div data-row-image className={`relative ${flip ? 'md:order-2' : ''}`}>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-12 z-10 select-none font-archivo text-[84px] font-black leading-none ${
            flip ? '-right-2' : '-left-2'
          }`}
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(0,0,0,0.12)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div data-row-card>
          <GameCard title={game.title} tag={game.tag} image={game.image} showInDevChip={false} />
        </div>
      </div>

      {/* Text side */}
      <div data-row-text className={flip ? 'md:order-1' : ''}>
        <h2 className="font-pixel text-[13px] uppercase leading-relaxed text-ep-ink">
          {game.title}
        </h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-ep-accent px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-ep-ink">
            {game.tag}
          </span>
          <span className="rounded-full border border-ep-line px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-ep-muted">
            IN DEV
          </span>
        </div>
        <p className="mt-5 font-archivo text-[24px] font-extrabold tracking-[-0.01em] text-ep-ink">
          {game.tagline}
        </p>
        <p className="mt-3 max-w-[46ch] font-grotesk text-[15.5px] leading-[1.75] text-ep-body">
          {game.description}
        </p>
        <a
          href={YOUTUBE_VIDEO_URL}
          target="_blank"
          rel="noopener"
          className="ep-btn-primary mt-8"
        >
          WATCH ON YOUTUBE ▶
        </a>
      </div>
    </div>
  )
}

export default function Games() {
  return (
    <>
      {/* ---------------------------------------------------------- */}
      {/* Page header                                                 */}
      {/* ---------------------------------------------------------- */}
      <section
        className="relative overflow-hidden px-6 pb-[80px] pt-[150px]"
        style={{ background: HERO_GRADIENT }}
      >
        <Parallax
          drift={20}
          className="pointer-events-none absolute -top-4 right-0 hidden select-none md:block"
        >
          <span className="ep-watermark">LIBRARY</span>
        </Parallax>

        <Reveal className="relative z-10 mx-auto max-w-ep" stagger={0.12} y={30}>
          <p data-reveal-item className="ep-eyebrow">
            EP LIBRARY · FOUR TITLES IN DEV
          </p>
          <h1
            data-reveal-item
            className="mt-7 font-archivo text-[clamp(44px,4.8vw,76px)] font-black leading-[0.96] tracking-[-0.03em] text-ep-ink"
          >
            Small screen.
            <br />
            <span className="hl">Big feelings.</span>
          </h1>
          <p
            data-reveal-item
            className="mt-7 max-w-[52ch] font-grotesk text-[16.5px] leading-[1.75] text-ep-body"
          >
            Four worlds are already running on EP hardware, with more joining the library. Every
            screen below was captured on device — click one to watch it play.
          </p>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Game entries                                                */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-ep-base px-6 py-[110px]">
        <div className="mx-auto max-w-[1180px] space-y-[100px]">
          {LIBRARY.map((game, i) => (
            <EditorialRow key={game.title} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Hardware tie-in band                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-white px-6 py-[110px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, rotate: -4, y: 30 }}
            whileInView={{ opacity: 1, rotate: 0, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-[18px] bg-white p-3 shadow-[0_24px_48px_rgba(0,0,0,0.14)]"
          >
            <div className="ep-frame rounded-[10px]">
              <img
                src="/assets/device-blue-off.jpg"
                alt="Mist Blue Easing-Point handheld, screen off"
                loading="lazy"
              />
            </div>
          </motion.div>

          <Reveal stagger={0.1}>
            <p data-reveal-item className="ep-eyebrow">
              THE MACHINE
            </p>
            <h3
              data-reveal-item
              className="mt-6 font-archivo text-[clamp(28px,3vw,40px)] font-black leading-[1.05] tracking-[-0.02em] text-ep-ink"
            >
              One console plays them all.
            </h3>
            <p
              data-reveal-item
              className="mt-5 max-w-[46ch] font-grotesk text-[16px] leading-[1.75] text-ep-body"
            >
              STAR DRIFT, PAPER TRAIL, NIGHT TRAIN 04 and ECLIPSE RACER all run on the same pocket
              hardware — one big knob, one little square screen.
            </p>
            <div data-reveal-item className="mt-8">
              <Link
                to="/#console"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[14px] border border-ep-line bg-white px-7 font-archivo text-[15px] font-extrabold text-ep-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ep-ink"
              >
                SEE THE CONSOLE →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA strip                                                   */}
      {/* ---------------------------------------------------------- */}
      <section
        className="relative overflow-hidden px-6 py-[90px]"
        style={{ background: HERO_GRADIENT }}
      >
        <Reveal className="relative z-10 mx-auto max-w-[640px] text-center" stagger={0.1}>
          <p data-reveal-item className="ep-eyebrow justify-center">
            STAY IN THE LOOP
          </p>
          <h2
            data-reveal-item
            className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
          >
            More games are
            <br />
            <span className="hl">coming.</span>
          </h2>
          <div data-reveal-item className="mx-auto mt-10 max-w-[480px] text-left">
            <SubscribeForm
              idPrefix="games-cta"
              microcopy="Build notes and new game reveals, first."
            />
          </div>
        </Reveal>
      </section>
    </>
  )
}
