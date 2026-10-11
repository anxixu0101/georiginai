import SubscribeForm from "@/components/SubscribeForm";

export default function Hero() {
  return (
    <section
      id="console"
      className="ep-landing-hero"
      aria-labelledby="ep-hero-title"
    >
      <div className="ep-landing-container">
        <div className="ep-hero-grid">
          <div className="ep-hero-copy">
            <p className="ep-landing-status">Coming to Kickstarter</p>
            <h1 id="ep-hero-title" className="ep-landing-title">
              <span>A tiny console.</span>
              <span>A different</span>
              <span>way to play.</span>
            </h1>
            <p className="ep-landing-description">
              Original games, built around a left/right switch.
            </p>
          </div>
          <figure className="ep-hero-product">
            <img
              src="/assets/ep-v2-design.webp"
              width="1536"
              height="1024"
              alt="Easing-Point design preview: blue enclosure, silver left/right switch and display"
              fetchPriority="high"
            />
            <figcaption>Design preview · In development</figcaption>
          </figure>
        </div>
        <div id="updates" className="ep-landing-signup">
          <SubscribeForm
            idPrefix="hero"
            appearance="navy"
            buttonLabel="Notify me at launch →"
            microcopy="Development updates & Kickstarter early-bird alerts."
          />
        </div>
      </div>
    </section>
  );
}
