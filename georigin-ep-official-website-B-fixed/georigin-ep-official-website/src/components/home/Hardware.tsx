import Reveal from '@/components/Reveal'
import SpaceKnobGame from '@/components/home/SpaceKnobGame'

export default function Hardware() {
  return (
    <section id="hardware" className="bg-ep-base px-6 py-[110px]">
      <Reveal className="mx-auto max-w-[1180px]" stagger={0.1}>
        <p data-reveal-item className="ep-eyebrow">
          THE HARDWARE
        </p>
        <h2
          data-reveal-item
          className="mt-6 font-archivo text-[clamp(36px,4vw,60px)] font-black leading-[1.0] tracking-[-0.02em] text-ep-ink"
        >
          One knob.
          <br />
          <span className="hl">Full control.</span>
        </h2>
      </Reveal>

      <div className="mx-auto mt-20 max-w-[1180px]">
        <div className="grid items-center gap-16 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal y={0}>
            <div data-reveal-item>
              <RowA />
            </div>
          </Reveal>
          <Reveal y={0} delay={0.1} className="flex justify-center">
            <div data-reveal-item>
              <SpaceKnobGame />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function RowA() {
  return (
    <>
      <h3 className="font-archivo text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.01em] text-ep-ink">
        A spring-loaded control you can try right here.
      </h3>
      <p className="mt-4 max-w-[48ch] font-grotesk text-[16px] leading-[1.75] text-ep-body">
        Move your mouse over the blue knob, then click and drag. Pull the knob left or right to
        steer. Release it and the control springs back to center—just like the real Easing-Point
        prototype. Dodge incoming fighters while auto-fire clears a path through the stars.
      </p>
    </>
  )
}
