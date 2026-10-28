"use client";

import { useEffect, useRef, type RefObject } from "react";
import { clamp01, follow } from "@/lib/random";
import { prefersReducedMotion } from "@/lib/scroll";

export type Ring = {
  label: string;
  /** Chapter progress at which this ring is struck. */
  at: number;
  /** Final radius as a share of the shorter screen side; Infinity runs past every corner. */
  radius: number;
};

/**
 * A stone dropped into oil. Each ring of the ripple is one circle of the war's cost:
 * Gaza at the centre, then the Red Sea, Hormuz, the world, the Philippines, and the
 * last ring, which crosses the whole screen and reaches whoever is looking at it.
 */
export function Ripples({ progress, rings }: { progress: RefObject<number>; rings: Ring[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    const family = getComputedStyle(canvas).fontFamily || "Georgia, serif";
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let smooth = 0;
    let last = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const ring = (x: number, y: number, r: number, alpha: number, width: number) => {
      ctx.strokeStyle = `rgba(240, 185, 101, ${alpha})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
      ctx.stroke();
    };

    const draw = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000 || 0.016);
      last = time;
      smooth = follow(smooth, progress.current ?? 0, 4, dt);
      const p = smooth;
      const wide = w >= 768;
      const ox = wide ? w * 0.66 : w * 0.5;
      const oy = wide ? h * 0.5 : h * 0.3;
      const base = Math.min(w, h);
      const far = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) * 1.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, w, h);
      // the faint lamp-coloured sheen of light on a dark liquid
      const sheen = ctx.createRadialGradient(ox, oy, 0, ox, oy, far);
      sheen.addColorStop(0, "rgba(240, 185, 101, 0.07)");
      sheen.addColorStop(0.5, "rgba(240, 185, 101, 0.015)");
      sheen.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);

      // the drop
      const drop = clamp01((p - 0.07) / 0.06);
      if (drop > 0) {
        ctx.fillStyle = `rgba(255, 226, 170, ${0.4 + 0.6 * (1 - drop * 0.5)})`;
        ctx.beginPath();
        ctx.arc(ox, oy, 2.5 + (1 - drop) * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      let newest = -1;
      let outer = 0;
      rings.forEach((r, i) => {
        if (p >= r.at) newest = i;
        const grow = clamp01((p - r.at) / 0.08);
        const eased = 1 - Math.pow(1 - grow, 3);
        if (r.radius !== Infinity) outer = Math.max(outer, eased * r.radius * base);
      });

      // the surface keeps moving: small waves keep leaving the centre
      if (!reduce && drop >= 1) {
        for (let k = 0; k < 3; k++) {
          const phase = (time / 4600 + k / 3) % 1;
          ring(ox, oy, phase * Math.max(outer, base * 0.06), 0.16 * (1 - phase), 1);
        }
      }

      rings.forEach((r, i) => {
        const grow = clamp01((p - r.at) / 0.08);
        if (grow <= 0) return;
        const eased = 1 - Math.pow(1 - grow, 3);
        const radius = eased * (r.radius === Infinity ? far : r.radius * base);
        const isNew = i === newest;
        const alpha = isNew ? 0.95 : 0.38;
        ring(ox, oy, radius, alpha, isNew ? 2 : 1.1);
        // a softer echo just inside each ring
        ring(ox, oy, radius * 0.94, alpha * 0.25, 1);

        if (r.radius === Infinity) return;
        const angle = wide ? -0.62 : -1.32;
        const lx = ox + radius * Math.cos(angle);
        const ly = oy + radius * Math.sin(angle);
        ctx.fillStyle = `rgba(240, 185, 101, ${alpha})`;
        ctx.beginPath();
        ctx.arc(lx, ly, isNew ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(230, 224, 212, ${isNew ? 1 : 0.55})`;
        ctx.font = `italic ${isNew ? 17 : 14}px ${family}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(r.label, lx + 10, ly - 8);
      });
    };

    const loop = (time: number) => {
      draw(time);
      if (running) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [progress, rings]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
