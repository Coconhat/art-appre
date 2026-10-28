"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { useChapter } from "@/hooks/useChapter";
import { FACTS, fmt, timeToLightAll } from "@/content/facts";
import { TOTAL, countAt } from "@/components/three/countData";
import { ambient } from "@/lib/audio";

const LightsStage = dynamic(() => import("@/components/three/LightsStage"), { ssr: false });

/**
 * Bilang (the count). One light at a time, then every power of ten, until the field holds
 * every person counted. Then the visitor is asked to light candles themselves, one per second,
 * and feels how long that would take.
 */
export function Count() {
  const ref = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const progress = useChapter(ref, {
    onUpdate: (p) => {
      if (counter.current) counter.current.textContent = fmt(Math.round(countAt(p)));
    },
  });
  const { hours, minutes } = timeToLightAll();

  return (
    <section id="bilang" aria-labelledby="bilang-title" className="relative bg-[#06090d]">
      <div ref={ref} className="relative" style={{ height: "820svh" }}>
        <div className="stage">
          <LightsStage progress={progress} />

          <div className="frame pointer-events-none relative z-10 grid h-full grid-rows-[1fr_auto] pb-[6svh] pt-[14svh]">
            <div className="relative">
              <div id="bilang-title">
                <ChapterTitle id="bilang" out={0.05} />
              </div>
              <div className="beats beats-top mt-4 w-full max-w-[34rem]">
                <p data-beat data-in="0.07" data-out="0.15" className="t-statement over-scene">
                  One light. One person. A name, a voice, a favourite food.
                </p>
                <p data-beat data-in="0.2" data-out="0.27" className="t-statement over-scene">
                  Ten. Some families lost this many in a single night.
                </p>
                <p data-beat data-in="0.32" data-out="0.39" className="t-statement over-scene">
                  One hundred. Everyone on your street.
                </p>
                <p data-beat data-in="0.44" data-out="0.51" className="t-statement over-scene">
                  One thousand. A small barangay.
                </p>
                <p data-beat data-in="0.56" data-out="0.63" className="t-statement over-scene">
                  Ten thousand. A town.
                </p>
                <p data-beat data-in="0.68" data-out="0.74" className="t-statement over-scene">
                  People killed in Gaza since October 2023, according to its Ministry of Health, as of{" "}
                  {FACTS.killedAsOf}.
                </p>
                <p data-beat data-in="0.76" data-out="0.84" className="t-statement over-scene">
                  The smaller lights are children. More than {fmt(FACTS.childrenKilled)} of them.
                </p>
                <p data-beat data-in="0.86" data-out="0.92" className="t-statement over-scene">
                  And these are only the dead who were counted. Thousands more lie under the rubble. A
                  study in The Lancet estimated the real toll was about {FACTS.lancetUndercountPct}% higher
                  than the official count.
                </p>
                <div data-beat data-in="0.93" className="pointer-events-auto">
                  <CandleHold />
                  <p className="t-body mt-5 max-w-[34ch] text-paper-dim">
                    Lighting one for each of them, one every second, would take you {hours} hours and{" "}
                    {minutes} minutes, without stopping.
                  </p>
                </div>
              </div>
            </div>

            <p aria-live="off" className="justify-self-end text-right">
              <span ref={counter} className="t-display tabular block">
                0
              </span>
              <span className="t-small text-paper-dim">of {fmt(TOTAL)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Press and hold: one candle per second. The slowness is the point. */
function CandleHold() {
  const [lit, setLit] = useState(0);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (!holding) return;
    const light = () => {
      setLit((n) => n + 1);
      ambient.bell();
    };
    light();
    const id = window.setInterval(light, 1000);
    return () => window.clearInterval(id);
  }, [holding]);

  const start = () => setHolding(true);
  const stop = () => setHolding(false);

  return (
    <div>
      <button
        type="button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") stop();
        }}
        onBlur={stop}
        // a long press on a phone would otherwise open the copy menu or start a scroll
        onContextMenu={(e) => e.preventDefault()}
        className={`t-statement cursor-pointer touch-none select-none border-2 [-webkit-touch-callout:none] border-lamp px-6 py-3 text-left transition duration-300 ${
          holding ? "bg-lamp text-night" : "bg-transparent text-lamp hover:bg-lamp/10"
        }`}
      >
        {holding ? "Keep holding" : "Press and hold to light a candle"}
      </button>
      <p className="t-body mt-4" aria-live="polite">
        {lit === 0
          ? "One candle each second."
          : `You have lit ${fmt(lit)}. ${fmt(TOTAL - lit)} to go.`}
      </p>
      <div aria-hidden className="mt-3 flex max-w-[30rem] flex-wrap gap-1.5">
        {Array.from({ length: Math.min(lit, 60) }, (_, i) => (
          <span key={i} className="block h-3 w-1.5 rounded-full bg-lamp" style={{ opacity: 0.55 + ((i * 37) % 45) / 100 }} />
        ))}
        {lit > 60 && <span className="t-small text-lamp">+{fmt(lit - 60)}</span>}
      </div>
    </div>
  );
}
