import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

/** Smooth-scroll to an in-page anchor via Lenis (falls back to native). */
export function scrollToAnchor(hash: string) {
  let anchor: string;
  try {
    anchor = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return;
  }
  const el = document.getElementById(anchor);
  if (!el) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (lenisInstance && !reduceMotion) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: -60, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
}
