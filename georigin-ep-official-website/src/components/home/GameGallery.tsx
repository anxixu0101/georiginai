import Reveal from '@/components/Reveal'
import Parallax from '@/components/Parallax'
import GameCard from '@/components/GameCard'
import { GAMES } from '@/lib/site'
import { useMediaQuery } from '@/hooks/use-media-query'

export default function GameGallery() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <section className="bg-ep-base px-6 pb-[110px]">
      <Reveal className="mx-auto max-w-[720px] text-center" stagger={0.1}>
        <p data-reveal-item className="ep-eyebrow justify-center">
          FOUR WORLDS · AND COUNTING
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          Strange, beautiful,
          <br />
          <span className="hl">pocket-sized.</span>
        </h2>
      </Reveal>

      <Reveal
        className="mx-auto mt-14 grid max-w-[1180px] grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.1}
        y={40}
        start="top 85%"
      >
        {GAMES.map((game, i) => {
          const lagging = isDesktop && (i === 1 || i === 2)
          return (
            <div data-reveal-item key={game.title}>
              {lagging ? (
                <Parallax drift={30}>
                  <GameCard title={game.title} tag={game.tag} image={game.image} />
                </Parallax>
              ) : (
                <GameCard title={game.title} tag={game.tag} image={game.image} />
              )}
            </div>
          )
        })}
      </Reveal>

      <Reveal className="mt-12 text-center" y={20}>
        <p data-reveal-item className="font-mono text-[12px] tracking-[0.06em] text-ep-muted">
          Every frame above was captured on real hardware. Click any screen to watch it run.
        </p>
      </Reveal>
    </section>
  )
}
