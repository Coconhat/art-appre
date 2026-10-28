"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { useChapter } from "@/hooks/useChapter";
import { useStore } from "@/lib/store";
import { FACTS } from "@/content/facts";

const KeyStage = dynamic(() => import("@/components/three/KeyStage"), { ssr: false });

/**
 * Susi (the key). The object the visitor just chose, or did not, becomes the hinge of
 * the story: this is where Palestine is named for the first time.
 */
export function KeyChapter() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useChapter(ref);
  const tookKey = useStore((s) => s.packed.includes("The house key"));

  return (
    <section id="susi" aria-labelledby="susi-title" className="relative bg-night">
      <div ref={ref} className="relative" style={{ height: "580svh" }}>
        <div className="stage">
          <KeyStage progress={progress} />

          <div className="frame pointer-events-none relative z-10 flex h-full flex-col justify-center max-md:justify-end max-md:pb-[6svh]">
            <div id="susi-title">
              <ChapterTitle id="susi" />
            </div>
            <div className="relative h-[min(48svh,27rem)] w-full md:max-w-[46%]">
              <p data-beat data-in="0.08" data-out="0.2" className="t-headline italic absolute inset-x-0 top-0">
                {tookKey ? "You took the key." : "Most people take the key."}
              </p>
              <p data-beat data-in="0.22" data-out="0.34" className="t-statement measure over-scene absolute inset-x-0 top-0">
                It is the proof that the house is yours, and the promise that you will be back.
              </p>
              <p data-beat data-in="0.36" data-out="0.47" className="t-display absolute inset-x-0 top-0">
                This key is {FACTS.yearsSinceNakba} years old.
              </p>
              <p data-beat data-in="0.49" data-out="0.6" className="t-statement measure over-scene absolute inset-x-0 top-0">
                In 1948, around {FACTS.nakbaRefugees} people were driven from their homes, or fled the
                fighting, in the land then called Palestine.
              </p>
              <p data-beat data-in="0.62" data-out="0.72" className="t-statement measure over-scene absolute inset-x-0 top-0">
                Hundreds of villages were emptied, and most were wiped off the map. The United Nations
                said the refugees should be allowed to return. They never were.
              </p>
              <p data-beat data-in="0.74" data-out="0.84" className="t-headline absolute inset-x-0 top-0">
                Palestinians call it{" "}
                <span lang="ar" dir="rtl" className="arabic">
                  النكبة
                </span>
                , al-Nakba: the catastrophe.
              </p>
              <p data-beat data-in="0.86" className="t-statement measure over-scene absolute inset-x-0 top-0">
                The keys were handed down. There are {FACTS.palestineRefugeesToday} Palestine refugees
                today, and many families still keep one. It still turns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
