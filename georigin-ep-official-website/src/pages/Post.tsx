import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { marked } from 'marked'
import Reveal from '@/components/Reveal'
import { getPost } from '@/lib/posts'

const HERO_GRADIENT = 'linear-gradient(180deg, #f2f2f0 0%, #ececea 60%, #e9e9e7 100%)'

export default function Post() {
  const { slug } = useParams()
  const post = getPost(slug)
  const html = useMemo(
    () => (post ? (marked.parse(post.content, { async: false }) as string) : ''),
    [post],
  )

  if (!post) {
    return (
      <section className="bg-ep-base px-6 py-[150px] text-center">
        <p className="font-mono text-[13px] tracking-[0.14em] text-ep-muted">NOTE NOT FOUND</p>
        <Link
          to="/devlog"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-ep-ink underline decoration-ep-accent decoration-2 underline-offset-4"
        >
          ← BACK TO BUILD LOG
        </Link>
      </section>
    )
  }

  return (
    <>
      {/* ---------------------------------------------------------- */}
      {/* Article header                                              */}
      {/* ---------------------------------------------------------- */}
      <section
        className="relative overflow-hidden px-6 pb-[70px] pt-[150px]"
        style={{ background: HERO_GRADIENT }}
      >
        <Reveal className="relative z-10 mx-auto max-w-[860px]" stagger={0.12} y={30}>
          <p data-reveal-item className="ep-eyebrow">
            GEORIGIN · BUILD LOG
          </p>
          <h1
            data-reveal-item
            className="mt-7 font-archivo text-[clamp(30px,3.6vw,52px)] font-black leading-[1.1] tracking-[-0.02em] text-ep-ink"
          >
            {post.title}
          </h1>
          <span
            data-reveal-item
            className="mt-6 inline-block rounded-full border border-ep-line bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ep-muted"
          >
            {post.date}
          </span>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Article body                                                */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-ep-base px-6 py-[80px]">
        <article
          className="ep-article mx-auto max-w-[760px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="mx-auto mt-16 max-w-[760px] border-t border-ep-line/60 pt-8">
          <Link
            to="/devlog"
            className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-ep-ink underline decoration-ep-accent decoration-2 underline-offset-4"
          >
            ← ALL NOTES
          </Link>
        </div>
      </section>
    </>
  )
}
