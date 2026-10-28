"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, scroll } from "@/lib/scroll";
import { store } from "@/lib/store";

/** Weighted scrolling, so the piece is read at walking pace rather than flicked through. */
export function SmoothScroll() {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.85, autoRaf: false });
    scroll.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Held still until the 3D scenes are ready (see LoadGate).
    if (!store.get().ready) lenis.stop();
    const unsubscribe = store.subscribe(() => {
      if (store.get().ready && lenis.isStopped) lenis.start();
    });

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);

  return null;
}
