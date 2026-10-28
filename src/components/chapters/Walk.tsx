"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { useChapter } from "@/hooks/useChapter";
import { FACTS } from "@/content/facts";
import { DISPLACEMENTS, KM, dateAt, routeAt } from "@/components/three/walkData";

const WalkStage = dynamic(() => import("@/components/three/WalkStage"), { ssr: false });

const TIMES = ["once", "twice", "three times", "four times", "five times"];

/**
 * Lakad (the walk). The page's scroll becomes a forced march: scrolling down walks a child
 * south through Gaza, from the evacuation order of 13 October 2023 to the wall at Rafah.
 * The visitor can steer, but never leave the strip, and every way leads to the same wall.
 */
export function Walk() {
  const ref = useRef<HTMLDivElement>(null);
  const steer = useRef(0);
  const hud = useRef<HTMLDivElement>(null);
  const dateEl = useRef<HTMLSpanElement>(null);
  const kmEl = useRef<HTMLSpanElement>(null);
  const movesEl = useRef<HTMLSpanElement>(null);
  const back = useRef<HTMLParagraphElement>(null);
  const backTimer = useRef(0);

  const progress = useChapter(ref, {
    onUpdate: (p, self) => {
      if (hud.current) hud.current.style.opacity = p > 0.19 && p < 0.93 ? "1" : "0";
      if (dateEl.current) dateEl.current.textContent = dateAt(p);
      if (kmEl.current) {
        const km = Math.max(0, (routeAt(p).z - 60) / KM);
        kmEl.current.textContent = `${km.toFixed(1)} km walked`;
      }
      if (movesEl.current) {
        const moves = Math.max(1, DISPLACEMENTS.filter((d) => p >= d).length);
        movesEl.current.textContent = `Displaced ${TIMES[moves - 1]}`;
      }
      // Scrolling back up is the one thing the people on this road could not do.
      if (self.direction < 0 && p > 0.24 && p < 0.9 && back.current) {
        back.current.style.opacity = "1";
        window.clearTimeout(backTimer.current);
        backTimer.current = window.setTimeout(() => {
          if (back.current) back.current.style.opacity = "0";
        }, 2600);
      }
    },
  });

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let active = false;
    const io = new IntersectionObserver(([e]) => (active = e.isIntersecting));
    io.observe(section);
    // Screen-right is west here (the camera looks south), so the sign flips.
    const onMove = (e: PointerEvent) => {
      if (active) steer.current = -((e.clientX / window.innerWidth) - 0.5) * 2;
    };
    const onKey = (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key === "ArrowLeft") steer.current = Math.min(1, steer.current + 0.2);
      else if (e.key === "ArrowRight") steer.current = Math.max(-1, steer.current - 0.2);
      else return;
      e.preventDefault();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(backTimer.current);
    };
  }, []);

  return (
    <section id="lakad" aria-labelledby="lakad-title" className="relative bg-[#b9b3a8] text-ink">
      <div ref={ref} className="relative" style={{ height: "1250svh" }}>
        <div className="stage">
          <WalkStage progress={progress} steer={steer} />

          <div className="frame pointer-events-none relative z-10 flex h-full flex-col justify-between pb-[5svh] pt-[12svh]">
            <div id="lakad-title">
              <ChapterTitle id="lakad" out={0.055} />
            </div>

            <div
              ref={hud}
              aria-hidden
              className="absolute right-[clamp(1rem,4.5vw,3.5rem)] top-[9svh] bg-[#ddd7cc] px-4 py-3 text-right opacity-0 transition-opacity duration-500 lg:right-[clamp(5rem,9vw,8rem)]"
            >
              <p className="t-statement lining">
                <span ref={dateEl}>13 October 2023</span>
              </p>
              <p className="t-body mt-1 lining">
                <span ref={kmEl}>0.0 km walked</span>
                <br />
                <span ref={movesEl}>Displaced once</span>
              </p>
            </div>

            <p
              ref={back}
              role="status"
              className="t-statement absolute inset-x-0 top-[38svh] mx-auto w-fit max-w-[90vw] bg-night px-5 py-3 text-center text-paper opacity-0 transition-opacity duration-500"
            >
              You can scroll back. For fifteen months, they could not.
            </p>

            <div
              data-beat
              data-in="0.055"
              className="grid w-full max-w-[31rem] bg-[#ddd7cc] px-[clamp(1.1rem,2vw,1.75rem)] py-[clamp(1rem,2vw,1.5rem)] max-md:max-w-none"
            >
              <p data-beat data-in="0.06" data-out="0.12" className="t-statement [grid-area:1/1]">
                Gaza. A strip of land {FACTS.gazaLengthKm} km long, about twice the size of Quezon City.
                Home to {FACTS.gazaPopulation} people, seven in ten of them refugees from 1948 or their
                children.
              </p>
              <p data-beat data-in="0.13" data-out="0.19" className="t-statement [grid-area:1/1]">
                Since 2007 it has been sealed by land, sea and air. To leave, you need a permit that
                most people will never get.
              </p>
              <div data-beat data-in="0.2" data-out="0.32" className="[grid-area:1/1]">
                <p className="t-statement">
                  13 October 2023. An order: everyone north of Wadi Gaza, 1.1 million people, must move
                  south.
                </p>
                <p className="t-small mt-3 italic">
                  Scroll to walk. Move the pointer, or press the arrow keys, to choose your way.
                </p>
              </div>
              <p data-beat data-in="0.33" data-out="0.43" className="t-statement [grid-area:1/1]">
                Wadi Gaza. South of here, people were told, it would be safe.
              </p>
              <p data-beat data-in="0.45" data-out="0.54" className="t-statement [grid-area:1/1]">
                The south was bombed too. The roads south were bombed.
              </p>
              <p data-beat data-in="0.56" data-out="0.65" className="t-statement [grid-area:1/1]">
                December. Tanks enter Khan Younis. Pack again. Move again.
              </p>
              <p data-beat data-in="0.67" data-out="0.75" className="t-statement [grid-area:1/1]">
                Al-Mawasi: a strip of sand by the sea, declared a humanitarian zone. It was struck
                again and again.
              </p>
              <p data-beat data-in="0.77" data-out="0.85" className="t-statement [grid-area:1/1]">
                Rafah. A city built for 275,000 people, now sheltering 1.4 million.
              </p>
              <p data-beat data-in="0.86" data-out="0.9" className="t-statement [grid-area:1/1]">
                May 2024. Rafah is invaded.
              </p>
              <p data-beat data-in="0.905" data-out="0.945" className="t-headline [grid-area:1/1]">
                There is no south of Rafah.
              </p>
              <p data-beat data-in="0.955" className="t-statement [grid-area:1/1]">
                In January 2025, during a ceasefire, hundreds of thousands walked north again to
                whatever was left. About {FACTS.structuresDamagedPct}% of all buildings in Gaza are now
                damaged or destroyed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
