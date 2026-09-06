import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Reveal from '@/components/Reveal'
import Parallax from '@/components/Parallax'
import { YOUTUBE_VIDEO_URL } from '@/lib/site'
import { useMediaQuery } from '@/hooks/use-media-query'

const SHOWCASE_GAMES = [
  { title: 'STARWARD', image: '/assets/game-starward.jpg', tagline: 'SHOOT FURTHER' },
  { title: 'SANDSPIRE', image: '/assets/game-sandspire.jpg', tagline: 'BREAK THE CURSE' },
  { title: 'ASHROAD', image: '/assets/game-ashroad.jpg', tagline: 'DRIVE WHAT REMAINS' },
  {
    title: 'THE LAST LETTER',
    image: '/assets/game-last-letter.jpg',
    tagline: 'SOME STORIES STILL TRAVEL',
  },
] as const

const FAN = [
  { fx: -0.37, y: 118, rotate: -9 },
  { fx: -0.125, y: 68, rotate: -3 },
  { fx: 0.125, y: 68, rotate: 3 },
  { fx: 0.37, y: 118, rotate: 9 },
] as const

const SPRING = { type: 'spring' as const, duration: 0.72, bounce: 0.16 }
const DESKTOP_WINDOW_HALF_WIDTH = 160

function youtubeEmbedUrl(url: string) {
  const id = new URL(url).searchParams.get('v')
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
}

function CornerBrackets() {
  const corner = 'absolute h-4 w-4 border-ep-accent'
  return (
    <>
      <span className={`${corner} left-2 top-2 border-l-[3px] border-t-[3px]`} />
      <span className={`${corner} right-2 top-2 border-r-[3px] border-t-[3px]`} />
      <span className={`${corner} bottom-2 left-2 border-b-[3px] border-l-[3px]`} />
      <span className={`${corner} bottom-2 right-2 border-b-[3px] border-r-[3px]`} />
    </>
  )
}

function WindowControls({ close = false, onClose }: { close?: boolean; onClose?: () => void }) {
  return (
    <div className="ml-auto flex items-center gap-2 text-ep-ink" aria-hidden={!close}>
      <span className="h-px w-2.5 bg-current" />
      <span className="h-2.5 w-2.5 border border-current" />
      {close ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gameplay video"
          className="relative h-5 w-5 cursor-pointer transition-colors hover:text-ep-accent"
        >
          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
        </button>
      ) : (
        <span className="relative h-3 w-3">
          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
        </span>
      )}
    </div>
  )
}

function GameWindow({
  index,
  hovered,
  dimmed,
}: {
  index: number
  hovered: boolean
  dimmed: boolean
}) {
  const game = SHOWCASE_GAMES[index]
  return (
    <div
      className={`w-full overflow-hidden border-2 bg-white transition-[border-color,box-shadow,filter,opacity] duration-300 md:w-[320px] ${
        hovered
          ? 'border-ep-accent shadow-[0_0_0_1px_rgba(255,210,31,0.35),0_0_26px_rgba(255,210,31,0.28),0_24px_48px_rgba(0,0,0,0.18)]'
          : 'border-ep-ink shadow-[0_20px_40px_rgba(0,0,0,0.17)]'
      } ${dimmed ? 'brightness-[0.76] opacity-70' : 'brightness-100 opacity-100'}`}
    >
      <div className="flex h-10 items-center gap-2 border-b-2 border-ep-ink px-3 font-mono text-[11px] font-bold tracking-[0.2em] text-ep-ink">
        <span className="h-3 w-3 border border-ep-ink bg-ep-accent" />
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="truncate">{game.title}</span>
        <WindowControls />
      </div>
      <div className="relative m-2 border border-ep-ink bg-ep-ink">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={game.image}
            alt={`${game.title} game screenshot`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <CornerBrackets />
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-ep-accent bg-ep-ink/80 shadow-[0_0_20px_rgba(255,210,31,0.34)]">
            <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-ep-accent" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em]">WATCH GAMEPLAY</span>
        </div>
      </div>
      <div className="border-t border-ep-ink bg-ep-ink px-3 py-2 text-center font-mono text-[10px] font-bold tracking-[0.2em] text-white">
        {game.tagline}
      </div>
    </div>
  )
}

function ConsoleCard({
  expanded,
  activeIndex,
  onClick,
  onClose,
}: {
  expanded: boolean
  activeIndex: number | null
  onClick?: () => void
  onClose: () => void
}) {
  const activeGame = activeIndex === null ? null : SHOWCASE_GAMES[activeIndex]
  return (
    <motion.div
      data-console-card
      animate={{ scale: expanded ? 0.96 : 1, y: expanded ? -28 : 0 }}
      transition={SPRING}
      className="relative z-20 w-[min(500px,84vw)]"
    >
      <img
        src="/assets/device-yellow-cut.png"
        alt="Signal Yellow Easing-Point handheld console"
        className="w-full drop-shadow-[0_28px_30px_rgba(0,0,0,0.22)]"
      />
      <span className="pointer-events-none absolute bottom-[5%] right-[4%] z-40 border border-ep-accent bg-ep-ink px-2 py-1 font-mono text-[8px] font-bold tracking-[0.14em] text-white shadow-md">
        V1 PROTOTYPE
      </span>
      {onClick && activeIndex === null && (
        <button
          type="button"
          onClick={onClick}
          aria-label="Reveal game worlds"
          className="absolute inset-0 z-10 cursor-pointer"
        />
      )}
      <AnimatePresence initial={false}>
        {activeGame && (
          <motion.div
            data-console-player
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute z-30 overflow-hidden rounded-[5px] bg-black ring-1 ring-black"
            style={{ left: '8.2%', top: '13.5%', width: '57.2%', height: '73%' }}
          >
            <iframe
              src={youtubeEmbedUrl(YOUTUBE_VIDEO_URL)}
              title={`${activeGame.title} gameplay video`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center bg-gradient-to-b from-black/75 to-transparent px-2 pb-5 pt-2 font-mono text-[8px] font-bold tracking-[0.14em] text-white">
              <span className="mr-1.5 h-2 w-2 border border-ep-ink bg-ep-accent" />
              {activeGame.title}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gameplay video"
              className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center border border-white/75 bg-black/75 text-white transition-colors hover:border-ep-accent hover:text-ep-accent"
            >
              <span className="relative block h-3 w-3">
                <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function LogoReveal() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [expanded, setExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerInsideRef = useRef(false)
  const closeTimerRef = useRef<number | undefined>(undefined)
  const [stageWidth, setStageWidth] = useState(1240)

  const closePlayer = useCallback(() => {
    setActiveIndex(null)
    setExpanded(true)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      if (!pointerInsideRef.current) setExpanded(false)
    }, 780)
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [isDesktop])

  useEffect(() => {
    if (activeIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePlayer()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, closePlayer])

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  const enterStage = () => {
    pointerInsideRef.current = true
    window.clearTimeout(closeTimerRef.current)
    setExpanded(true)
  }

  const leaveStage = () => {
    pointerInsideRef.current = false
    setHoveredIndex(null)
    if (activeIndex === null) setExpanded(false)
  }

  const selectGame = (index: number) => {
    setExpanded(true)
    setHoveredIndex(null)
    setActiveIndex(index)
  }

  return (
    <section id="games" className="overflow-hidden bg-ep-base px-6 pb-[130px] pt-[110px]">
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
          Four strange worlds, all living inside one tiny console. Move closer and let them out.
        </p>
      </Reveal>

      <Reveal y={40} className="mt-12">
        <Parallax scaleTo={1.008}>
          {isDesktop ? (
            <LayoutGroup id="game-showcase">
              <div
                data-game-stage
                ref={stageRef}
                onPointerEnter={enterStage}
                onPointerLeave={leaveStage}
                className="relative mx-auto h-[700px] w-[min(1240px,94vw)]"
              >
                <div className="absolute left-1/2 top-[90px] z-20 -translate-x-1/2">
                  <ConsoleCard
                    expanded={expanded}
                    activeIndex={activeIndex}
                    onClose={closePlayer}
                  />
                </div>

                <motion.div
                  animate={{ opacity: expanded ? 0 : 1, y: expanded ? 8 : 0 }}
                  transition={{ duration: 0.22 }}
                  className="pointer-events-none absolute left-1/2 top-[455px] z-30 -translate-x-1/2"
                >
                  <span className="ep-glass-pill whitespace-nowrap">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-ep-accent ring-1 ring-ep-ink"
                      style={{ animation: 'ep-dot-pulse 1.2s ease-in-out infinite' }}
                    />
                    HOVER TO RELEASE FOUR WORLDS
                  </span>
                </motion.div>

                {SHOWCASE_GAMES.map((game, index) => {
                  const target = FAN[index]
                  const hovered = hoveredIndex === index
                  const selected = activeIndex === index
                  const dimmed =
                    hoveredIndex !== null ? !hovered : activeIndex !== null && !selected
                  return (
                    <motion.button
                      data-game-index={index}
                      key={game.title}
                      type="button"
                      layoutId={`showcase-window-${index}`}
                      onPointerEnter={() => setHoveredIndex(index)}
                      onPointerLeave={() => setHoveredIndex(null)}
                      onFocus={() => {
                        setExpanded(true)
                        setHoveredIndex(index)
                      }}
                      onBlur={() => setHoveredIndex(null)}
                      onClick={() => selectGame(index)}
                      aria-label={`Watch ${game.title} gameplay`}
                      initial={false}
                      animate={
                        expanded
                          ? {
                              x: target.fx * stageWidth - DESKTOP_WINDOW_HALF_WIDTH,
                              y: target.y + (hovered ? -16 : selected ? -8 : 0),
                              rotate: hovered ? 0 : target.rotate,
                              scale: hovered ? 1.055 : selected ? 1.025 : 1,
                              opacity: 1,
                            }
                          : {
                              x: -DESKTOP_WINDOW_HALF_WIDTH,
                              y: 238,
                              rotate: 0,
                              scale: 0.48,
                              opacity: 0,
                            }
                      }
                      transition={{
                        ...SPRING,
                        delay: expanded ? index * 0.1 : (SHOWCASE_GAMES.length - 1 - index) * 0.05,
                      }}
                      style={{
                        zIndex: hovered ? 60 : selected ? 55 : 30 + index,
                        pointerEvents: expanded ? 'auto' : 'none',
                      }}
                      className="absolute left-1/2 top-[260px] -translate-x-1/2 cursor-pointer text-left outline-none"
                    >
                      <GameWindow index={index} hovered={hovered || selected} dimmed={dimmed} />
                    </motion.button>
                  )
                })}
              </div>
            </LayoutGroup>
          ) : (
            <div className="relative mx-auto min-h-[560px] w-[min(500px,94vw)]">
              <div className="flex justify-center">
                <ConsoleCard
                  expanded={expanded}
                  activeIndex={activeIndex}
                  onClick={() => setExpanded((value) => !value)}
                  onClose={closePlayer}
                />
              </div>
              <motion.div animate={{ opacity: expanded ? 0 : 1 }} className="mt-2 flex justify-center">
                <span className="ep-glass-pill">TAP TO RELEASE FOUR WORLDS</span>
              </motion.div>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
                  >
                    {SHOWCASE_GAMES.map((game, index) => (
                      <motion.button
                        key={game.title}
                        type="button"
                        initial={{ opacity: 0, y: 28, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ ...SPRING, delay: index * 0.1 }}
                        onClick={() => selectGame(index)}
                        className="cursor-pointer [&>div]:w-full"
                      >
                        <GameWindow index={index} hovered={false} dimmed={false} />
                      </motion.button>
                    ))}
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
