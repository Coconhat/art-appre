/**
 * The roadside fuel price board, the picture every Filipino newscast shows when prices
 * move: red seven-segment digits on a black panel. Drawn segment by segment in SVG.
 */
const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  " ": "",
};

const W = 56; // digit cell
const H = 100;
const T = 11; // segment thickness

function horizontal(cx: number, cy: number, length: number) {
  const l = length / 2;
  const t = T / 2;
  return `${cx - l},${cy} ${cx - l + t},${cy - t} ${cx + l - t},${cy - t} ${cx + l},${cy} ${cx + l - t},${cy + t} ${cx - l + t},${cy + t}`;
}

function vertical(cx: number, cy: number, length: number) {
  const l = length / 2;
  const t = T / 2;
  return `${cx},${cy - l} ${cx + t},${cy - l + t} ${cx + t},${cy + l - t} ${cx},${cy + l} ${cx - t},${cy + l - t} ${cx - t},${cy - l + t}`;
}

const SEG_SHAPES: Record<string, string> = {
  a: horizontal(W / 2, T / 2, W - 6),
  g: horizontal(W / 2, H / 2, W - 6),
  d: horizontal(W / 2, H - T / 2, W - 6),
  f: vertical(T / 2, H / 4 + 1, H / 2 - 8),
  b: vertical(W - T / 2, H / 4 + 1, H / 2 - 8),
  e: vertical(T / 2, (3 * H) / 4 - 1, H / 2 - 8),
  c: vertical(W - T / 2, (3 * H) / 4 - 1, H / 2 - 8),
};

const ON = "#ff3d24";
const OFF = "#2a100c";

function Digit({ char, x }: { char: string; x: number }) {
  const lit = SEGMENTS[char] ?? "";
  return (
    <g transform={`translate(${x} 0)`}>
      {Object.entries(SEG_SHAPES).map(([name, points]) => (
        <polygon key={name} points={points} fill={lit.includes(name) ? ON : OFF} />
      ))}
    </g>
  );
}

export function PriceBoard({ value, className = "" }: { value: number; className?: string }) {
  // three digits before the point, two after; leading zeros stay dark, as on a real board
  const [whole, cents] = value.toFixed(2).split(".");
  const chars = (whole.padStart(3, " ") + cents).split("");
  const xs = [0, 66, 132, 220, 286];

  return (
    <svg viewBox="0 0 560 300" className={className} role="img" aria-label={`Diesel, ${value.toFixed(2)} pesos per litre`}>
      <defs>
        <filter id="led-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="4" y="4" width="552" height="292" rx="10" fill="#111215" stroke="#2b2c30" strokeWidth="8" />
      <rect x="26" y="26" width="508" height="248" rx="4" fill="#09090a" />
      <text x="46" y="80" fill="#f1eee8" fontSize="40" fontWeight="700" letterSpacing="3" fontFamily="inherit">
        DIESEL
      </text>
      <text x="514" y="80" fill="#9d9a94" fontSize="19" textAnchor="end" fontFamily="inherit" fontStyle="italic">
        per litre
      </text>
      <text x="46" y="212" fill="#f1eee8" fontSize="54" fontFamily="inherit">
        ₱
      </text>
      <g transform="translate(108 120) skewX(-6)" filter="url(#led-glow)">
        {chars.map((c, i) => (
          <Digit key={i} char={c} x={xs[i]} />
        ))}
        <rect x="196" y={H - T} width={T + 1} height={T} fill={ON} />
      </g>
    </svg>
  );
}
