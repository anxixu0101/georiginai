import { YOUTUBE_VIDEO_URL } from '@/lib/site'

export interface GameCardProps {
  title: string
  tag: string
  image: string
  href?: string
  showInDevChip?: boolean
}

/**
 * Shared game card (design.md §6.3). The entire card links to the
 * gameplay video. The .ep-frame crop hides the bottom watermark.
 */
export default function GameCard({
  title,
  tag,
  image,
  href = YOUTUBE_VIDEO_URL,
  showInDevChip = true,
}: GameCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group block cursor-pointer rounded-[18px] bg-white p-3 shadow-[0_24px_48px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_60px_rgba(0,0,0,0.2)]"
    >
      <div className="ep-frame relative rounded-[10px]">
        <img
          src={image}
          alt={`${title} gameplay on Easing-Point`}
          loading="lazy"
          className="transition-transform duration-400 ease-out group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-ep-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-ep-accent opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100">
          WATCH ▶
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5 pt-3.5">
        <span className="font-pixel text-[9px] uppercase leading-relaxed text-ep-ink">{title}</span>
        <span className="flex items-center gap-1.5">
          {showInDevChip && (
            <span className="rounded-full border border-ep-line px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-ep-muted">
              IN DEV
            </span>
          )}
          <span className="rounded-full bg-ep-accent px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-ep-ink">
            {tag}
          </span>
        </span>
      </div>
    </a>
  )
}
