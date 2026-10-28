"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/random";
import { prefersReducedMotion } from "@/lib/scroll";

/**
 * Light through the window of a closed house. The dust is only visible inside the beam,
 * as it is in a room nobody has opened for a long time.
 */
export function DustBeam({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rand = mulberry32(48);
    const reduce = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let beam: [number, number][] = [];
    let raf = 0;
    let running = false;
    const beamLayer = document.createElement("canvas");

    const motes = Array.from({ length: 260 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 1.5,
      vx: (rand() - 0.5) * 0.00012,
      vy: -0.00004 - rand() * 0.00008,
      phase: rand() * Math.PI * 2,
    }));

    const inBeam = (x: number, y: number) => {
      // point-in-polygon for the four-sided beam
      let inside = false;
      for (let i = 0, j = beam.length - 1; i < beam.length; j = i++) {
        const [xi, yi] = beam[i];
        const [xj, yj] = beam[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const narrow = width < 700;
      beam = narrow
        ? [
            [width * 0.55, 0],
            [width * 0.95, 0],
            [width * 0.62, height],
            [width * 0.02, height],
          ]
        : [
            [width * 0.6, 0],
            [width * 0.8, 0],
            [width * 0.5, height],
            [width * 0.16, height],
          ];
      beamLayer.width = canvas.width;
      beamLayer.height = canvas.height;
      const b = beamLayer.getContext("2d")!;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, width, height);
      b.filter = `blur(${Math.round(width * 0.025)}px)`;
      b.fillStyle = "rgba(240, 185, 101, 0.075)";
      b.beginPath();
      beam.forEach(([x, y], i) => (i ? b.lineTo(x, y) : b.moveTo(x, y)));
      b.closePath();
      b.fill();
    };

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(beamLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx + Math.sin(t * 0.0003 + m.phase) * 0.00005;
          m.y += m.vy;
          if (m.y < -0.02) m.y = 1.02;
          if (m.x < -0.02) m.x = 1.02;
          if (m.x > 1.02) m.x = -0.02;
        }
        const x = m.x * width;
        const y = m.y * height;
        if (!inBeam(x, y)) continue;
        const twinkle = 0.45 + 0.55 * Math.sin(t * 0.0012 + m.phase * 3);
        ctx.fillStyle = `rgba(244, 214, 160, ${0.18 + twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
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
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        running = true;
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
  }, []);

  return <canvas ref={ref} aria-hidden className={`h-full w-full ${className}`} />;
}
