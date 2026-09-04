import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '@/components/Reveal'
import Parallax from '@/components/Parallax'
import { GAMES, YOUTUBE_VIDEO_URL } from '@/lib/site'
import { useMediaQuery } from '@/hooks/use-media-query'

/** Fan-out targets as fractions of the half-stage (x, y) + rotation. */
const FAN = [
  { fx: -0.46, fy: -0.38, r: -7 }, // STAR DRIFT — up-left
  { fx: 0.46, fy: -0.42, r: 6 }, // PAPER TRAIL — up-right
  { fx: -0.5, fy: 0.4, r: 5 }, // NIGHT TRAIN 04 — down-left
  { fx: 0.48, fy: 0.36, r: -6 }, // ECLIPSE RACER — down-right
]

function MiniGameCard({ index, bob }: { index: number; bob: boolean }) {
  const game = GAMES[index]
  return (
    <div
      style={bob ? { animation: `ep-bob 3.5s ease-in-out ${index * 0.45}s infinite` } : undefined}
    >
        <div className="group w-[200px] max-w-full rounded-[18px] bg-white p-2.5 shadow-[0_24px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.04]">
          <div className="ep-frame relative rounded-[10px]">
            <img src={game.image} alt={`${game.title} on the Easing-Point screen`} loading="lazy" />
            <span className="absolute bottom-2 left-2 translate-y-2 rounded-full bg-ep-ink px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-ep-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              WATCH ▶
            </span>
          </div>
          <div className="flex items-center justify-between px-1 pb-1 pt-2.5">
            <span className="font-pixel text-[9px] uppercase text-ep-ink">{game.title}</span>
            <span className="font-mono text-[9.5px] tracking-[0.1em] text-ep-muted">{game.tag}</span>
          </div>
        </div>
    </div>
  )
}

function LogoCard({ open, onClick }: { open: boolean; onClick?: () => void }) {
  return (
    <motion.div
      animate={{ scale: open ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={onClick}
      className={`ep-breathe relative z-20 w-[min(480px,86vw)] cursor-pointer rounded-[24px] bg-white p-3.5 shadow-[0_24px_48px_rgba(0,0,0,0.14)] ${
        onClick ? '' : 'pointer-events-none'
      }`}
    >
      <div
        className={`flex h-[272px] flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed transition-colors duration-300 ${
          open ? 'border-ep-accent' : 'border-ep-line'
        }`}
      >
        <p className="px-6 text-center font-mono text-[12px] uppercase leading-relaxed tracking-[0.3em] text-ep-muted">
          EASING-POINT — LOGO PLACEHOLDER
        </p>
        <p className="font-mono text-[10.5px] tracking-[0.14em] text-ep-muted/70">
          final artwork drops in here
        </p>
      </div>
    </motion.div>
  )
}

export default function LogoReveal() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)
  const intentRef = useRef<number | undefined>(undefined)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState({ w: 960, h: 520 })

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setStage({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(intentRef.current), [])

  const enter = () => {
    window.clearTimeout(intentRef.current)
    intentRef.current = window.setTimeout(() => setOpen(true), 120)
  }
  const leave = () => {
    window.clearTimeout(intentRef.current)
    setOpen(false)
  }
  const toggle = () => setOpen((v) => !v)

  return (
    <section id="games" className="bg-ep-base px-6 pb-[130px] pt-[110px]">
      <Reveal className="mx-auto max-w-[720px] text-center" stagger={0.1}>
        <p data-reveal-item className="ep-eyebrow justify-center">
          THE LIBRARY
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          One console,
          <br />
          <span className="hl">many games.</span>
        </h2>
        <p
          data-reveal-item
          className="mx-auto mt-6 max-w-[52ch] font-grotesk text-[16px] leading-[1.75] text-ep-body"
        >
          EP&rsquo;s library keeps growing. Hover the logo — each screen you see is a real game
          build, captured on device.
        </p>
      </Reveal>

      <Reveal y={40} className="mt-14">
        <Parallax scaleTo={1.015}>
          {isDesktop ? (
            /* ---------- Desktop: absolute fan ---------- */
            <div
              ref={stageRef}
              onPointerEnter={enter}
              onPointerLeave={leave}
              className="relative mx-auto h-[520px] w-[min(960px,92vw)]"
            >
              {/* Hint pill */}
              <motion.div
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 top-[calc(50%+180px)] z-10 -translate-x-1/2"
              >
                <span className="ep-glass-pill">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-ep-accent ring-1 ring-ep-ink"
                    style={{ animation: 'ep-dot-pulse 1.2s ease-in-out infinite' }}
                  />
                  HOVER TO REVEAL GAMES
                </span>
              </motion.div>

              {/* Logo placeholder (rest state) */}
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <LogoCard open={open} />
              </div>

              {/* Fan cards */}
              {GAMES.map((game, i) => {
                const target = FAN[i]
                return (
                  <div
                    key={game.title}
                    className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{ pointerEvents: open ? 'auto' : 'none' }}
                  >
                    <motion.a
                      href={YOUTUBE_VIDEO_URL}
                      target="_blank"
                      rel="noopener"
                      className="block"
                      initial={false}
                      animate={
                        open
                          ? {
                              x: target.fx * (stage.w / 2),
                              y: target.fy * (stage.h / 2),
                              rotate: target.r,
                              scale: 1,
                              opacity: 1,
                            }
                          : { x: 0, y: 0, rotate: 0, scale: 0.35, opacity: 0 }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 19,
                        delay: open ? i * 0.07 : (GAMES.length - 1 - i) * 0.04,
                      }}
                    >
                      <MiniGameCard index={i} bob={open} />
                    </motion.a>
                  </div>
                )
              })}
            </div>
          ) : (
            /* ---------- Mobile: tap toggles a 2x2 grid ---------- */
            <div className="mx-auto w-[min(480px,92vw)]">
              <div className="flex justify-center">
                <LogoCard open={open} onClick={toggle} />
              </div>
              <motion.div
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="mt-5 flex justify-center"
              >
                <span className="ep-glass-pill">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-ep-accent ring-1 ring-ep-ink"
                    style={{ animation: 'ep-dot-pulse 1.2s ease-in-out infinite' }}
                  />
                  TAP TO REVEAL GAMES
                </span>
              </motion.div>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 pt-6">
                      {GAMES.map((game, i) => (
                        <motion.a
                          key={game.title}
                          href={YOUTUBE_VIDEO_URL}
                          target="_blank"
                          rel="noopener"
                          initial={{ scale: 0.35, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.35, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 19,
                            delay: i * 0.07,
                          }}
                          className="flex justify-center [&>div>div>div]:w-full [&_img]:w-full"
                        >
                          <div className="w-full max-w-[200px]">
                            <MiniGameCard index={i} bob={false} />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Parallax>
      </Reveal>
    </section>
  )
}
