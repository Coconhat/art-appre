/**
 * The Gaza Strip, stood upright: north at the top, the sea on the left, Egypt at the bottom.
 * One unit is 100 metres (10 units to a kilometre). The outline is drawn by hand from the
 * real proportions (41 km long, 6 to 12 km wide); it is an artist's map, not a survey.
 */
export const KM = 10;
export const LENGTH = 410;

/** Distance from the coast to the eastern fence, by distance south of the northern border. */
const EAST: [number, number][] = [
  [0, 56], [30, 60], [60, 70], [100, 72], [140, 70], [180, 75], [220, 82],
  [260, 90], [300, 110], [340, 121], [370, 126], [395, 124], [410, 120],
];

/** The Egyptian border runs from the coast at z=395 to the fence at z=410. */
export const SOUTH_A = { x: 0, z: 395 };
export const SOUTH_B = { x: 120, z: 410 };

function table(rows: [number, number][], v: number) {
  if (v <= rows[0][0]) return rows[0][1];
  for (let i = 1; i < rows.length; i++) {
    const [a, av] = rows[i - 1];
    const [b, bv] = rows[i];
    if (v <= b) return av + ((bv - av) * (v - a)) / (b - a);
  }
  return rows[rows.length - 1][1];
}

export const eastEdge = (z: number) => table(EAST, z);
export const southLimit = (x: number) => SOUTH_A.z + ((SOUTH_B.z - SOUTH_A.z) * x) / SOUTH_B.x;
export const inside = (x: number, z: number, margin = 0) =>
  x > margin && x < eastEdge(z) - margin && z > margin && z < southLimit(x) - margin;

/** The outline, clockwise from the north-west corner, as [x, z] pairs. */
export function outline(): [number, number][] {
  const pts: [number, number][] = [[0, 0]];
  pts.push([0, SOUTH_A.z]);
  pts.push([SOUTH_B.x, SOUTH_B.z]);
  for (let i = EAST.length - 2; i >= 0; i--) pts.push([EAST[i][1], EAST[i][0]]);
  return pts;
}

export const PLACES: { name: string; x: number; z: number }[] = [
  { name: "Beit Hanoun", x: 48, z: 34 },
  { name: "Jabalia", x: 34, z: 56 },
  { name: "Gaza City", x: 22, z: 92 },
  { name: "Wadi Gaza", x: 44, z: 140 },
  { name: "Nuseirat", x: 16, z: 166 },
  { name: "Deir al-Balah", x: 26, z: 222 },
  { name: "Khan Younis", x: 60, z: 305 },
  { name: "al-Mawasi", x: 9, z: 336 },
  { name: "Rafah", x: 72, z: 378 },
];

/** Towns and camps, as density bumps: where buildings stood. */
export const TOWNS = [
  { z: 34, x: 48, s: 12, w: 1.0 },
  { z: 24, x: 22, s: 12, w: 1.0 },
  { z: 56, x: 34, s: 14, w: 1.5 },
  { z: 92, x: 26, s: 26, w: 2.4 },
  { z: 166, x: 18, s: 10, w: 1.3 },
  { z: 182, x: 48, s: 9, w: 1.0 },
  { z: 222, x: 28, s: 14, w: 1.2 },
  { z: 305, x: 56, s: 22, w: 1.7 },
  { z: 378, x: 70, s: 20, w: 1.5 },
];

/** Where the tents went: al-Mawasi, Rafah, the coast of Deir al-Balah. */
export const CAMPS = [
  { z: 330, x: 10, r: 26, n: 1500 },
  { z: 352, x: 13, r: 24, n: 1200 },
  { z: 368, x: 42, r: 28, n: 1300 },
  { z: 386, x: 80, r: 16, n: 600 },
  { z: 236, x: 11, r: 18, n: 650 },
  { z: 208, x: 13, r: 12, n: 380 },
  { z: 158, x: 11, r: 9, n: 220 },
];

/**
 * The walk, as [chapter progress, z, default x]. The visitor scrolls the progress;
 * the pointer moves them left and right of this line.
 */
export const ROUTE: [number, number, number][] = [
  [0.2, 60, 32],
  [0.33, 140, 38],
  [0.47, 222, 32],
  [0.6, 305, 50],
  [0.7, 332, 14],
  [0.84, 384, 58],
  [0.92, 398, 70],
];

const ROUTE_Z = ROUTE.map(([q, z]) => [q, z] as [number, number]);
const ROUTE_X = ROUTE.map(([q, , x]) => [q, x] as [number, number]);

export function routeAt(p: number) {
  return { x: table(ROUTE_X, p), z: table(ROUTE_Z, p) };
}

/** Each forced move, by chapter progress. */
export const DISPLACEMENTS = [0.2, 0.6, 0.7, 0.84, 0.9];

export const DATES: [number, string][] = [
  [0.2, "13 October 2023"],
  [0.33, "November 2023"],
  [0.55, "December 2023"],
  [0.66, "January 2024"],
  [0.76, "February 2024"],
  [0.86, "May 2024"],
];

export function dateAt(p: number) {
  let label = DATES[0][1];
  for (const [at, text] of DATES) if (p >= at) label = text;
  return label;
}
