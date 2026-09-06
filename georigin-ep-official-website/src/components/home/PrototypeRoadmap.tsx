import Reveal from '@/components/Reveal'

const V1_POINTS = [
  { title: 'CORE INTERACTION VALIDATED' },
  { title: 'CURRENT HARDWARE SHOWN ON THIS SITE' },
  { title: 'NOT THE FINAL RETAIL VERSION' },
]

const V2_POINTS = [
  {
    title: '70 × 50 MM COMPACT BODY',
    description:
      'V2 is designed around a 70 mm × 50 mm footprint for a smaller, more pocketable form.',
  },
  {
    title: 'A CUSTOM PIXEL PET WORLD',
    description:
      'A new pixel-pet game is being created specifically for Easing-Point and its unique control.',
  },
  {
    title: 'MILLIMETER-WAVE MOTION INPUT',
    description:
      'An integrated millimeter-wave radar sensor introduces touch-free gestures as a new way to play.',
  },
]

type StatusPoint = {
  title: string
  description?: string
}

function StatusCard({
  version,
  status,
  points,
  future = false,
}: {
  version: string
  status: string
  points: StatusPoint[]
  future?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden border-2 p-6 md:p-8 ${
        future
          ? 'border-ep-ink bg-ep-ink text-white shadow-[0_26px_60px_rgba(0,0,0,0.18)]'
          : 'border-ep-ink bg-white text-ep-ink shadow-[0_20px_48px_rgba(0,0,0,0.1)]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-mono text-[10px] tracking-[0.2em] ${future ? 'text-white/58' : 'text-ep-muted'}`}>
            EASING-POINT
          </p>
          <h3 className="mt-2 font-archivo text-[clamp(34px,4vw,54px)] font-black leading-none">
            {version}
          </h3>
        </div>
        <span
          className={`border px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] ${
            future
              ? 'border-ep-accent bg-ep-accent text-ep-ink'
              : 'border-ep-ink bg-white text-ep-ink'
          }`}
        >
          {status}
        </span>
      </div>

      <div className={`my-6 h-px ${future ? 'bg-white/20' : 'bg-ep-line'}`} />

      <ul className="space-y-4">
        {points.map((point) => (
          <li key={point.title} className="flex items-start gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 flex-none border ${
                future ? 'border-ep-accent bg-ep-accent' : 'border-ep-ink bg-ep-accent'
              }`}
            />
            <div>
              <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em]">
                {point.title}
              </p>
              {point.description && (
                <p
                  className={`mt-1.5 font-grotesk text-[13px] leading-[1.55] ${
                    future ? 'text-white/65' : 'text-ep-body'
                  }`}
                >
                  {point.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PrototypeRoadmap() {
  return (
    <section id="development" className="border-y border-ep-line bg-ep-base px-6 py-[110px]">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]" stagger={0.1}>
          <div data-reveal-item>
            <p className="ep-eyebrow">DEVELOPMENT STATUS</p>
            <h2 className="mt-6 font-archivo text-[clamp(40px,5vw,68px)] font-black leading-[0.96] tracking-[-0.025em] text-ep-ink">
              V1 works.
              <br />
              <span className="hl">V2 goes further.</span>
            </h2>
          </div>
          <div data-reveal-item className="max-w-[62ch] lg:pb-1">
            <p className="font-grotesk text-[17px] leading-[1.8] text-ep-body">
              The hardware shown on this site is Easing-Point V1 — a fully working development
              prototype, not the final retail product.
            </p>
            <p className="mt-4 font-grotesk text-[17px] leading-[1.8] text-ep-body">
              V1 proved the core idea: one screen, one spring-loaded knob, and many ways to play.
              V2 is now in development with a smaller form, more refined hardware, and a broader
              range of gameplay.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14 grid gap-5 md:grid-cols-2" stagger={0.12}>
          <div data-reveal-item>
            <StatusCard version="V1" status="WORKING PROTOTYPE" points={V1_POINTS} />
          </div>
          <div data-reveal-item>
            <StatusCard version="V2" status="IN DEVELOPMENT" points={V2_POINTS} future />
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 border border-ep-ink bg-ep-accent px-5 py-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-ep-ink">
            THIS SITE AND ALL GAMEPLAY VIDEOS WILL BE UPDATED WHEN V2 IS READY.
          </p>
          <a
            href="#contact"
            className="whitespace-nowrap border border-ep-ink bg-ep-ink px-4 py-2 font-mono text-[10px] font-bold tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5"
          >
            GET V2 UPDATES
          </a>
        </div>
      </div>
    </section>
  )
}
