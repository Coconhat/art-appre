/**
 * Tatreez, Palestinian cross-stitch, drawn in code: every stitch is an X on a grid,
 * like thread counted on linen. Motifs: the eight-pointed star, the cypress tree,
 * and the triangle (an amulet motif) along the borders.
 */
const W = 45;
const H = 61;

type Cells = Set<string>;
const key = (x: number, y: number) => `${x},${y}`;

function star(cells: Cells, cx: number, cy: number, a: number, hollow = true) {
  const b = Math.round(a * 1.6);
  const inStar = (dx: number, dy: number, s: number, t: number) =>
    (Math.abs(dx) <= s && Math.abs(dy) <= s) || Math.abs(dx) + Math.abs(dy) <= t;
  for (let dy = -b; dy <= b; dy++) {
    for (let dx = -b; dx <= b; dx++) {
      if (!inStar(dx, dy, a, b)) continue;
      const inner = hollow && inStar(dx, dy, a - 2, b - 2);
      const heart = Math.abs(dx) + Math.abs(dy) <= Math.max(1, Math.floor(a / 2.5));
      if (!inner || heart) cells.add(key(cx + dx, cy + dy));
    }
  }
}

function bitmap(cells: Cells, x: number, y: number, rows: string[], flip = false) {
  const src = flip ? [...rows].reverse() : rows;
  src.forEach((row, j) => [...row].forEach((c, i) => c === "X" && cells.add(key(x + i, y + j))));
}

const CYPRESS = [
  "...X...",
  "..XXX..",
  ".XXXXX.",
  "...X...",
  "..XXX..",
  ".XXXXX.",
  "XXXXXXX",
  "...X...",
  "...X...",
  "..XXX..",
];

const TRIANGLE = ["XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];

function compose() {
  const cells: Cells = new Set();
  // a running frame
  for (let x = 1; x < W - 1; x++) {
    cells.add(key(x, 1));
    cells.add(key(x, H - 2));
  }
  for (let y = 1; y < H - 1; y++) {
    cells.add(key(1, y));
    cells.add(key(W - 2, y));
  }
  // triangles hanging from the top border and standing on the bottom one
  for (let x = 3; x + 7 <= W - 2; x += 8) {
    bitmap(cells, x, 3, TRIANGLE);
    bitmap(cells, x, H - 7, TRIANGLE, true);
  }
  star(cells, 22, 30, 7);
  star(cells, 10, 16, 3, false);
  star(cells, 34, 16, 3, false);
  star(cells, 10, 44, 3, false);
  star(cells, 34, 44, 3, false);
  bitmap(cells, 19, 9, CYPRESS);
  bitmap(cells, 19, 41, CYPRESS);
  // small diamonds down the sides
  for (let y = 10; y < H - 10; y += 5) {
    for (const cx of [4, W - 5]) {
      cells.add(key(cx, y - 1));
      cells.add(key(cx - 1, y));
      cells.add(key(cx + 1, y));
      cells.add(key(cx, y + 1));
    }
  }
  return cells;
}

/** One path per row, so the panel can be "stitched" row by row as it comes into view. */
const ROWS: string[] = (() => {
  const cells = compose();
  const rows: string[] = Array.from({ length: H }, () => "");
  cells.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    rows[y] += `M${x + 0.18} ${y + 0.18}L${x + 0.82} ${y + 0.82}M${x + 0.82} ${y + 0.18}L${x + 0.18} ${y + 0.82}`;
  });
  return rows;
})();

export const STITCH_COUNT = ROWS.reduce((n, r) => n + (r.match(/M/g)?.length ?? 0) / 2, 0);

/** A single eight-pointed star as stitches centred on 0,0, one unit per stitch. */
export function starPath(size: number) {
  const cells: Cells = new Set();
  star(cells, 0, 0, size);
  let d = "";
  cells.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    d += `M${x - 0.32} ${y - 0.32}L${x + 0.32} ${y + 0.32}M${x + 0.32} ${y - 0.32}L${x - 0.32} ${y + 0.32}`;
  });
  return d;
}

export function Tatreez({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <rect width={W} height={H} fill="#141210" />
      <g stroke="var(--color-thread)" strokeWidth={0.2} strokeLinecap="round" fill="none">
        {ROWS.map((d, y) => (d ? <path key={y} data-stitch-row d={d} /> : null))}
      </g>
    </svg>
  );
}
