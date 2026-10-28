"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll";

type Options = {
  /** Extra tweens, placed on the chapter timeline where 0 is the start and 1 the end. */
  build?: (tl: gsap.core.Timeline, section: HTMLElement) => void;
  onUpdate?: (progress: number, self: ScrollTrigger) => void;
  scrub?: boolean | number;
};

/**
 * Ties a tall section to one scrubbed timeline.
 *
 * Text written as `<p data-beat data-in="0.2" data-out="0.35">` fades in at 20% of the
 * chapter and out at 35%. Leave out `data-out` to keep it. The returned ref always holds
 * the chapter's progress (0–1), which the 3D scenes read every frame.
 */
export function useChapter(ref: RefObject<HTMLElement | null>, options: Options = {}) {
  const progress = useRef(0);
  const onUpdate = useRef(options.onUpdate);
  useEffect(() => {
    onUpdate.current = options.onUpdate;
  });

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const shift = prefersReducedMotion() ? 0 : 18;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: options.scrub ?? 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            onUpdate.current?.(self.progress, self);
          },
          onRefresh: (self) => {
            progress.current = self.progress;
          },
        },
      });
      // Pin the timeline's length to exactly 1 so positions read as chapter progress.
      tl.set({}, {}, 1);

      section.querySelectorAll<HTMLElement>("[data-beat]").forEach((el) => {
        const start = parseFloat(el.dataset.in ?? "0");
        const end = el.dataset.out === undefined ? null : parseFloat(el.dataset.out);
        const fade = parseFloat(el.dataset.fade ?? "0.025");
        if (start <= 0) {
          gsap.set(el, { autoAlpha: 1 });
        } else {
          tl.fromTo(
            el,
            { autoAlpha: 0, y: shift },
            { autoAlpha: 1, y: 0, duration: fade, immediateRender: true },
            start,
          );
        }
        if (end !== null) tl.to(el, { autoAlpha: 0, y: -shift, duration: fade }, end);
      });

      options.build?.(tl, section);
    },
    { scope: ref },
  );

  return progress;
}
