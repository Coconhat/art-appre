"use client";

import { useRef } from "react";
import { CHAPTERS } from "@/content/chapters";
import { FACTS, fmt } from "@/content/facts";
import { useChapter } from "@/hooks/useChapter";

const PANELS: { year: string; text: string }[] = [
  {
    year: "1917",
    text: "Britain promises “a national home for the Jewish people” in Palestine, where about nine in ten people are Arab.",
  },
  { year: "1947", text: "The United Nations votes to divide Palestine. The Philippines votes yes." },
  {
    year: "1948",
    text: `The Nakba. About ${FACTS.nakbaRefugees} Palestinians are expelled or flee. The State of Israel is declared.`,
  },
  {
    year: "1967",
    text: "Israel occupies the West Bank, East Jerusalem and Gaza. The occupation continues today.",
  },
  {
    year: "1987",
    text: "The First Intifada, “the shaking off”: strikes, boycotts, and children throwing stones at tanks.",
  },
  { year: "1993", text: "The Oslo Accords promise peace in stages. The settlements keep growing." },
  {
    year: "2002",
    text: "Israel begins a wall through the West Bank, up to eight metres high. In 2004 the International Court of Justice says it breaks international law.",
  },
  {
    year: "2007",
    text: `Israel and Egypt seal Gaza by land, sea and air. ${FACTS.gazaPopulation} people can no longer freely leave.`,
  },
  {
    year: "2008–21",
    text: "Four wars on Gaza. Thousands are killed. Each time, the rebuilding starts again.",
  },
  {
    year: "2023",
    text: "On 7 October, Hamas-led attacks kill about 1,200 people in Israel and take 251 hostages. Israel launches its war on Gaza.",
  },
  {
    year: "2024",
    text: "The International Court of Justice orders Israel to prevent acts of genocide in Gaza. The International Criminal Court issues arrest warrants for Israel's prime minister, its former defence minister and a Hamas commander.",
  },
  {
    year: "2025",
    text: "Famine is confirmed in Gaza City. A UN commission of inquiry concludes that Israel has committed genocide. In October, a ceasefire.",
  },
  {
    year: "2026",
    text: `The ceasefire holds on paper. More than ${fmt(FACTS.killedSinceCeasefire)} Palestinians have been killed since it began, and nearly everyone in Gaza still lives in a tent.`,
  },
];

/**
 * Pader (the wall). Seventy-eight years painted, slab by slab, onto concrete. The wall the
 * history runs along is itself one of its chapters (2002), and the place where people answered it with paint.
 */
export function Wall() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const chapter = CHAPTERS.find((c) => c.id === "pader")!;

  useChapter(ref, {
    build: (tl) => {
      tl.fromTo(
        track.current,
        { x: 0 },
        { x: () => -((track.current?.scrollWidth ?? 0) - window.innerWidth), duration: 0.96 },
        0.02,
      );
    },
  });

  return (
    <section id="pader" aria-labelledby="pader-title" className="relative bg-[#1c252e]">
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="spray" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feGaussianBlur in="rough" stdDeviation="0.5" result="soft" />
          <feMerge>
            <feMergeNode in="soft" />
            <feMergeNode in="rough" />
          </feMerge>
        </filter>
      </svg>

      <div ref={ref} className="relative" style={{ height: "780svh" }}>
        <div className="stage">
          {/* ground */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[9svh] bg-[#11161a]" />

          <div
            ref={track}
            className="absolute bottom-[9svh] left-0 flex h-[80svh] items-end gap-[clamp(3rem,8vw,8rem)] pl-[clamp(1rem,4.5vw,3.5rem)] pr-[30vw] will-change-transform"
          >
            <div className="flex h-full w-[min(88vw,34rem)] shrink-0 flex-col justify-center pb-[6svh]">
              <h2 id="pader-title" className="flex flex-wrap items-baseline gap-x-5">
                <span lang="fil" className="t-display italic">
                  {chapter.title}
                </span>
                <span className="t-statement opacity-80">{chapter.gloss}</span>
              </h2>
              <p className="t-statement mt-8 measure">
                More than a century, painted onto a wall. Keep scrolling down to walk along it.
              </p>
            </div>

            <ol className="m-0 flex h-full list-none items-end gap-0 p-0">
              {PANELS.map((panel) => (
                <li
                  key={panel.year}
                  className="tex-concrete relative flex h-full w-[min(80vw,25rem)] shrink-0 flex-col justify-between px-[clamp(1.25rem,2.4vw,2.25rem)] pb-[clamp(1.5rem,4svh,2.75rem)] pt-[clamp(2rem,7svh,4rem)] text-ink"
                >
                  {/* joints between the concrete segments */}
                  <span aria-hidden className="absolute inset-y-0 left-1/3 w-[3px] bg-black/15" />
                  <span aria-hidden className="absolute inset-y-0 left-2/3 w-[3px] bg-black/15" />
                  <span aria-hidden className="absolute inset-y-0 right-0 w-[5px] bg-black/30" />
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[6px] bg-black/20" />

                  <span
                    className="lining relative block text-[clamp(3.6rem,7.5vw,7rem)] font-bold leading-none tracking-[-0.04em] text-[#f3f0ea] [filter:url(#spray)]"
                  >
                    {panel.year}
                  </span>
                  <p className="t-body relative max-w-[26ch] text-[1.08em] font-medium leading-snug">
                    {panel.text}
                  </p>
                </li>
              ))}
              <li className="relative flex h-full w-[min(84vw,30rem)] shrink-0 flex-col justify-end pb-[6svh] pl-[clamp(2rem,6vw,6rem)]">
                <p className="t-statement measure">
                  People still paint on it: names, keys, birds, children. A wall built to separate
                  became a place to be seen.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
