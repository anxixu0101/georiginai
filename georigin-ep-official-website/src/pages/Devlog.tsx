import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Parallax from '@/components/Parallax'
import Reveal from '@/components/Reveal'
import SubscribeForm from '@/components/SubscribeForm'
import { POSTS } from '@/lib/posts'

gsap.registerPlugin(ScrollTrigger)

const HERO_GRADIENT = 'linear-gradient(180deg, #f2f2f0 0%, #ececea 60%, #e9e9e7 100%)'

/* ------------------------------------------------------------------ */
/* Workbench timeline: the rail draws itself on scroll (scaleY scrub), */
/* nodes pop in with a spring, cards slide in from the left.          */
/* ------------------------------------------------------------------ */

function Timeline() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('[data-rail]'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 55%', scrub: true },
        },
      )
      el.querySelectorAll('[data-entry]').forEach((entry) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: entry, start: 'top 80%', once: true },
        })
        tl.fromTo(
          entry.querySelector('[data-entry-card]'),
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        ).fromTo(
          entry.querySelector('[data-entry-node]'),
          { scale: 0 },
          { scale: 1, duration: 0.6, ease: 'back.out(2.2)' },
          0.15,
        )
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="relative mx-auto max-w-[860px] pl-12">
      {/* Rail */}
      <span
        data-rail
        aria-hidden="true"
        className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-ep-line"
      />

      <div className="space-y-16">
        {POSTS.map((post) => (
          <article data-entry key={post.slug} className="relative">
            {/* Node pinned to the rail (rail center: -42px rel. to entry) */}
            <span
              data-entry-node
              aria-hidden="true"
              className="absolute -left-12 top-[34px] h-3 w-3 bg-ep-accent shadow-[0_0_0_1px_#141414]"
            />
            <div
              data-entry-card
              className="group relative overflow-hidden rounded-[18px] bg-white p-8 shadow-[0_24px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-ep-accent transition-transform duration-300 group-hover:scale-x-100"
              />
              <span className="inline-block rounded-full border border-ep-line bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ep-muted">
                {post.date}
              </span>
              <h2 className="mt-4 font-archivo text-[24px] font-extrabold leading-snug tracking-[-0.01em] text-ep-ink">
                {post.title}
              </h2>
              <p className="mt-3 font-grotesk text-[16px] leading-[1.75] text-ep-body">
                {post.excerpt}
              </p>
              <Link
                to={`/devlog/${post.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-ep-ink underline decoration-ep-accent decoration-2 underline-offset-4"
              >
                READ THE NOTE →
              </Link>
              <p className="mt-6 border-t border-ep-line/60 pt-4 font-mono text-[10.5px] tracking-[0.14em] text-ep-muted">
                GEORIGIN WORKBENCH · EP
              </p>
            </div>
          </article>
        ))}

        {/* End-of-timeline marker */}
        <div data-entry className="relative">
          <span
            data-entry-node
            aria-hidden="true"
            className="absolute -left-12 top-[34px] h-3 w-3 border border-dashed border-ep-muted bg-transparent"
          />
          <div
            data-entry-card
            className="flex items-center justify-center gap-3 rounded-[18px] border-2 border-dashed border-ep-line p-8"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-ep-accent"
              style={{ animation: 'ep-dot-pulse 1.2s ease-in-out infinite' }}
            />
            <span className="font-mono text-[12px] tracking-[0.14em] text-ep-muted">
              NEXT NOTE · IN PROGRESS…
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Devlog() {
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
          <span className="ep-watermark">NOTES</span>
        </Parallax>

        <Reveal className="relative z-10 mx-auto max-w-ep" stagger={0.12} y={30}>
          <p data-reveal-item className="ep-eyebrow">
            GEORIGIN · BUILD LOG
          </p>
          <h1
            data-reveal-item
            className="mt-7 font-archivo text-[clamp(44px,4.8vw,76px)] font-black leading-[0.96] tracking-[-0.03em] text-ep-ink"
          >
            Built in
            <br />
            <span className="hl">public.</span>
          </h1>
          <p
            data-reveal-item
            className="mt-7 max-w-[52ch] font-grotesk text-[16.5px] leading-[1.75] text-ep-body"
          >
            Easing-Point is a small machine made by a small team. These are the notes from the
            workbench — prototypes, deadlines, and the occasional public-restaurant assembly
            session.
          </p>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Timeline                                                    */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-ep-base px-6 py-[110px]">
        <Timeline />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Subscribe band                                              */}
      {/* ---------------------------------------------------------- */}
      <section
        className="relative overflow-hidden px-6 py-[100px]"
        style={{ background: HERO_GRADIENT }}
      >
        <Reveal className="relative z-10 mx-auto max-w-[640px] text-center" stagger={0.15}>
          <p data-reveal-item className="ep-eyebrow justify-center">
            GET EVERY NOTE
          </p>
          <h2
            data-reveal-item
            className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
          >
            Read the next one
            <br />
            <span className="hl">first.</span>
          </h2>
          <p
            data-reveal-item
            className="mx-auto mt-6 max-w-[52ch] font-grotesk text-[16.5px] leading-[1.75] text-ep-body"
          >
            Subscribers get every build note by email — plus the Kickstarter early-bird price on
            launch day.
          </p>
          <div data-reveal-item className="mx-auto mt-10 max-w-[480px] text-left">
            <SubscribeForm idPrefix="devlog" microcopy="No spam. Just build notes and launch day." />
          </div>
        </Reveal>
      </section>
    </>
  )
}
