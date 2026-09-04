import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import Reveal from '@/components/Reveal'
import { GAMES } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Interactive knob widget — drag to rotate 0–270°, springs back.     */
/* ------------------------------------------------------------------ */

const TICKS = 13

function KnobWidget() {
  const angle = useMotionValue(0)
  const [deg, setDeg] = useState(0)
  const dragging = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useMotionValueEvent(angle, 'change', (v) => setDeg(Math.round(v)))
  const capRotate = useTransform(angle, (v) => v - 135)

  const pointToAngle = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    const raw = (Math.atan2(dy, dx) * 180) / Math.PI
    let v = (((raw + 225) % 360) + 360) % 360
    if (v > 270) v = v > 315 ? 0 : 270
    angle.set(v)
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    pointToAngle(e.clientX, e.clientY)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) pointToAngle(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    dragging.current = false
    animate(angle, 0, { type: 'spring', stiffness: 260, damping: 20 })
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="slider"
        aria-label="Knob demo"
        aria-valuemin={0}
        aria-valuemax={270}
        aria-valuenow={deg}
        className="relative h-[220px] w-[220px] cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
          {/* Tick marks */}
          {Array.from({ length: TICKS }).map((_, i) => {
            const a = (-135 + (270 / (TICKS - 1)) * i) * (Math.PI / 180)
            const lit = deg >= (270 / (TICKS - 1)) * i - 1
            const x1 = 110 + Math.sin(a) * 92
            const y1 = 110 - Math.cos(a) * 92
            const x2 = 110 + Math.sin(a) * 102
            const y2 = 110 - Math.cos(a) * 102
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={lit ? '#141414' : '#cfcfc9'}
                strokeWidth={lit ? 3 : 2}
                strokeLinecap="round"
              />
            )
          })}
          {/* Yellow face */}
          <circle cx="110" cy="110" r="84" fill="#FFD21F" stroke="#141414" strokeWidth="2" />
          <circle cx="110" cy="110" r="84" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" strokeDasharray="2 10" />
        </svg>
        {/* Cobalt cap (rotates) */}
        <motion.div
          style={{ rotate: capRotate }}
          className="absolute left-1/2 top-1/2 h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2"
        >
          <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
            <circle cx="55" cy="55" r="50" fill="#3B5BDB" stroke="#141414" strokeWidth="2" />
            {Array.from({ length: 18 }).map((_, i) => {
              const a = (i / 18) * Math.PI * 2
              const x1 = 55 + Math.cos(a) * 44
              const y1 = 55 + Math.sin(a) * 44
              const x2 = 55 + Math.cos(a) * 50
              const y2 = 55 + Math.sin(a) * 50
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
              )
            })}
            <line x1="55" y1="12" x2="55" y2="30" stroke="#FFD21F" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
      <p className="font-mono text-[12px] tracking-[0.14em] text-ep-muted">
        KNOB · {String(deg).padStart(3, '0')}°–270°
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Device screen crossfade — channels through the library.            */
/* ------------------------------------------------------------------ */

function ScreenCrossfade() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="rounded-[18px] bg-white p-4 shadow-[0_24px_48px_rgba(0,0,0,0.14)]">
      <div className="relative">
        <img
          src="/assets/device-yellow-cut.png"
          alt="Easing-Point handheld, Signal Yellow colorway"
          className="w-full"
          loading="lazy"
        />
        {/* Screen overlay — crossfades through the four games */}
        <div
          ref={ref}
          className={`ep-xfade-stack absolute overflow-hidden rounded-[6px] ${inView ? '' : 'ep-xfade-paused'}`}
          style={{ left: '8.2%', top: '13.5%', width: '57.2%', height: '73%' }}
        >
          {GAMES.map((g) => (
            <img key={g.title} src={g.image} alt="" aria-hidden="true" />
          ))}
        </div>
      </div>
      <p className="px-2 pb-1 pt-3 font-mono text-[10px] tracking-[0.14em] text-ep-muted">
        ONE SCREEN · EVERY WORLD
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Hardware() {
  return (
    <section className="bg-ep-base px-6 py-[110px]">
      <Reveal className="mx-auto max-w-[1180px]" stagger={0.1}>
        <p data-reveal-item className="ep-eyebrow">
          THE HARDWARE
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          One big knob.
          <br />
          <span className="hl">Zero clutter.</span>
        </h2>
      </Reveal>

      <div className="mx-auto mt-20 flex max-w-[1180px] flex-col gap-[90px]">
        {/* Row A — The Knob */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal y={0}>
            <div data-reveal-item>
              <RowA />
            </div>
          </Reveal>
          <Reveal y={0} delay={0.1} className="flex justify-center">
            <div data-reveal-item>
              <KnobWidget />
            </div>
          </Reveal>
        </div>

        {/* Row B — The Screen */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal y={0} className="order-2 lg:order-1">
            <div data-reveal-item>
              <ScreenCrossfade />
            </div>
          </Reveal>
          <Reveal y={0} delay={0.1} className="order-1 lg:order-2">
            <div data-reveal-item>
              <RowB />
            </div>
          </Reveal>
        </div>

        {/* Row C — USB-C + portability */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal y={0}>
            <div data-reveal-item>
              <RowC />
            </div>
          </Reveal>
          <Reveal y={0} delay={0.1}>
            <div data-reveal-item>
              <div className="rounded-[18px] bg-white p-4 shadow-[0_24px_48px_rgba(0,0,0,0.14)]">
                <div className="ep-frame rounded-[10px]">
                  <img src="/assets/device-blue-off.jpg" alt="Mist Blue Easing-Point with USB-C stick" loading="lazy" />
                </div>
                <p className="px-2 pb-1 pt-3 font-mono text-[10px] tracking-[0.14em] text-ep-muted">
                  MIST BLUE · USB-C DOCKED
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Colorway band */}
      <Reveal className="mx-auto mt-[90px] max-w-[1180px]" stagger={0.12}>
        <div data-reveal-item className="rounded-[18px] bg-white p-6 shadow-[0_24px_48px_rgba(0,0,0,0.14)] md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <ColorwayCard
              name="SIGNAL YELLOW · COBALT KNOB"
              swatch="#FFD21F"
              dot="#3B5BDB"
            />
            <ColorwayCard name="MIST BLUE · EMBER KNOB" swatch="#AEC4D4" dot="#FF7A1A" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function RowA() {
  return (
    <>
      <h3 className="font-archivo text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.01em] text-ep-ink">
        A knob you can feel.
      </h3>
      <p className="mt-4 max-w-[48ch] font-grotesk text-[16px] leading-[1.75] text-ep-body">
        The oversized rotary dial is EP&rsquo;s main control. Scroll menus, steer ships, tune the
        radio on a midnight train. It clicks, it spins, it&rsquo;s the whole interface.
      </p>
    </>
  )
}

function RowB() {
  return (
    <>
      <h3 className="font-archivo text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.01em] text-ep-ink">
        A little square of wonder.
      </h3>
      <p className="mt-4 max-w-[48ch] font-grotesk text-[16px] leading-[1.75] text-ep-body">
        A crisp square pixel display made for chunky sprites and big moods. Every game is drawn for
        this exact frame.
      </p>
    </>
  )
}

function RowC() {
  return (
    <>
      <h3 className="font-archivo text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.01em] text-ep-ink">
        Pocketable. Chargeable. Ready.
      </h3>
      <p className="mt-4 max-w-[48ch] font-grotesk text-[16px] leading-[1.75] text-ep-body">
        A compact USB-C stick for charging and docking. EP slips into a jacket pocket and wakes
        instantly.
      </p>
    </>
  )
}

function ColorwayCard({ name, swatch, dot }: { name: string; swatch: string; dot: string }) {
  return (
    <div className="group flex items-center gap-5 rounded-[14px] border border-ep-line p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-ep-ink">
      <span
        className="h-16 w-16 flex-none rounded-[12px] ring-1 ring-ep-ink"
        style={{ backgroundColor: swatch }}
      />
      <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-ep-ink">
        <span
          className="h-4 w-4 flex-none rounded-full ring-1 ring-ep-ink transition-all duration-300 group-hover:h-6 group-hover:w-6 group-hover:ring-2"
          style={{ backgroundColor: dot }}
        />
        {name}
      </span>
    </div>
  )
}
