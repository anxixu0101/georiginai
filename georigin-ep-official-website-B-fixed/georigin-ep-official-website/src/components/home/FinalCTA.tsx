import Reveal from '@/components/Reveal'
import SubscribeForm from '@/components/SubscribeForm'

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-[130px]"
      style={{ background: 'linear-gradient(180deg, #f2f2f0 0%, #ececea 60%, #e9e9e7 100%)' }}
    >
      <span
        className="ep-watermark pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none md:block"
        aria-hidden="true"
      >
        JOIN
      </span>

      <Reveal className="relative z-10 mx-auto max-w-[640px] text-center" stagger={0.08}>
        <p data-reveal-item className="ep-eyebrow justify-center">
          V2 DEVELOPMENT · UPDATES
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          Follow what comes
          <br />
          <span className="hl">next.</span>
        </h2>
        <p
          data-reveal-item
          className="mx-auto mt-6 max-w-[52ch] font-grotesk text-[16.5px] leading-[1.75] text-ep-body"
        >
          Get V2 build notes, updated hardware images, and new gameplay footage as the next version
          takes shape.
        </p>
        <div data-reveal-item className="mx-auto mt-10 max-w-[480px] text-left">
          <SubscribeForm idPrefix="cta" buttonLabel="Get V2 Updates" />
          <p className="mt-4 text-center font-mono text-[12px] tracking-[0.06em] text-ep-muted">
            No spam. Just development notes and the eventual launch.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
