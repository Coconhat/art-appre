"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChapterTitle } from "@/components/ChapterTitle";
import { useChapter } from "@/hooks/useChapter";
import { KiteSky } from "@/components/art/KiteSky";
import { Watermelon } from "@/components/art/Watermelon";
import { ChildFromBehind } from "@/components/art/ChildFromBehind";
import { CREDITS, courseInline } from "@/content/credits";

const LEARN = [
  { name: "UN OCHA, occupied Palestinian territory", href: "https://www.ochaopt.org/" },
  { name: "UNRWA, the UN agency for Palestine refugees", href: "https://www.unrwa.org/" },
  { name: "B'Tselem, Israeli human rights centre", href: "https://www.btselem.org/" },
  { name: "Al-Haq, Palestinian human rights organisation", href: "https://www.alhaq.org/" },
  { name: "Amnesty International", href: "https://www.amnesty.org/en/location/middle-east-and-north-africa/middle-east/israel-and-occupied-palestinian-territories/" },
  { name: "Visualizing Palestine", href: "https://visualizingpalestine.org/" },
];

const GIVE = [
  { name: "UNRWA", href: "https://www.unrwa.org/" },
  { name: "Palestine Red Crescent Society", href: "https://www.palestinercs.org/en" },
  { name: "Médecins Sans Frontières", href: "https://www.msf.org/" },
  { name: "Medical Aid for Palestinians", href: "https://www.map.org.uk/" },
  { name: "UNICEF", href: "https://www.unicef.org/" },
];

/**
 * Kalayaan (freedom). The four colours withheld for the whole piece finally meet,
 * and the advocacy is said out loud, in three languages. Then the sky opens.
 */
export function Freedom() {
  const ref = useRef<HTMLDivElement>(null);

  useChapter(ref, {
    build: (tl, section) => {
      const bands = section.querySelectorAll("[data-band]");
      bands.forEach((band, i) => {
        tl.fromTo(band, { xPercent: -101 }, { xPercent: 0, duration: 0.09, ease: "power3.out" }, 0.17 + i * 0.07);
      });
      tl.fromTo(section.querySelector("[data-triangle]"), { xPercent: -101 }, { xPercent: 0, duration: 0.1, ease: "power3.out" }, 0.4);
      section.querySelectorAll("[data-cry]").forEach((cry, i) => {
        tl.fromTo(cry, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.06, ease: "power2.out" }, 0.53 + i * 0.05);
      });
    },
  });

  return (
    <section id="kalayaan" aria-labelledby="kalayaan-title" className="relative bg-night">
      <div ref={ref} className="relative" style={{ height: "420svh" }}>
        <div className="stage">
          <div className="frame relative z-10 flex h-full flex-col justify-center">
            <div id="kalayaan-title">
              <ChapterTitle id="kalayaan" out={0.08} />
            </div>
            <p data-beat data-in="0.08" data-out="0.17" className="t-headline italic absolute inset-x-[clamp(1rem,4.5vw,3.5rem)] top-1/2 -translate-y-1/2 max-w-[22ch]">
              Four colours you have not seen together in this piece. Until now.
            </p>
          </div>

          {/* the flag assembles */}
          <div aria-hidden className="absolute inset-0 z-20 overflow-hidden">
            <div data-band className="absolute inset-x-0 top-0 h-1/3 bg-flag-black" />
            <div data-band className="absolute inset-x-0 top-1/3 h-1/3 bg-flag-white" />
            <div data-band className="absolute inset-x-0 top-2/3 h-1/3 bg-flag-green" />
            <div
              data-triangle
              className="absolute inset-y-0 left-0 w-1/3 bg-flag-red [clip-path:polygon(0_0,100%_50%,0_100%)]"
             
            />
          </div>

          {/* the words, one language to each band */}
          <div className="absolute inset-0 z-30 grid grid-rows-3 pl-[38%] pr-[clamp(1rem,4.5vw,3.5rem)] max-md:pl-[36%]">
            <p data-cry lang="fil" className="t-headline flex items-center italic text-flag-white opacity-0">
              Malayang Palestina.
            </p>
            <p data-cry lang="ar" dir="rtl" className="arabic flex items-center justify-end text-[clamp(2.4rem,1rem+5vw,6rem)] leading-none text-flag-black opacity-0">
              فلسطين حرة
            </p>
            <p data-cry className="t-headline flex items-center text-flag-white opacity-0">
              Free Palestine.
            </p>
          </div>
        </div>
      </div>

      <KiteSky />
      <Actions />
      <Closing />
    </section>
  );
}

function Actions() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-dust text-ink">
      <div className="frame grid gap-x-12 gap-y-16 py-[clamp(5rem,14svh,10rem)] md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="t-headline italic">What now?</h3>
          <Watermelon colored className="mt-10 w-[min(70%,15rem)]" />
          <p className="t-small mt-4 max-w-[28ch]">
            The watermelon, in colour at last. In 1980 it could be confiscated.
          </p>
        </div>

        <dl className="m-0 grid gap-y-12 md:col-span-8">
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-[10rem_1fr]">
            <dt className="t-statement italic">Learn</dt>
            <dd className="m-0">
              <p className="t-body max-w-[52ch]">Read past the headlines. Start with the people who count, document and report:</p>
              <ul className="t-body mt-3 grid gap-1.5 p-0 [list-style:none]">
                {LEARN.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-[10rem_1fr]">
            <dt className="t-statement italic">Give</dt>
            <dd className="m-0">
              <p className="t-body max-w-[52ch]">Food, medicine and shelter reach Gaza through these organisations:</p>
              <ul className="t-body mt-3 grid gap-1.5 p-0 [list-style:none]">
                {GIVE.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-[10rem_1fr]">
            <dt className="t-statement italic">Speak</dt>
            <dd className="m-0">
              <p className="t-body max-w-[52ch]">
                Tell one person what you learned today. Ask where the Philippines stands at the United
                Nations, and why. Share this piece.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href.split("#")[0]);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2400);
                  } catch {
                    setCopied(false);
                  }
                }}
                className="t-body mt-4 cursor-pointer bg-ink px-5 py-2.5 text-paper transition hover:bg-[#33302c] active:translate-y-px"
              >
                {copied ? "Link copied" : "Copy the link"}
              </button>
            </dd>
          </div>
          <div className="grid gap-x-8 gap-y-3 md:grid-cols-[10rem_1fr]">
            <dt className="t-statement italic">Remember</dt>
            <dd className="m-0">
              <p className="t-body max-w-[52ch]">
                Keep the key. Somewhere, a family still keeps theirs, and it still turns.
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Closing() {
  return (
    <footer className="relative overflow-hidden bg-night pt-[14svh]">
      <div className="frame grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="t-statement max-w-[24ch]">He has not turned around yet.</p>
          <p className="t-body mt-4 max-w-[46ch] text-paper-dim">
            Handala will show his face when Palestine is free. Until then, he keeps walking, and so does
            this story. You know it now. It is not far.
          </p>
          <ul className="t-body mt-10 flex flex-wrap gap-x-8 gap-y-2 p-0 [list-style:none]">
            <li>
              <Link href="/statement">Artist statement</Link>
            </li>
            <li>
              <Link href="/statement#sources">Sources</Link>
            </li>
          </ul>
          <div className="mt-12">
            <h3 className="t-small text-paper-dim">Made by</h3>
            <ul className="t-statement mt-2 grid gap-1 p-0 [list-style:none]">
              {CREDITS.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p className="t-small mt-4 text-paper-dim">An interactive artwork for {courseInline()}.</p>
          </div>
        </div>
        <div className="flex justify-center md:col-span-5 md:justify-end">
          <ChildFromBehind className="h-[clamp(12rem,34svh,20rem)] w-auto text-paper" />
        </div>
      </div>
      <p
        aria-hidden
        lang="fil"
        className="mt-[8svh] select-none whitespace-nowrap px-[clamp(1rem,4.5vw,3.5rem)] pb-[2svh] text-[clamp(3.5rem,16.5vw,17rem)] italic leading-[0.8] tracking-[-0.045em] text-paper"
      >
        Gaano kalayo?
      </p>
    </footer>
  );
}
