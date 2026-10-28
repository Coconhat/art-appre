"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHAPTERS } from "@/content/chapters";
import { scrollToTarget } from "@/lib/scroll";
import { SoundToggle } from "./SoundToggle";

/**
 * The plain bar: the title on the left, the statement and sound on the right,
 * and on wide screens the chapter list down the right edge for whoever presents.
 */
export function ChapterNav() {
  const [active, setActive] = useState(CHAPTERS[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // "[" and "]" step between chapters; a presenter's clicker sends PageUp/PageDown, which scroll natively.
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key !== "]" && e.key !== "[") return;
      const ids = CHAPTERS.map((c) => c.id);
      const current = ids.indexOf(
        sections.find((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
        })?.id ?? ids[0],
      );
      const next = ids[Math.min(ids.length - 1, Math.max(0, current + (e.key === "]" ? 1 : -1)))];
      scrollToTarget(`#${next}`);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header className="frame pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between pt-4 mix-blend-difference">
        <a
          href="#simula"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#simula");
          }}
          className="pointer-events-auto t-small italic text-[#e6e0d4] no-underline"
        >
          Gaano kalayo?
        </a>
        <div className="pointer-events-auto flex items-center gap-5 t-small text-[#e6e0d4]">
          <SoundToggle />
          <Link href="/statement" className="no-underline hover:underline">
            Artist statement
          </Link>
        </div>
      </header>

      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-[#e6e0d4] mix-blend-difference"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav
        aria-label="Chapters"
        className="fixed right-[clamp(1rem,2.2vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:block"
      >
        <ol className="flex flex-col items-end gap-1.5">
          {CHAPTERS.map((c) => {
            const isActive = c.id === active;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(`#${c.id}`);
                  }}
                  className="group flex items-center gap-2 t-small text-[#e6e0d4] no-underline"
                >
                  <span
                    lang="fil"
                    className={`transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
                    }`}
                  >
                    {c.title}
                  </span>
                  <span
                    className={`block h-px bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                      isActive ? "w-8 opacity-100" : "w-3 opacity-45"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
