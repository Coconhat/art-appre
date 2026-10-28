"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { Ripples, type Ring } from "@/components/art/Ripples";
import { PriceBoard } from "@/components/art/PriceBoard";
import { useChapter } from "@/hooks/useChapter";
import { FACTS, fmt } from "@/content/facts";
import { lerp } from "@/lib/random";

const RINGS: Ring[] = [
  { label: "Gaza", at: 0.18, radius: 0.07 },
  { label: "The Red Sea", at: 0.31, radius: 0.15 },
  { label: "The Strait of Hormuz", at: 0.45, radius: 0.23 },
  { label: "The world", at: 0.59, radius: 0.32 },
  { label: "The Philippines", at: 0.72, radius: 0.42 },
  { label: "You", at: 0.85, radius: Infinity },
];

const { diesel } = FACTS;

/** What the board shows across the second half of the chapter: [progress, price]. */
const BOARD: [number, number][] = [
  [0, diesel.before],
  [0.15, diesel.before],
  [0.27, diesel.lateMarchCommon],
  [0.33, diesel.lateMarchCommon],
  [0.42, diesel.peak],
  [0.76, diesel.peak],
  [0.84, diesel.now],
  [1, diesel.now],
];

const WHEN: [number, string][] = [
  [0, "February 2026, before the war on Iran"],
  [0.16, "Last week of March 2026, common price"],
  [0.34, "Week of 7 April 2026"],
  [0.77, "Week of 20 October 2026"],
];

function boardAt(p: number) {
  for (let i = 1; i < BOARD.length; i++) {
    const [a, av] = BOARD[i - 1];
    const [b, bv] = BOARD[i];
    if (p <= b) {
      const t = (p - a) / (b - a || 1);
      return av + (bv - av) * t * t * (3 - 2 * t);
    }
  }
  return BOARD[BOARD.length - 1][1];
}

function whenAt(p: number) {
  let label = WHEN[0][1];
  for (const [at, text] of WHEN) if (p >= at) label = text;
  return label;
}

/**
 * Halaga (the price). In Filipino the word means both what a thing costs and what it is
 * worth. The war does not stay in Gaza: its ripples cross the Red Sea and Hormuz and reach
 * the pump, the jeepney and the market here. The chapter ends on the difference between
 * the two meanings of the word.
 */
export function Price() {
  return (
    <section id="halaga" aria-labelledby="halaga-title" className="relative bg-[#050608]">
      <RipplePart />
      <BoardPart />
    </section>
  );
}

function RipplePart() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useChapter(ref);

  return (
    <div ref={ref} className="relative" style={{ height: "640svh" }}>
      <div className="stage">
        <Ripples progress={progress} rings={RINGS} />
        <p className="sr-only">
          Rings spread from a single point, one for each circle the war reached: Gaza, the Red Sea,
          the Strait of Hormuz, the world, the Philippines, and finally you.
        </p>

        <div className="frame pointer-events-none relative z-10 flex h-full flex-col justify-center max-md:justify-end max-md:pb-[6svh]">
          <div id="halaga-title">
            <ChapterTitle id="halaga" />
          </div>
          <div className="relative h-[min(46svh,26rem)] w-full md:max-w-[44%]">
            <p data-beat data-in="0" data-out="0.07" className="t-statement measure absolute inset-x-0 top-0">
              In Filipino, <em lang="fil">halaga</em> means two things: what something costs, and what
              it is worth.
            </p>
            <p data-beat data-in="0.08" data-out="0.17" className="t-headline italic absolute inset-x-0 top-0">
              A war does not stay where it starts.
            </p>
            <p data-beat data-in="0.19" data-out="0.3" className="t-statement measure over-scene absolute inset-x-0 top-0">
              In Gaza itself, rebuilding will cost an estimated ${FACTS.gazaRebuildBillionUsd} billion
              over ten years, by the count of the United Nations, the European Union and the World Bank.
            </p>
            <p data-beat data-in="0.32" data-out="0.44" className="t-statement measure over-scene absolute inset-x-0 top-0">
              From late 2023, Houthi forces in Yemen attacked ships in the Red Sea, saying they acted for
              Gaza. Most trade between Asia and Europe went the long way, around Africa. Egypt&apos;s
              earnings from the Suez Canal fell from ${FACTS.suezRevenueBefore} billion to $
              {FACTS.suezRevenueAfter} billion in a year.
            </p>
            <p data-beat data-in="0.46" data-out="0.58" className="t-statement measure over-scene absolute inset-x-0 top-0">
              The region&apos;s wars kept widening. In February 2026 the United States and Israel went to
              war with Iran, and the Strait of Hormuz, the route for a fifth of the world&apos;s oil, was
              all but closed.
            </p>
            <p data-beat data-in="0.6" data-out="0.71" className="t-statement measure over-scene absolute inset-x-0 top-0">
              The International Energy Agency called it the largest supply disruption in the history of
              the oil market. A barrel went from about ${FACTS.brentBefore} to as much as $
              {FACTS.brentPeak}, and {FACTS.hormuzToAsiaPct}% of the oil through Hormuz is bound for Asia.
            </p>
            <p data-beat data-in="0.73" data-out="0.84" className="t-statement measure over-scene absolute inset-x-0 top-0">
              The Philippines buys about {FACTS.phCrudeFromMiddleEastPct}% of its crude oil from the
              Middle East, and {FACTS.filipinosInMiddleEast} Filipinos work there.
            </p>
            <p data-beat data-in="0.86" className="t-display italic absolute inset-x-0 top-0">
              So the ripple reaches you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardPart() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useChapter(ref);

  return (
    <div ref={ref} className="relative" style={{ height: "600svh" }}>
      <div className="stage">
        <div className="frame grid h-full grid-cols-12 items-center gap-x-10 max-md:grid-rows-[auto_1fr] max-md:content-center max-md:gap-y-6 max-md:py-[10svh]">
          <figure className="col-span-12 m-0 md:order-2 md:col-span-7">
            <LiveBoard progress={progress} />
          </figure>

          <div className="relative col-span-12 h-[min(40svh,24rem)] md:order-1 md:col-span-5 md:h-[min(56svh,30rem)]">
            <p data-beat data-in="0.02" data-out="0.14" className="t-statement absolute inset-x-0 top-0">
              February 2026. A litre of diesel costs about ₱{diesel.before.toFixed(2)}.
            </p>
            <p data-beat data-in="0.17" data-out="0.31" className="t-statement absolute inset-x-0 top-0">
              24 March. The Philippines declares a state of national energy emergency, the first
              country in the world to declare one over the war. In Metro Manila, diesel now sells for
              ₱{diesel.lateMarchLow.toFixed(2)} to ₱{diesel.lateMarchHigh.toFixed(2)} a litre.
            </p>
            <p data-beat data-in="0.35" data-out="0.47" className="t-statement absolute inset-x-0 top-0">
              The week of 7 April: ₱{diesel.peak.toFixed(2)}. The most a litre of diesel has ever cost
              in Metro Manila.
            </p>
            <p data-beat data-in="0.49" data-out="0.61" className="t-statement absolute inset-x-0 top-0">
              Diesel moves almost every jeepney, bus, fishing boat and delivery truck. Fares went up.
              Inflation jumped from {FACTS.inflationFeb2026}% in February to {FACTS.inflationApr2026}% in
              April, the highest in three years.
            </p>
            <p data-beat data-in="0.63" data-out="0.75" className="t-statement absolute inset-x-0 top-0">
              Government economists estimated the shock could push {FACTS.pushedIntoPoverty} Filipinos
              into poverty.
            </p>
            <p data-beat data-in="0.78" data-out="0.89" className="t-statement absolute inset-x-0 top-0">
              October 2026: ₱{diesel.now.toFixed(2)}. Lower, but still about{" "}
              {fmt(Math.round((diesel.now / diesel.before - 1) * 100))}% more than before the war.
            </p>
            <div data-beat data-in="0.91" className="absolute inset-x-0 top-0">
              <p className="t-headline italic">We pay in pesos. Gaza pays in lives.</p>
              <p className="t-statement mt-5 measure">
                That is the difference between the two meanings of <em lang="fil">halaga</em>: the
                price, and the worth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The board's digits run after the scroll like a counter, so fast scrolling still reads as a climb. */
function LiveBoard({ progress }: { progress: RefObject<number> }) {
  const host = useRef<HTMLDivElement>(null);
  const [price, setPrice] = useState<number>(diesel.before);
  const [when, setWhen] = useState(WHEN[0][1]);

  useEffect(() => {
    let raf = 0;
    let running = false;
    let shown: number = diesel.before;
    let last = performance.now();
    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      const p = progress.current ?? 0;
      shown = lerp(shown, boardAt(p), 1 - Math.exp(-6 * dt));
      setPrice(Math.round(shown * 100) / 100);
      setWhen(whenAt(p));
      if (running) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (host.current) io.observe(host.current);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [progress]);

  return (
    <div ref={host}>
      <PriceBoard value={price} className="mx-auto block h-auto w-full max-w-[40rem] max-md:max-h-[32svh]" />
      <figcaption className="t-small mx-auto mt-4 max-w-[40rem] text-paper-dim">
        Metro Manila. {when}.
      </figcaption>
    </div>
  );
}
