/**
 * A slice of watermelon: red, green, black and white, the colours that could not be shown
 * together. It appears drained of colour until the last chapter gives the colour back.
 */
export function Watermelon({ className = "", colored = false }: { className?: string; colored?: boolean }) {
  const seeds: [number, number, number][] = [
    [72, 58, -30], [100, 72, -15], [130, 74, 8], [158, 60, 26], [86, 92, -22],
    [120, 100, 0], [150, 90, 18], [108, 122, -8], [136, 118, 12], [60, 44, -40], [176, 46, 38],
  ];
  return (
    <svg
      viewBox="0 0 240 150"
      className={`${className} transition-[filter] duration-[2500ms] ease-[var(--ease-out-expo)]`}
      style={{ filter: colored ? "none" : "grayscale(1) brightness(0.9)" }}
      aria-hidden
    >
      <path d="M8 24 A112 112 0 0 0 232 24 Z" fill="var(--color-flag-green)" />
      <path d="M18 24 A102 102 0 0 0 222 24 Z" fill="var(--color-flag-white)" />
      <path d="M26 24 A94 94 0 0 0 214 24 Z" fill="var(--color-flag-red)" />
      {seeds.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="6" transform={`rotate(${r} ${x} ${y})`} fill="var(--color-flag-black)" />
      ))}
    </svg>
  );
}
