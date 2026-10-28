"use client";

import { useRef } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { useChapter } from "@/hooks/useChapter";
import { FACTS } from "@/content/facts";
import { mulberry32 } from "@/lib/random";

type Vote = "Yes" | "No" | "Abstained" | "Absent";

/** The roll call on General Assembly Resolution 181 (II), 29 November 1947. */
const ROLL: [string, Vote][] = [
  ["Afghanistan", "No"], ["Argentina", "Abstained"], ["Australia", "Yes"], ["Belgium", "Yes"],
  ["Bolivia", "Yes"], ["Brazil", "Yes"], ["Byelorussian S.S.R.", "Yes"], ["Canada", "Yes"],
  ["Chile", "Abstained"], ["China", "Abstained"], ["Colombia", "Abstained"], ["Costa Rica", "Yes"],
  ["Cuba", "No"], ["Czechoslovakia", "Yes"], ["Denmark", "Yes"], ["Dominican Republic", "Yes"],
  ["Ecuador", "Yes"], ["Egypt", "No"], ["El Salvador", "Abstained"], ["Ethiopia", "Abstained"],
  ["France", "Yes"], ["Greece", "No"], ["Guatemala", "Yes"], ["Haiti", "Yes"],
  ["Honduras", "Abstained"], ["Iceland", "Yes"], ["India", "No"], ["Iran", "No"],
  ["Iraq", "No"], ["Lebanon", "No"], ["Liberia", "Yes"], ["Luxembourg", "Yes"],
  ["Mexico", "Abstained"], ["Netherlands", "Yes"], ["New Zealand", "Yes"], ["Nicaragua", "Yes"],
  ["Norway", "Yes"], ["Pakistan", "No"], ["Panama", "Yes"], ["Paraguay", "Yes"],
  ["Peru", "Yes"], ["Philippines", "Yes"], ["Poland", "Yes"], ["Saudi Arabia", "No"],
  ["Siam", "Absent"], ["Sweden", "Yes"], ["Syria", "No"], ["Turkey", "No"],
  ["Ukrainian S.S.R.", "Yes"], ["Union of South Africa", "Yes"], ["U.S.S.R.", "Yes"],
  ["United Kingdom", "Abstained"], ["United States", "Yes"], ["Uruguay", "Yes"],
  ["Venezuela", "Yes"], ["Yemen", "No"], ["Yugoslavia", "Abstained"],
];

// A typewriter never strikes two letters the same way.
const rand = mulberry32(1947);
const STRIKE = ROLL.map(() => ({ o: 0.72 + rand() * 0.28, x: (rand() - 0.5) * 1.2 }));

const TYPE_START = 0.12;
const TYPE_END = 0.6;
const CIRCLE_AT = 0.66;

export function Vote() {
  const ref = useRef<HTMLDivElement>(null);

  useChapter(ref, {
    build: (tl, section) => {
      const rows = section.querySelectorAll<HTMLElement>("[data-row]");
      const step = (TYPE_END - TYPE_START) / rows.length;
      rows.forEach((row, i) => {
        tl.fromTo(row, { opacity: 0 }, { opacity: 1, duration: step * 0.9 }, TYPE_START + i * step);
      });
      tl.fromTo(
        section.querySelector("[data-circle]"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.05, ease: "power2.inOut" },
        CIRCLE_AT,
      );
      tl.fromTo(section.querySelector("[data-tally]"), { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.78);
    },
  });

  const half = Math.ceil(ROLL.length / 2);
  const columns = [ROLL.slice(0, half), ROLL.slice(half)];

  return (
    <section id="boto" aria-labelledby="boto-title" className="relative bg-night">
      <div ref={ref} className="relative" style={{ height: "540svh" }}>
        <div className="stage">
          <div className="frame relative h-full pt-14 md:grid md:grid-cols-12 md:items-center md:gap-x-8 md:pt-0">
            {/* the document */}
            <figure className="relative m-0 md:order-2 md:col-span-7 md:col-start-6">
              <div
                aria-label="Reconstruction of the roll-call vote on UN General Assembly Resolution 181, 29 November 1947"
                className="tex-paper relative mx-auto w-full max-w-[44rem] -rotate-[1.2deg] px-[5%] py-[4.5%] font-type text-[#2b2925] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] [font-size:clamp(8.5px,0.95vw,13.5px)] leading-[1.35] md:leading-[1.45]"
              >
                <div className="text-center uppercase tracking-[0.06em]">
                  <p className="font-bold">United Nations</p>
                  <p>General Assembly · Second Session</p>
                </div>
                <p className="mt-[1.3em] text-center">
                  Future Government of Palestine
                  <br />
                  Resolution 181 (II), roll-call vote, 29 November 1947
                </p>

                <div className="mt-[1.6em] grid grid-cols-2 gap-x-[6%]">
                  {columns.map((col, c) => (
                    <ol key={c} className="m-0 list-none p-0" start={c * half + 1}>
                      {col.map(([country, vote]) => {
                        const index = ROLL.findIndex(([n]) => n === country);
                        const isUs = country === "Philippines";
                        return (
                          <li
                            key={country}
                            data-row
                            className="relative flex whitespace-nowrap"
                            style={{ opacity: STRIKE[index].o, translate: `${STRIKE[index].x}px 0` }}
                          >
                            <span className={isUs ? "font-bold" : undefined}>{country}</span>
                            <span aria-hidden className="mx-1 min-w-0 flex-1 overflow-hidden text-[#2b2925]/50">
                              ................................................
                            </span>
                            <span className={isUs ? "font-bold" : undefined}>{vote}</span>
                            {isUs && (
                              <svg
                                aria-hidden
                                viewBox="0 0 200 40"
                                preserveAspectRatio="none"
                                className="pointer-events-none absolute -inset-x-[7%] -inset-y-[70%] h-[240%] w-[114%] overflow-visible"
                              >
                                <path
                                  data-circle
                                  d="M8 22 C 10 6, 120 2, 186 10 C 204 14, 198 34, 150 37 C 90 41, 20 38, 6 26 C 2 20, 16 12, 40 9"
                                  pathLength={1}
                                  fill="none"
                                  stroke="var(--color-thread)"
                                  strokeWidth={2.6}
                                  strokeLinecap="round"
                                  strokeDasharray="1"
                                  style={{ strokeDashoffset: 1 }}
                                />
                              </svg>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  ))}
                </div>

                <p data-tally className="mt-[1.6em] text-center opacity-0">
                  In favour: {FACTS.vote1947.yes}. Against: {FACTS.vote1947.no}. Abstentions:{" "}
                  {FACTS.vote1947.abstained}. Absent: {FACTS.vote1947.absent}.
                  <br />
                  The resolution is adopted.
                </p>
              </div>
              <figcaption className="t-small mx-auto mt-3 max-w-[44rem] text-paper-dim md:mt-4">
                A reconstruction of the roll call, members in alphabetical order.
              </figcaption>
            </figure>

            {/* the words: on phones they sit over the foot of the document, on a band of night */}
            <div className="beats absolute inset-x-[clamp(1rem,4.5vw,3.5rem)] bottom-[5svh] md:relative md:inset-auto md:order-1 md:col-span-5 md:h-[min(56svh,30rem)]">
              <div id="boto-title">
                <ChapterTitle id="boto" />
              </div>
              <p data-beat data-in="0.07" data-out="0.17" className="t-headline italic over-scene">
                The road to 1948 began a year earlier, with a vote.
              </p>
              <p data-beat data-in="0.19" data-out="0.3" className="t-headline over-scene">
                One of the hands raised was ours.
              </p>
              <p data-beat data-in="0.32" data-out="0.42" className="t-statement over-scene">
                29 November 1947. The United Nations General Assembly votes on a plan to divide
                Palestine into a Jewish state and an Arab state.
              </p>
              <p data-beat data-in="0.44" data-out="0.53" className="t-statement over-scene">
                About two in three people living there were Palestinian Arabs. The plan gave the Jewish
                state 56% of the land.
              </p>
              <p data-beat data-in="0.55" data-out="0.64" className="t-statement over-scene">
                Three days earlier, the Philippine delegate, Carlos P. Romulo, had told the Assembly we
                could not support the “political disunion and territorial dismemberment of Palestine.”
              </p>
              <p data-beat data-in="0.66" data-out="0.76" className="t-headline over-scene">
                On the day of the vote, the Philippines said yes.
              </p>
              <p data-beat data-in="0.78" data-out="0.88" className="t-statement over-scene">
                It needed two-thirds to pass. It passed {FACTS.vote1947.yes} to {FACTS.vote1947.no}, and
                ours was one of the {FACTS.vote1947.yes}. Records from the time describe heavy American
                pressure on undecided governments, ours among them.
              </p>
              <p data-beat data-in="0.9" className="t-statement over-scene">
                We had been independent for sixteen months. A nation just freed from its colonizer helped
                divide someone else&apos;s home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
