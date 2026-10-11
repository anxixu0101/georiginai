import { scrollToAnchor } from "@/lib/lenis";

export default function PrototypeRoadmap() {
  return (
    <section
      id="development"
      className="ep-next-chapter"
      aria-labelledby="ep-v2-title"
    >
      <div className="ep-landing-container ep-v2-layout">
        <div className="ep-v2-copy">
          <p className="ep-section-eyebrow">Easing-Point · In development</p>
          <h2 id="ep-v2-title">
            From prototype
            <br />
            to product.
          </h2>
          <p className="ep-v2-subtitle">Fuller games. New ideas.</p>
          <p className="ep-v2-description">
            We’re developing the product: refining the hardware, turning these
            demos into fuller games, and creating new games.
          </p>
          <a
            href="#updates"
            className="ep-landing-text-link"
            onClick={event => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              )
                return;
              event.preventDefault();
              scrollToAnchor("#updates");
              window.history.replaceState(window.history.state, "", "#updates");
              document
                .getElementById("hero-email")
                ?.focus({ preventScroll: true });
            }}
          >
            Get launch updates <span aria-hidden="true">→</span>
          </a>
        </div>
        <figure className="ep-v2-figure">
          <div className="ep-v2-image-window">
            <img
              src="/assets/ep-v2-design.webp"
              alt="Detail of the original Easing-Point design render, showing the silver switch and blue enclosure"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>Design preview · In development</figcaption>
        </figure>
      </div>
    </section>
  );
}
