import type { Metadata } from "next";
import Link from "next/link";
import { SOURCES } from "@/content/sources";
import { FACTS, fmt, timeToLightAll } from "@/content/facts";
import { CHAPTERS } from "@/content/chapters";
import { CREDITS, courseInline, namesInline } from "@/content/credits";

export const metadata: Metadata = {
  title: "Artist statement · Gaano Kalayo?",
  description: "What every part of the artwork means, how it was made, and where every number comes from.",
};

const { hours, minutes } = timeToLightAll();

/** Chapter by chapter: what the visitor does, and what it means. Written to be presented from. */
const PARTS: { id: string; does: string; means: string[] }[] = [
  {
    id: "simula",
    does: "A dark room, one beam of light with dust floating in it, and a question in Filipino: Gaano kalayo? How far?",
    means: [
      "Nothing names Palestine yet. The brief was to build curiosity before advocacy, so the work begins with a question the visitor can answer for themselves.",
      "Dust only shows inside the light, the way it does in a room nobody has opened for a long time. It is the house we will be asked to leave.",
    ],
  },
  {
    id: "tahanan",
    does: "The visitor imagines their own home, then is told they have one hour to leave, and packs three things from twelve luggage tags.",
    means: [
      "The story starts with the visitor's home, in their city, so it becomes theirs before it is anyone else's.",
      "The warm doorway narrows as the questions arrive: a door closing behind you.",
      "The choice is remembered. If the visitor packs the key, the next chapter says “You took the key.” Most people do, because they mean to come back.",
    ],
  },
  {
    id: "susi",
    does: "A rusted iron key, modelled in 3D, turns slowly in lamplight. Palestine is named for the first time. At the end the key turns once, as if in a lock.",
    means: [
      `In 1948 about ${FACTS.nakbaRefugees} Palestinians were driven out or fled (the Nakba). Families locked their doors and kept their keys, expecting to return. The key became the symbol of the right of return.`,
      `The rust is time: ${FACTS.yearsSinceNakba} years. The rust is generated from noise on the surface, so no two parts age the same way.`,
      "The final turn says the key still works. The hope has not expired.",
    ],
  },
  {
    id: "boto",
    does: "A typewritten reconstruction of the 1947 UN roll call types itself line by line. The Philippines is circled in red pencil.",
    means: [
      "The Philippines voted yes to dividing Palestine (Resolution 181), three days after its delegate Carlos P. Romulo told the Assembly we could not support it. US records describe the switch.",
      "Circling our own name is not about guilt. It is about owning our part of the story: the Philippines is in this history from the beginning.",
      "The typewriter face is used only here, because it belongs to the document.",
    ],
  },
  {
    id: "pader",
    does: "The visitor scrolls sideways along a concrete wall. Each slab carries a year, spray-painted, from 1917 to 2026.",
    means: [
      "The separation wall is itself one of the events (2002). It also became one of the world's great surfaces for protest art, so the history is painted on it.",
      "The numerals are roughened with a noise filter so they read as spray paint, not print.",
      "October 7, 2023 is on the wall as fact. An honest work names every civilian death.",
    ],
  },
  {
    id: "lakad",
    does: "A 3D Gaza Strip, stood upright. Scrolling walks a child south from the evacuation order of 13 October 2023 to the wall at Rafah. The pointer steers, but never out of the strip.",
    means: [
      "The page's own scroll becomes a forced march. The visitor can choose a path but not a destination: every path ends at the same wall. “There is no south of Rafah.”",
      "If the visitor scrolls back up, the work answers: “You can scroll back. For fifteen months, they could not.”",
      "The child is seen from behind, hands clasped at the back: the pose of Handala (see Sining). The crowd thickens and the tents multiply as you go south. Drones circle overhead.",
      `About ${FACTS.structuresDamagedPct}% of buildings are damaged or destroyed; the rubble in the scene follows that proportion area by area. At the end the camera rises to show the whole strip.`,
    ],
  },
  {
    id: "bilang",
    does: `Lights appear one at a time, then by powers of ten, until there are ${fmt(FACTS.killed)}. Then the visitor can press and hold to light candles, one per second.`,
    means: [
      "Each light is one person: not a statistic, a flame. The smaller lights are children.",
      "The lights grow outward in a spiral (phyllotaxis), the pattern of seeds in a sunflower: the shape of growth, used here for loss.",
      `At one candle per second, lighting one for each person would take ${hours} hours and ${minutes} minutes. The slowness is the point: grief at this scale cannot be done by hand. This chapter is almost silent on purpose.`,
    ],
  },
  {
    id: "sining",
    does: "A gallery on black linen: tatreez embroidery, Handala, the watermelon, Refaat Alareer's kite poem, and Juan Luna's Spoliarium.",
    means: [
      "The walls are the black linen of a Palestinian thob, the dress that tatreez is stitched on.",
      "The tatreez panel is generated stitch by stitch from traditional motifs: the eight-pointed star, the cypress, the triangle.",
      "The watermelon is grey, and the label asks: have you noticed this work has never shown red, green, black and white together? In 1980 those colours could close an exhibition.",
      "Spoliarium connects the gallery to us: Filipino art bore witness to our own colonization.",
    ],
  },
  {
    id: "sinulid",
    does: "The world is embroidered in cross-stitch on dark cloth. Red thread is sewn from Manila to Gaza, New York, Israel and the Red Sea. Then the sun of our flag and a tatreez star slide together.",
    means: [
      `${fmt(FACTS.manilaToGazaKm)} km sounds far. The threads show it is not: the 1947 vote, about 30,000 Filipino caregivers in Israel, Filipino families in Gaza, Filipino seafarers held and killed in the Red Sea.`,
      "The red thread is the thread of kinship. It is a running stitch: above the cloth, then under it, like connections that are sometimes visible and sometimes hidden.",
      "Two eight-pointed stars: our sun's eight rays for the eight provinces that rose against Spain, and the tatreez star. One written in light, one in thread.",
    ],
  },
  {
    id: "halaga",
    does: "A drop falls on a dark, oily surface and rings spread out from it: Gaza, the Red Sea, the Strait of Hormuz, the world, the Philippines, and a last ring that crosses the whole screen, labelled You. Then a roadside fuel price board, its red digits climbing from ₱56.50 to ₱153.70 a litre.",
    means: [
      "Halaga means both price and worth in Filipino. The chapter is built on that double meaning.",
      "The ripple is the shape of how a war travels: Houthi attacks on Red Sea shipping in the name of Gaza sent Asia–Europe trade around Africa; the region's wars widened until, in 2026, a war on Iran all but closed the Strait of Hormuz.",
      `The Philippines buys about ${FACTS.phCrudeFromMiddleEastPct}% of its crude oil from the Middle East. On 24 March 2026 it became the first country to declare an energy emergency over the war. Diesel hit ₱${FACTS.diesel.peak.toFixed(2)} a litre in Metro Manila, the highest ever; inflation went from ${FACTS.inflationFeb2026}% to ${FACTS.inflationApr2026}%; fares rose; ${FACTS.pushedIntoPoverty} Filipinos were at risk of falling into poverty.`,
      "The price board is the picture every Filipino newscast shows when prices move, drawn segment by segment so the digits can climb as you scroll.",
      "It ends on the gap between the two meanings: we pay in pesos, Gaza pays in lives. Our cost is real, and it is a reason to care, not a reason to make the story about us.",
    ],
  },
  {
    id: "kalayaan",
    does: "The four withheld colours slide in and become the Palestinian flag, carrying one cry in three languages. Then an open sky where the visitor flies a kite held by the child.",
    means: [
      "The advocacy is said only at the end, once the visitor knows why: Malayang Palestina, فلسطين حرة, Free Palestine. Filipino is our voice, Arabic theirs, English the world's.",
      "The sky has no drones in it, only kites, as on 28 July 2011 when Gaza's children flew 12,350 at once. Refaat Alareer's poem asks for a kite.",
      "Visitors can give the kite a name to carry and let it go.",
      "It closes on the child from behind: he has not turned around yet.",
    ],
  },
];

export default function Statement() {
  return (
    <main className="min-h-svh bg-dust text-ink">
      <div className="frame mx-auto max-w-[72rem] py-[10svh]">
        <Link href="/" className="t-small italic">
          Back to the artwork
        </Link>

        <header className="mt-14 max-w-[52rem]">
          <h1 className="t-display italic" lang="fil">
            Gaano kalayo?
          </h1>
          <p className="t-statement mt-6">
            Artist statement: what every part of the work means, how it was made, and where each
            number comes from.
          </p>
          <p className="t-body mt-6">
            By {namesInline()}. {courseInline()}.
          </p>
        </header>

        <section className="mt-20 grid gap-x-16 gap-y-8 md:grid-cols-12" aria-labelledby="work">
          <h2 id="work" className="t-headline italic md:col-span-4">
            The work
          </h2>
          <div className="t-body measure-wide space-y-5 md:col-span-8">
            <p>
              <em>Gaano kalayo?</em> (How far?) is an interactive artwork for the web in ten parts,
              about Palestine and about how close it is to us in the Philippines. It is scrolled
              rather than read: scrolling turns a key, types a document, walks a child across Gaza,
              lights candles, and runs up the price of diesel.
            </p>
            <p>
              It begins with a question and the visitor&apos;s own home, not with a slogan. Palestine is
              named only in the third part. The call for a free Palestine comes at the very end, in
              three languages, after the visitor has seen why. Its one argument is in the title: the
              distance we feel is not real. Our vote is in this story from 1947, and so are our
              caregivers, our seafarers and our families, and, by 2026, the price of every ride and
              every meal.
            </p>
            <p>
              Everything on screen is made for the piece, in code: the key, the strip of Gaza, the{" "}
              {fmt(FACTS.killed)} lights, the embroidery, the globe, the sound. No photographs of real
              victims are used; the work shows people as light, as figures, and as names, without
              using anyone&apos;s image without consent. Works by other artists are honoured in homage,
              not copied.
            </p>
          </div>
        </section>

        <section className="mt-24 grid gap-x-16 gap-y-8 md:grid-cols-12" aria-labelledby="choices">
          <h2 id="choices" className="t-headline italic md:col-span-4">
            Colour, type, sound
          </h2>
          <div className="t-body measure-wide space-y-5 md:col-span-8">
            <p>
              <strong>Colour is withheld.</strong> For most of the work the palette comes from the
              subject: a blackout-blue night, lamplight, concrete dust, the grey of the wall, the black
              linen of a thob, the madder red of embroidery thread. Red, green, black and white never
              appear together until the last chapter. After 1967 the Palestinian flag was banned in
              the occupied territories, and in 1980 artists in Ramallah were told even a painted
              watermelon in those colours would be confiscated. The work makes the visitor live inside
              that restriction, and then lifts it.
            </p>
            <p>
              <strong>Type.</strong> One family, Newsreader, which was designed for reading the news
              on screens: the news we usually scroll past, set large enough to slow down for.
              Questions are set in italic, the voice of the one asking. Arabic is set in Amiri, a
              Naskh face. A typewriter face appears only inside the 1947 document.
            </p>
            <p>
              <strong>Sound</strong> (optional, top right) is synthesised live in the browser: the
              room tone of a closed house, a low hum under the key, wind along the wall, and in Gaza a
              buzzing tone like the drones Gazans call <em>zanana</em>. Each candle lit in the count
              rings a small bell. The count itself is nearly silent.
            </p>
            <p>
              <strong>Motion</strong> is tied to the scroll, so the visitor sets the pace and can stop
              anywhere. With reduced motion turned on in the device settings, smooth scrolling is
              switched off and movement is kept to a minimum.
            </p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="parts">
          <h2 id="parts" className="t-headline italic">
            Part by part
          </h2>
          <p className="t-body mt-4 max-w-[60ch]">
            For presenting: each part takes about a minute. Press <kbd>]</kbd> and <kbd>[</kbd> on the
            keyboard to jump between parts, or use the list on the right of the screen.
          </p>
          <ol className="mt-12 grid list-none gap-16 p-0">
            {PARTS.map((part) => {
              const chapter = CHAPTERS.find((c) => c.id === part.id)!;
              return (
                <li key={part.id} className="grid gap-x-16 gap-y-4 md:grid-cols-12">
                  <h3 className="md:col-span-4">
                    <span lang="fil" className="t-headline block italic">
                      {chapter.title}
                    </span>
                    <span className="t-statement mt-1 block opacity-75">{chapter.gloss}</span>
                  </h3>
                  <div className="md:col-span-8">
                    <p className="t-statement">{part.does}</p>
                    <ul className="t-body mt-5 grid gap-3 pl-5 [list-style:square]">
                      {part.means.map((m) => (
                        <li key={m} className="pl-1 marker:text-thread">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-28" aria-labelledby="sources-title" id="sources">
          <h2 id="sources-title" className="t-headline italic">
            Sources
          </h2>
          <p className="t-body mt-4 max-w-[62ch]">
            Numbers change. These were checked in October 2026; casualty figures are those reported
            by Gaza&apos;s Ministry of Health and are not independently verified. They are widely used
            by the UN, and independent studies suggest they undercount. Update{" "}
            <code className="font-type text-[0.9em]">src/content/facts.ts</code> before presenting if
            anything has moved.
          </p>
          <div className="mt-12 grid gap-14">
            {SOURCES.map((group) => (
              <div key={group.chapter} className="grid gap-x-16 gap-y-4 md:grid-cols-12">
                <h3 className="t-statement italic md:col-span-4">{group.chapter}</h3>
                <ul className="t-body m-0 grid list-none gap-4 p-0 md:col-span-8">
                  {group.items.map((s) => (
                    <li key={s.claim}>
                      <p>{s.claim}</p>
                      <p className="t-small mt-1 opacity-75">
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noreferrer">
                            {s.source}
                          </a>
                        ) : (
                          s.source
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28 grid gap-x-16 gap-y-6 md:grid-cols-12" aria-labelledby="made">
          <h2 id="made" className="t-headline italic md:col-span-4">
            How it was made
          </h2>
          <div className="t-body measure-wide space-y-4 md:col-span-8">
            <p>
              Built with Next.js and React. The 3D scenes (the key, Gaza, the lights, the globe) use
              Three.js through React Three Fiber, with custom shaders for rust, windows, candles,
              cross-stitches and thread. Scrolling is smoothed with Lenis and choreographed with GSAP
              ScrollTrigger. The globe&apos;s {fmt(6866)} stitches are sampled from Natural Earth land
              outlines (world-atlas). The ripples and the kites are drawn on 2D canvases, the fuel price
              board in SVG, segment by segment. The sound is generated with the Web Audio API.
            </p>
            <p>
              Homages: Handala is by Naji al-Ali; the watermelon story is Sliman Mansour&apos;s; the
              kite poem is Refaat Alareer&apos;s; Spoliarium is Juan Luna&apos;s. All other images in
              the work were made for it.
            </p>
          </div>
        </section>

        <section className="mt-28 grid gap-x-16 gap-y-6 md:grid-cols-12" aria-labelledby="credits">
          <h2 id="credits" className="t-headline italic md:col-span-4">
            Made by
          </h2>
          <div className="md:col-span-8">
            <ul className="t-statement m-0 grid gap-1 p-0 [list-style:none]">
              {CREDITS.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p className="t-body mt-5">{courseInline()}.</p>
          </div>
        </section>

        <p className="t-small mt-24">
          <Link href="/">Back to the artwork</Link>
        </p>
      </div>
    </main>
  );
}
