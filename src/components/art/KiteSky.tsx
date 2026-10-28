"use client";

import { useEffect, useRef, useState } from "react";
import { ChildFromBehind } from "./ChildFromBehind";
import { prefersReducedMotion } from "@/lib/scroll";

type Point = { x: number; y: number; px: number; py: number };
type Flown = { x: number; y: number; vx: number; vy: number; rot: number; name: string; tail: Point[] };

const FLAG = { black: "#000000", white: "#ffffff", green: "#007a3d", red: "#ce1126" };
const TAIL = 14;

/**
 * A sky with nothing in it but kites. The child from the walk holds the string; the visitor
 * flies the kite with the pointer (or the arrow keys), can give it a name to carry, and let it go.
 */
export function KiteSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const release = useRef<(name: string) => void>(() => {});
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    // canvas text cannot read CSS variables, so take the resolved font stack from the page
    const family = getComputedStyle(canvas).fontFamily || "Georgia, serif";
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastPointer = 0;
    const target = { x: 0, y: 0 };
    const kite = { x: 0, y: 0, vx: 0, vy: 0, rot: 0 };
    let tail: Point[] = [];
    const flown: Flown[] = [];

    const hand = () => {
      const c = canvas.getBoundingClientRect();
      const r = childRef.current?.getBoundingClientRect();
      if (!r) return { x: w / 2, y: h * 0.85 };
      return { x: r.left - c.left + r.width * 0.5, y: r.top - c.top + r.height * (177 / 300) };
    };

    const resetTail = () => {
      tail = Array.from({ length: TAIL }, (_, i) => ({ x: kite.x, y: kite.y + 40 + i * 9, px: kite.x, py: kite.y + 40 + i * 9 }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!kite.x) {
        kite.x = w * 0.62;
        kite.y = h * 0.3;
        target.x = kite.x;
        target.y = kite.y;
        resetTail();
      }
    };

    const size = () => Math.max(46, Math.min(w, h) * 0.085);

    const drawKite = (x: number, y: number, rot: number, s: number, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);
      const top = [0, -s];
      const right = [s * 0.68, -s * 0.18];
      const bottom = [0, s * 1.15];
      const left = [-s * 0.68, -s * 0.18];
      const mid = [0, -s * 0.18];
      const tri = (a: number[], b: number[], c: number[], color: string) => {
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      tri(top, mid, left, FLAG.black);
      tri(top, right, mid, FLAG.white);
      tri(left, mid, bottom, FLAG.green);
      tri(mid, right, bottom, FLAG.red);
      ctx.strokeStyle = "rgba(28,27,25,0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.closePath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(bottom[0], bottom[1]);
      ctx.moveTo(left[0], left[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.stroke();
      ctx.restore();
    };

    const stepTail = (points: Point[], ax: number, ay: number, wind: number) => {
      points[0].x = ax;
      points[0].y = ay;
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const vx = (p.x - p.px) * 0.96 + wind;
        const vy = (p.y - p.py) * 0.96 + 0.35;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
      }
      for (let k = 0; k < 3; k++) {
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1];
          const b = points[i];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const diff = (d - 9) / d;
          b.x -= dx * diff;
          b.y -= dy * diff;
        }
      }
    };

    const drawTail = (points: Point[], alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(28,27,25,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      points.forEach((p, i) => {
        if (i % 3 !== 2) return;
        ctx.fillStyle = i % 2 ? FLAG.red : FLAG.green;
        ctx.beginPath();
        ctx.moveTo(p.x - 7, p.y - 4);
        ctx.lineTo(p.x, p.y);
        ctx.lineTo(p.x - 7, p.y + 4);
        ctx.moveTo(p.x + 7, p.y - 4);
        ctx.lineTo(p.x, p.y);
        ctx.lineTo(p.x + 7, p.y + 4);
        ctx.fill();
      });
      ctx.restore();
    };

    release.current = (label: string) => {
      flown.push({ x: kite.x, y: kite.y, vx: kite.vx + 0.6, vy: -1.2, rot: kite.rot, name: label.trim(), tail: tail.map((p) => ({ ...p })) });
      kite.y = h * 0.92;
      kite.x = hand().x + 20;
      resetTail();
      lastPointer = 0;
    };

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const s = size();
      const wind = Math.sin(t * 0.0004) * 0.18 + 0.12;

      // when nobody steers, the kite flies itself
      if (t - lastPointer > 2500) {
        target.x = w * (0.58 + Math.sin(t * 0.00031) * 0.18);
        target.y = h * (0.28 + Math.sin(t * 0.00047) * 0.09);
      }
      const k = reduce ? 0.02 : 0.035;
      kite.vx = (kite.vx + (target.x - kite.x) * k) * 0.86;
      kite.vy = (kite.vy + (target.y - kite.y) * k) * 0.86;
      kite.x += kite.vx;
      kite.y += kite.vy;
      kite.rot = kite.rot * 0.9 + (kite.vx * 0.02 + Math.sin(t * 0.0021) * 0.05) * 0.1;

      // flown kites rise and drift away with their names
      for (let i = flown.length - 1; i >= 0; i--) {
        const f = flown[i];
        f.vx = f.vx * 0.99 + wind * 0.06;
        f.vy = f.vy * 0.99 - 0.02;
        f.x += f.vx;
        f.y += f.vy;
        f.rot = Math.sin(t * 0.0018 + i) * 0.18;
        stepTail(f.tail, f.x, f.y + s * 1.1, wind);
        const fade = Math.min(1, Math.max(0, (f.y + 200) / 260));
        drawTail(f.tail, fade);
        drawKite(f.x, f.y, f.rot, s * 0.85, fade);
        if (f.name) {
          ctx.globalAlpha = fade;
          ctx.fillStyle = "#1c1b19";
          ctx.font = `italic ${Math.round(s * 0.34)}px ${family}`;
          ctx.textAlign = "center";
          ctx.fillText(f.name, f.x, f.y - s * 1.25);
          ctx.globalAlpha = 1;
        }
        if (f.y < -320) flown.splice(i, 1);
      }

      // the string, from the child's hands
      const from = hand();
      ctx.strokeStyle = "rgba(28,27,25,0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo((from.x + kite.x) / 2 + 40, (from.y + kite.y) / 2 + 60, kite.x, kite.y + s * 0.4);
      ctx.stroke();

      stepTail(tail, kite.x, kite.y + s * 1.1, wind);
      drawTail(tail);
      drawKite(kite.x, kite.y, kite.rot, s);
    };

    const loop = (t: number) => {
      frame(t);
      if (running) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      target.x = Math.min(w - 40, Math.max(40, e.clientX - r.left));
      target.y = Math.min(h * 0.62, Math.max(60, e.clientY - r.top));
      lastPointer = performance.now();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!running || e.target instanceof HTMLInputElement) return;
      const step = 40;
      if (e.key === "ArrowLeft") target.x -= step;
      else if (e.key === "ArrowRight") target.x += step;
      else if (e.key === "ArrowUp") target.y -= step;
      else if (e.key === "ArrowDown") target.y += step;
      else return;
      e.preventDefault();
      target.x = Math.min(w - 40, Math.max(40, target.x));
      target.y = Math.min(h * 0.62, Math.max(60, target.y));
      lastPointer = performance.now();
    };

    resize();
    frame(0);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative h-[115svh] min-h-[640px] overflow-hidden bg-[#c7dbe2] text-ink">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="A kite in the colours of the Palestinian flag flying in an open sky, held on a string by the child seen from behind. Kites you let go drift away with the names you gave them."
      />
      <div ref={childRef} className="absolute bottom-[6svh] left-1/2 h-[clamp(9rem,20svh,13rem)] -translate-x-1/2">
        <ChildFromBehind className="h-full w-auto text-ink" />
      </div>

      <div className="frame relative z-10 pt-[16svh]">
        <h3 className="t-headline italic">Fly one for Gaza.</h3>
        <blockquote className="t-statement mt-6 max-w-[30ch]">
          “If I must die, you must live to tell my story.”
          <footer className="t-small mt-2 not-italic">Refaat Alareer, 1979–2023</footer>
        </blockquote>
        <form
          className="mt-8 flex max-w-[28rem] flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            release.current(name);
            setName("");
            setCount((n) => n + 1);
          }}
        >
          <label className="t-small flex min-w-[14rem] flex-1 flex-col gap-1.5">
            A name for your kite to carry (optional)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={28}
              className="t-body border-0 border-b-2 border-ink/60 bg-transparent px-0 py-1.5 text-ink outline-none placeholder:text-ink/45 focus:border-ink"
              placeholder="Someone you love, or someone lost"
            />
          </label>
          <button
            type="submit"
            className="t-body cursor-pointer bg-ink px-5 py-2.5 text-paper transition hover:bg-[#33302c] active:translate-y-px"
          >
            Let it fly
          </button>
        </form>
        <p className="t-small mt-3 italic" aria-live="polite">
          {count === 0 ? "Move your pointer, or use the arrow keys, to fly it." : `${count} ${count === 1 ? "kite" : "kites"} flown from here.`}
        </p>
      </div>
    </div>
  );
}
