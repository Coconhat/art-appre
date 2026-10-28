/**
 * Seeded random numbers. Every scene is generated from a fixed seed, so the
 * artwork is the same on every screen and in every rehearsal.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Eases a scene toward the scroll position. A big gap means a jump (the chapter list, a
 * reload mid-chapter), and the scene cuts straight there instead of flying the whole way.
 */
export function follow(current: number, target: number, lambda: number, dt: number) {
  if (Math.abs(target - current) > 0.12) return target;
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
