"use client";

import { useRef } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { PackTags } from "@/components/chapters/PackTags";
import { useChapter } from "@/hooks/useChapter";

/**
 * Tahanan (home). The visitor is asked to picture their own home, in their own city,
 * before the piece says anything about anyone else's. The doorway of light narrows
 * as the questions arrive: a door closing behind you.
 */
export function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const door = useRef<HTMLDivElement>(null);
  const spill = useRef<HTMLDivElement>(null);

  useChapter(ref, {
    build: (tl) => {
      tl.fromTo(door.current, { scaleX: 1 }, { scaleX: 0.035, duration: 0.8 }, 0.12);
      tl.fromTo(spill.current, { scaleX: 1, opacity: 1 }, { scaleX: 0.06, opacity: 0.4, duration: 0.8 }, 0.12);
    },
  });

  return (
    <section id="tahanan" aria-labelledby="tahanan-title" className="relative bg-night">
      <div ref={ref} className="relative" style={{ height: "430svh" }}>
        <div className="stage">
          {/* the doorway */}
          <div
            aria-hidden
            className="absolute inset-0 [--door-x:58%] [--door:min(22vw,240px)] [--floor:22svh] max-md:[--door-x:54%] max-md:[--door:30vw] max-md:[--floor:44svh]"
          >
            <div
              ref={door}
              className="absolute bottom-[var(--floor)] left-[var(--door-x)] h-[min(52svh,34rem)] w-[var(--door)] origin-left bg-lamp/90 max-md:h-[30svh]"
            />
            {/* the light the doorway throws on the floor, closing with it */}
            <div
              ref={spill}
              className="absolute bottom-0 left-[calc(var(--door-x)-var(--door)*0.6)] h-[var(--floor)] w-[calc(var(--door)*2.5)] origin-[24%_0] bg-lamp/[0.09] [clip-path:polygon(24%_0,64%_0,100%_100%,0_100%)]"
            />
          </div>

          <div className="frame relative z-10 flex h-full flex-col justify-center max-md:justify-end max-md:pb-[8svh]">
            <div id="tahanan-title">
              <ChapterTitle id="tahanan" />
            </div>
            <div className="relative mt-2 h-[min(46svh,26rem)] w-full max-w-[52rem] md:max-w-[50%]">
              <p data-beat data-in="0.09" data-out="0.24" className="t-headline italic absolute inset-x-0 top-0">
                Think of your home.
              </p>
              <p data-beat data-in="0.26" data-out="0.42" className="t-statement measure over-scene absolute inset-x-0 top-0">
                The creak of the gate. Rice on the stove. The corner where you sleep, the people asleep
                beside you.
              </p>
              <p data-beat data-in="0.44" data-out="0.58" className="t-headline italic absolute inset-x-0 top-0">
                Now someone is at the door.
              </p>
              <p data-beat data-in="0.6" data-out="0.74" className="t-statement measure over-scene absolute inset-x-0 top-0">
                You have one hour to leave. Nobody can tell you when you will be allowed back.
              </p>
              <p data-beat data-in="0.77" className="t-display italic absolute inset-x-0 top-0">
                What do you carry?
              </p>
            </div>
          </div>
        </div>
      </div>

      <PackTags />
    </section>
  );
}
