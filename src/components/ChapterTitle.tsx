import type { CSSProperties } from "react";
import { CHAPTERS } from "@/content/chapters";

/**
 * The opening card of a chapter: the Filipino word set large, its English
 * meaning beside it. It is the section's heading for screen readers too.
 */
export function ChapterTitle({
  id,
  out = 0.07,
  className = "",
  style,
}: {
  id: string;
  out?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) return null;
  const index = CHAPTERS.indexOf(chapter);
  return (
    <h2
      data-beat
      data-in="0"
      data-out={out}
      className={`flex flex-wrap items-baseline gap-x-5 gap-y-1 ${className}`}
      style={style}
    >
      <span lang="fil" className="t-display italic">
        {chapter.title}
      </span>
      <span className="t-statement opacity-80">
        {chapter.gloss}
        <span className="sr-only">, part {index} of {CHAPTERS.length - 1}</span>
      </span>
    </h2>
  );
}
