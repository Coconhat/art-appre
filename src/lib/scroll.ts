import type Lenis from "lenis";

/** The smooth-scroll instance, when one is running (it is skipped for reduced motion). */
export const scroll: { lenis: Lenis | null } = { lenis: null };

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToTarget(target: string | HTMLElement) {
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (scroll.lenis) {
    scroll.lenis.scrollTo(el, { duration: 1.8 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}
