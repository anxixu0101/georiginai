import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getLenis, scrollToAnchor } from "@/lib/lenis";

/* ------------------------------------------------------------------ */
/* Custom 20x20 inline SVG nav icons — static at rest, animate on     */
/* hover/focus (CSS gates in index.css).                              */
/* ------------------------------------------------------------------ */

function JoystickIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 16.5a6 3 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g className="ep-icon-joystick-stick">
        <line
          x1="10"
          y1="16"
          x2="10"
          y2="8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <circle
        className="ep-icon-joystick-ball"
        cx="10"
        cy="6.5"
        r="2.75"
        fill="#FFD21F"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RadarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <g className="ep-icon-radar-sweep">
        <path
          d="M10 10 L10 2.2 A7.8 7.8 0 0 1 15.5 4.6 Z"
          fill="#FFD21F"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
      <circle
        className="ep-icon-radar-blip-a"
        cx="7"
        cy="12"
        r="1.3"
        fill="currentColor"
      />
      <circle
        className="ep-icon-radar-blip-b"
        cx="13"
        cy="12.5"
        r="1.3"
        fill="currentColor"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="4"
        width="10.5"
        height="12"
        rx="2"
        fill="var(--ep-nav-icon-surface, #fff)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        className="ep-icon-note-line"
        x1="5"
        y1="8.5"
        x2="10.5"
        y2="8.5"
        stroke="#FFD21F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="12"
        x2="9"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g className="ep-icon-pencil">
        <path
          d="M12.5 15.5 L16.5 8.5 L18.2 9.8 L14.2 16.8 L11.9 17.6 Z"
          fill="#FFD21F"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <g className="ep-icon-hand-left">
        <path
          d="M2.5 13.5 L6.5 6.5 L9.5 8.5 L7 14 Z"
          fill="var(--ep-nav-icon-surface, #fff)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
      <g className="ep-icon-hand-right">
        <path
          d="M17.5 13.5 L13.5 6.5 L10.5 8.5 L13 14 Z"
          fill="var(--ep-nav-icon-surface, #fff)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
      <path
        className="ep-icon-spark"
        d="M10 1.8 l1 2.1 2.1.8 -2.1.8 -1 2.1 -1 -2.1 -2.1 -.8 2.1 -.8 z"
        fill="#FFD21F"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

type NavKey = "console" | "games" | "notes" | "contact";

const NAV_ITEMS: { key: NavKey; label: string; icon: ComponentType }[] = [
  { key: "console", label: "Console", icon: JoystickIcon },
  { key: "games", label: "Play", icon: RadarIcon },
  { key: "notes", label: "Devlog", icon: PencilIcon },
  { key: "contact", label: "Contact", icon: HandshakeIcon },
];

const ROUTES: Record<NavKey, { homeAnchor: string; href: string }> = {
  console: { homeAnchor: "#console", href: "/#console" },
  games: { homeAnchor: "#games", href: "/games" },
  notes: { homeAnchor: "#notes", href: "/devlog" },
  contact: { homeAnchor: "#contact", href: "/#contact" },
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const previousLocationKey = useRef(location.key);
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Closing also covers navigation triggered outside this component.
  useEffect(() => {
    if (previousLocationKey.current === location.key) return;
    previousLocationKey.current = location.key;
    const frame = window.requestAnimationFrame(() => setOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [location.key]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 960px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const lenis = getLenis();
    const wasStopped = lenis?.isStopped ?? false;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const links = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []
      );
    const focusFirst = () => links()[0]?.focus();
    const frame = window.requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const availableControls: Array<HTMLElement | null> = [
        toggleRef.current,
        ...links(),
      ];
      const controls = availableControls.filter(
        (item): item is HTMLElement => item !== null
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (
        event.shiftKey &&
        (active === first || !controls.includes(active as HTMLElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !controls.includes(active as HTMLElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        target !== toggleRef.current &&
        !menuRef.current?.contains(target)
      ) {
        focusFirst();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      document.body.style.overflow = previousOverflow;
      if (!wasStopped) lenis?.start();
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  const goTo =
    (homeAnchor: string, href: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      setOpen(false);
      // Wait for the menu to close before moving the page underneath it.
      window.requestAnimationFrame(() => {
        if (isHome) {
          getLenis()?.start();
          scrollToAnchor(homeAnchor);
          window.history.replaceState(window.history.state, "", homeAnchor);
        } else {
          navigate(href);
        }
      });
    };

  const go = (key: NavKey) => goTo(ROUTES[key].homeAnchor, ROUTES[key].href);

  return (
    <>
      <header className={`ep-navbar${isHome ? " ep-navbar--dark" : ""}`}>
        <div className="ep-nav-inner">
          <Link
            to="/"
            className="ep-wordmark"
            aria-label="Easing-Point home"
            onClick={() => setOpen(false)}
          >
            <span className="ep-wordmark-dot" aria-hidden="true" />
            <span>Easing-Point</span>
          </Link>

          <nav className="ep-nav-links" aria-label="Primary navigation">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={isHome ? ROUTES[key].homeAnchor : ROUTES[key].href}
                onClick={go(key)}
                className="ep-nav-item ep-nav-link"
              >
                <Icon />
                <span>{label}</span>
              </a>
            ))}
            <a
              href={isHome ? "#updates" : "/#updates"}
              onClick={goTo("#updates", "/#updates")}
              className="ep-nav-update"
            >
              Launch updates ↗
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(value => !value)}
            className="ep-menu-toggle"
          >
            <span
              aria-hidden="true"
              style={{
                background: "currentColor",
                transform: open ? "rotate(45deg)" : "translateY(-4px)",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                background: "currentColor",
                transform: open ? "rotate(-45deg)" : "translateY(4px)",
              }}
            />
          </button>
        </div>
      </header>

      {open && (
        <nav
          ref={menuRef}
          id={menuId}
          className={`ep-nav-overlay${isHome ? " ep-nav-overlay--dark" : ""}`}
          aria-label="Mobile navigation"
        >
          <div className="ep-mobile-links">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={isHome ? ROUTES[key].homeAnchor : ROUTES[key].href}
                onClick={go(key)}
                className="ep-nav-item ep-nav-link"
              >
                <Icon />
                <span>{label}</span>
              </a>
            ))}
            <a
              href={isHome ? "#updates" : "/#updates"}
              onClick={goTo("#updates", "/#updates")}
              className="ep-nav-update"
            >
              Launch updates ↗
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
