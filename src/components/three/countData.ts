import { FACTS } from "@/content/facts";

export const TOTAL = FACTS.killed;

/** [chapter progress, lights shown]. The count waits at every power of ten so it can be read. */
const KEYS: [number, number][] = [
  [0.04, 0],
  [0.07, 1],
  [0.16, 1],
  [0.2, 10],
  [0.28, 10],
  [0.32, 100],
  [0.4, 100],
  [0.44, 1000],
  [0.52, 1000],
  [0.56, 10000],
  [0.63, 10000],
  [0.68, TOTAL],
];

export function countAt(p: number) {
  if (p <= KEYS[0][0]) return 0;
  for (let i = 1; i < KEYS.length; i++) {
    const [a, av] = KEYS[i - 1];
    const [b, bv] = KEYS[i];
    if (p <= b) {
      const t = (p - a) / (b - a);
      if (av === 0 || bv === av) return av + (bv - av) * t;
      return Math.pow(10, Math.log10(av) + (Math.log10(bv) - Math.log10(av)) * t);
    }
  }
  return TOTAL;
}

/** The children's lights: more than one in five, and smaller. */
export const CHILD_SHARE = FACTS.childrenKilled / FACTS.killed;
