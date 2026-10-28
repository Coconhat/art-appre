/**
 * A paper kite like the 12,350 that Gaza's children flew at once in 2011, and like the
 * one in Refaat Alareer's poem. Grey in the gallery, in colour at the end.
 */
export function Kite({ className = "", colored = false }: { className?: string; colored?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 320"
      className={`${className} transition-[filter] duration-[2500ms] ease-[var(--ease-out-expo)]`}
      style={{ filter: colored ? "none" : "grayscale(1) brightness(0.95)" }}
      aria-hidden
    >
      <path d="M100 10 L100 92 L32 92 Z" fill="var(--color-flag-black)" />
      <path d="M100 10 L168 92 L100 92 Z" fill="var(--color-flag-white)" />
      <path d="M32 92 L100 92 L100 214 Z" fill="var(--color-flag-green)" />
      <path d="M100 92 L168 92 L100 214 Z" fill="var(--color-flag-red)" />
      <path d="M100 10 L168 92 L100 214 L32 92 Z M100 10 V214 M32 92 H168" fill="none" stroke="#2a2622" strokeWidth="2" />
      {/* tail, with bows tied along it */}
      <path d="M100 214 C 86 240, 118 258, 98 282 C 86 296, 104 306, 96 318" fill="none" stroke="#d9d3c7" strokeWidth="1.6" />
      {[
        [94, 236],
        [108, 258],
        [92, 284],
        [100, 304],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x - 8} ${y - 5} L${x} ${y} L${x - 8} ${y + 5} Z M${x + 8} ${y - 5} L${x} ${y} L${x + 8} ${y + 5} Z`} fill={i % 2 ? "var(--color-flag-red)" : "var(--color-flag-green)"} />
      ))}
    </svg>
  );
}
