"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { EightPoints } from "@/components/art/EightPoints";
import { useChapter } from "@/hooks/useChapter";
import { FACTS, fmt } from "@/content/facts";

const GlobeStage = dynamic(() => import("@/components/three/GlobeStage"), { ssr: false });

const PIN_NAMES = ["Manila", "Gaza", "Israel", "New York, 1947", "Red Sea"];

/**
 * Sinulid (the thread). The question of the first screen comes back: how far?
 * The world is embroidered on dark cloth, and red thread is sewn from Manila to every
 * place where this story already touches Filipino lives.
 */
export function Thread() {
  const ref = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const progress = useChapter(ref);

  return (
    <section id="sinulid" aria-labelledby="sinulid-title" className="relative bg-night">
      <div ref={ref} className="relative" style={{ height: "900svh" }}>
        <div className="stage">
          <GlobeStage progress={progress} labels={labels} />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
            {PIN_NAMES.map((name, i) => (
              <span
                key={name}
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="t-small absolute left-0 top-0 ml-3 -translate-y-1/2 whitespace-nowrap italic text-paper opacity-0 transition-opacity duration-500"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="frame pointer-events-none relative z-10 flex h-full flex-col justify-center max-md:justify-end max-md:pb-[6svh]">
            <div id="sinulid-title">
              <ChapterTitle id="sinulid" out={0.05} />
            </div>
            <div className="relative h-[min(44svh,24rem)] w-full md:h-[min(50svh,28rem)] md:max-w-[44%]">
              <p data-beat data-in="0.06" data-out="0.13" className="t-headline italic absolute inset-x-0 top-0">
                How far is Gaza from Manila?
              </p>
              <div data-beat data-in="0.15" data-out="0.27" className="absolute inset-x-0 top-0">
                <p className="t-display lining">{fmt(FACTS.manilaToGazaKm)} km</p>
                <p className="t-statement over-scene mt-4 measure">Far enough to scroll past.</p>
              </div>
              <p data-beat data-in="0.3" data-out="0.39" className="t-statement over-scene measure absolute inset-x-0 top-0">
                1947, New York. The thread starts with our yes to dividing Palestine.
              </p>
              <p data-beat data-in="0.41" data-out="0.52" className="t-statement over-scene measure absolute inset-x-0 top-0">
                About 30,000 Filipinos work in Israel, most of them caregivers. On 7 October 2023, four
                were killed: Angelyn Aguirre, Loreta Alacre, Grace Cabrera and Paul Vincent Castelvi. Two
                more, Jimmy Pacheco and Noralyn Babadilla, were taken hostage, and came home.
              </p>
              <p data-beat data-in="0.53" data-out="0.63" className="t-statement over-scene measure absolute inset-x-0 top-0">
                {FACTS.filipinosInGaza2023} Filipinos were living in Gaza when the war began, many married
                into Palestinian families. Some would not leave without them.
              </p>
              <p data-beat data-in="0.65" data-out="0.77" className="t-statement over-scene measure absolute inset-x-0 top-0">
                No country sends more seafarers to the world&apos;s ships than ours. When the war spread to
                the Red Sea, the {FACTS.galaxyLeaderFilipinos} Filipino crew of the Galaxy Leader were held
                for {FACTS.galaxyLeaderDays} days. Two Filipino sailors died on the True Confidence in 2024;
                Filipino crew were among the dead and missing of the Eternity C in 2025.
              </p>
              <p data-beat data-in="0.79" data-out="0.88" className="t-statement over-scene measure absolute inset-x-0 top-0">
                And at home, we know this story from the inside. For three centuries others drew our maps,
                and then told us we were not ready to govern ourselves.
              </p>
              <div data-beat data-in="0.9" className="absolute inset-x-0 top-0">
                <p lang="fil" className="t-display italic">
                  Hindi malayo.
                </p>
                <p className="t-statement mt-4">It is not far.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TwoStars />
    </section>
  );
}

/** The sun of our flag and the star of tatreez slide together until they share a centre. */
function TwoStars() {
  const ref = useRef<HTMLDivElement>(null);
  useChapter(ref, {
    build: (tl, section) => {
      tl.fromTo(section.querySelector("[data-sun]"), { x: -120 }, { x: 0, duration: 0.5, ease: "power2.inOut" }, 0.38)
        .fromTo(section.querySelector("[data-star]"), { x: 120 }, { x: 0, duration: 0.5, ease: "power2.inOut" }, 0.38)
        .fromTo(
          section.querySelector("[data-sun-spin]"),
          { rotation: -45, svgOrigin: "0 0" },
          { rotation: 0, svgOrigin: "0 0", duration: 0.5, ease: "power2.inOut" },
          0.38,
        );
    },
  });

  return (
    <div ref={ref} className="relative" style={{ height: "320svh" }}>
      <div className="stage">
        <div className="frame grid h-full grid-rows-[auto_1fr_auto] items-center gap-6 py-[12svh] max-md:py-[9svh]">
          <h3 className="t-headline italic">Two stars with eight points.</h3>
          <EightPoints className="mx-auto h-full max-h-[46svh] w-full max-w-[60rem]" />
          <div className="relative min-h-[8.5em] max-w-[44rem]">
            <p data-beat data-in="0" data-out="0.3" className="t-statement absolute inset-x-0 top-0">
              The sun on our flag has eight rays, one for each of the first eight provinces that rose
              against Spain in 1896.
            </p>
            <p data-beat data-in="0.32" data-out="0.62" className="t-statement absolute inset-x-0 top-0">
              The eight-pointed star is one of the oldest motifs in tatreez, stitched by Palestinian
              grandmothers into the dresses of villages that were taken.
            </p>
            <p data-beat data-in="0.66" className="t-statement absolute inset-x-0 top-0">
              One is written in light, the other in thread. Both say the same thing: we are still here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
