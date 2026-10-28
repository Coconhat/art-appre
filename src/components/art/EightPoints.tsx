import { starPath } from "./Tatreez";

/** The Philippine sun: eight primary rays, each a long ray between two short ones. */
function sunPath() {
  let d = "";
  for (let i = 0; i < 8; i++) {
    const base = (i * Math.PI) / 4;
    for (const [offset, length, half] of [
      [0, 84, 0.075],
      [0.17, 66, 0.05],
      [-0.17, 66, 0.05],
    ] as const) {
      const a = base + offset;
      const tip = [Math.cos(a) * length, Math.sin(a) * length];
      const l = [Math.cos(a - half) * 30, Math.sin(a - half) * 30];
      const r = [Math.cos(a + half) * 30, Math.sin(a + half) * 30];
      d += `M${l[0].toFixed(2)} ${l[1].toFixed(2)}L${tip[0].toFixed(2)} ${tip[1].toFixed(2)}L${r[0].toFixed(2)} ${r[1].toFixed(2)}Z`;
    }
  }
  return d;
}

const SUN = sunPath();
const STAR = starPath(6);

/**
 * Two eight-pointed stars: the sun of the Philippine flag, drawn in light, and the
 * tatreez star, drawn in thread. The chapter slides them together until they share a centre.
 */
export function EightPoints({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-260 -120 520 240" className={className} aria-hidden>
      <g data-sun transform="translate(-120 0)">
        <g data-sun-spin>
          <path d={SUN} fill="var(--color-sun)" />
          <circle r="26" fill="var(--color-sun)" />
        </g>
      </g>
      <g data-star transform="translate(120 0)">
        <g transform="scale(9)">
          <path d={STAR} stroke="var(--color-thread)" strokeWidth={0.2} strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  );
}
