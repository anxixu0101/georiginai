import { useEffect, useRef, useState } from "react";
import { GAMEPLAY_VIDEO_ID, GAMEPLAY_VIDEO_URL } from "@/lib/site";

/** Load the real YouTube player only after the visitor chooses to watch. */
export default function GameplayVideo() {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  return (
    <section
      id="games"
      className="ep-gameplay"
      aria-labelledby="ep-gameplay-title"
    >
      <div className="ep-landing-container ep-demo-layout">
        <div className="ep-gameplay-stage">
          {playing ? (
            <iframe
              ref={player}
              src={`https://www.youtube-nocookie.com/embed/${GAMEPLAY_VIDEO_ID}?autoplay=1&playsinline=1&rel=0`}
              title="Easing-Point — Early Prototype Demo"
              className="ep-gameplay-player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              className="ep-gameplay-poster"
              onClick={() => setPlaying(true)}
              aria-label="Play the early prototype demo"
            >
              <img
                src="/assets/ep-v1-gameplay.jpg"
                alt="Early Easing-Point prototypes with pixel displays and left/right switches"
                width="1280"
                height="720"
                loading="lazy"
              />
              <span className="ep-gameplay-play" aria-hidden="true">
                <svg width="25" height="28" viewBox="0 0 25 28" fill="none">
                  <path d="M3 2L23 14L3 26V2Z" fill="currentColor" />
                </svg>
              </span>
              <span className="ep-gameplay-prompt">See it in action</span>
            </button>
          )}
        </div>
        <div className="ep-gameplay-caption">
          <div>
            <p className="ep-section-eyebrow">Early Prototype Demo</p>
            <h2 id="ep-gameplay-title">See what one switch can do.</h2>
            <p>
              On our early prototype, a simple left/right movement already
              controls a range of playable demos.
            </p>
            <p>Watch these experiments running on real hardware.</p>
            <p className="ep-demo-disclaimer">
              The prototype shown is not for sale.
            </p>
          </div>
          <a
            className="ep-gameplay-external"
            href={GAMEPLAY_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
