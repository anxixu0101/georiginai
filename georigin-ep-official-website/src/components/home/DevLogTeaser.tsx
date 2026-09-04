import { Link } from 'react-router'
import Reveal from '@/components/Reveal'
import { POSTS } from '@/lib/posts'

export default function DevLogTeaser() {
  const latest = POSTS.slice(0, 2)
  return (
    <section id="notes" className="bg-ep-base px-6 py-[110px]">
      <Reveal className="mx-auto max-w-[1180px]" stagger={0.1}>
        <p data-reveal-item className="ep-eyebrow">
          NOTES FROM THE WORKBENCH
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          Built in <span className="hl">public.</span>
        </h2>
      </Reveal>

      <Reveal
        className="mx-auto mt-14 grid max-w-[1180px] grid-cols-1 gap-[22px] md:grid-cols-2"
        stagger={0.12}
        y={40}
      >
        {latest.map((entry) => (
          <article
            data-reveal-item
            key={entry.slug}
            className="group relative overflow-hidden rounded-[18px] bg-white p-7 shadow-[0_24px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:-translate-y-1.5"
          >
            <span className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-ep-accent transition-transform duration-300 group-hover:scale-x-100" />
            <span className="inline-block rounded-full border border-ep-line px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-ep-muted">
              {entry.date}
            </span>
            <h3 className="mt-4 font-archivo text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-ep-ink">
              {entry.title}
            </h3>
            <p className="mt-3 font-grotesk text-[15px] leading-[1.7] text-ep-body">{entry.excerpt}</p>
            <Link
              to={`/devlog/${entry.slug}`}
              className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-ep-ink"
            >
              READ THE NOTE
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </article>
        ))}
      </Reveal>
    </section>
  )
}
