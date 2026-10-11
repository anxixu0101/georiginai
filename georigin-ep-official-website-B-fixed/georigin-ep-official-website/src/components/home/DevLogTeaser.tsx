import { Link } from "react-router";
import { POSTS } from "@/lib/posts";

export default function DevLogTeaser() {
  return (
    <section
      id="notes"
      className="ep-landing-devlog"
      aria-labelledby="ep-devlog-title"
    >
      <div className="ep-landing-container">
        <div className="ep-devlog-heading">
          <h2 id="ep-devlog-title">From the development log</h2>
          <Link to="/devlog" className="ep-landing-text-link">
            All updates <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="ep-devlog-rows">
          {POSTS.slice(0, 2).map(entry => (
            <li key={entry.slug}>
              <Link to={`/devlog/${entry.slug}`} className="ep-devlog-row">
                <time dateTime={entry.date}>
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(`${entry.date}T00:00:00Z`))}
                </time>
                <h3>
                  {entry.title.replace(
                    /(?:Easing-Point\s*)?[12]\.0\s*:?\s*/gi,
                    ""
                  )}
                </h3>
                <span className="ep-devlog-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
