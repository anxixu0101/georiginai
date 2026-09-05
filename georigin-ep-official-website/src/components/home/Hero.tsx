import { memo } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import SubscribeForm from '@/components/SubscribeForm'
import Parallax from '@/components/Parallax'

const EASE = [0.2, 0.7, 0.2, 1] as [number, number, number, number]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/** Infinite float loop, memoized so parent re-renders never reset it. */
const FloatingDevice = memo(function FloatingDevice() {
  return (
    <div className="ep-float">
      <img
        src="/assets/device-yellow-cut.png"
        alt="Easing-Point handheld console in Signal Yellow running STAR DRIFT"
        className="w-full"
        style={{ filter: 'drop-shadow(0 54px 42px rgba(20,20,20,0.30))' }}
      />
    </div>
  )
})

const CounterFloat = memo(function CounterFloat({
  children,
  delay,
}: {
  children: ReactNode
  delay: number
}) {
  return (
    <div className="ep-counter-float" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
})

export default function Hero() {
  return (
    <section
      id="console"
      className="relative -mt-[60px] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2f2f0 0%, #ececea 60%, #e9e9e7 100%)' }}
    >
      {/* Watermark */}
      <Parallax
        drift={-60}
        className="pointer-events-none absolute -top-6 right-0 hidden select-none md:block"
      >
        <span className="ep-watermark">EP</span>
      </Parallax>

      <div className="mx-auto grid max-w-ep grid-cols-1 items-center gap-14 px-6 pb-[90px] pt-[130px] lg:grid-cols-[1fr_1.08fr] lg:px-16">
        {/* Left column */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.p variants={item} className="ep-eyebrow">
            EASING-POINT · IN DEVELOPMENT
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-7 font-archivo text-[clamp(52px,5.4vw,92px)] font-black leading-[0.96] tracking-[-0.03em] text-ep-ink"
          >
            Tiny console.
            <br />
            <span className="hl">Huge worlds.</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-7 max-w-[46ch] font-grotesk text-[16.5px] leading-[1.75] text-ep-body"
          >
            Easing-Point is a pocket-sized pixel-art handheld. One big knob, one little screen, and
            a growing library of strange, beautiful games.
          </motion.p>
          <motion.div variants={item} className="mt-9 max-w-[520px]">
            <SubscribeForm
              idPrefix="hero"
              microcopy="Subscribe to get early-bird Kickstarter pricing."
            />
          </motion.div>
        </motion.div>

        {/* Right column — stage */}
        <div className="relative lg:w-[134%] lg:translate-x-10 lg:translate-y-10">
          <Parallax drift={56}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            >
              <FloatingDevice />
            </motion.div>
          </Parallax>

          {/* Floating mini-card: ECLIPSE RACER (top-right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.5 }}
            className="absolute -right-2 -top-6 w-[128px] rotate-3 md:w-[168px] lg:-right-[92px] lg:-top-36 lg:w-[255px]"
          >
            <CounterFloat delay={0}>
              <div className="rounded-[18px] bg-white p-3 shadow-[0_22px_46px_rgba(0,0,0,0.18)]">
                <div className="ep-frame rounded-[8px]">
                  <img src="/assets/game-gothic.jpg" alt="ECLIPSE RACER gameplay" />
                </div>
                <p className="px-1 pb-1 pt-3 font-mono text-[9px] tracking-[0.12em] text-ep-muted lg:text-[11px]">
                  ECLIPSE RACER / IN DEV · 04
                </p>
              </div>
            </CounterFloat>
          </motion.div>

          {/* Floating mini-card: MIST BLUE (bottom-left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.65 }}
            className="absolute -left-3 bottom-10 w-[148px] -rotate-4 md:w-[196px] lg:-bottom-[272px] lg:-left-[120px] lg:w-[300px] lg:-rotate-6"
          >
            <CounterFloat delay={1.2}>
              <div className="rounded-[18px] bg-white p-3 shadow-[0_22px_46px_rgba(0,0,0,0.18)]">
                <div className="ep-frame rounded-[8px]">
                  <img src="/assets/device-blue-off.jpg" alt="Mist Blue Easing-Point, screen off" />
                </div>
                <p className="flex items-center gap-1.5 px-1 pb-1 pt-3 font-mono text-[9px] tracking-[0.12em] text-ep-muted lg:text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-ep-cobalt ring-1 ring-ep-ink" />
                  MIST BLUE / COLOR B
                </p>
              </div>
            </CounterFloat>
          </motion.div>
        </div>
      </div>

      {/* Pill strip under the stage */}
      <div className="relative z-10 mx-auto flex max-w-ep flex-wrap items-center justify-center gap-3 px-6 pb-10 lg:mt-[260px] lg:justify-end lg:px-16">
        {['SIGNAL YELLOW / MIST BLUE', 'ONE BIG KNOB', 'PIXEL DISPLAY'].map((pill) => (
          <span key={pill} className="ep-glass-pill">
            {pill}
          </span>
        ))}
      </div>
    </section>
  )
}
