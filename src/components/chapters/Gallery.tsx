"use client";

import { useRef, type ReactNode } from "react";
import { CHAPTERS } from "@/content/chapters";
import { useChapter } from "@/hooks/useChapter";
import { ChildFromBehind } from "@/components/art/ChildFromBehind";
import { Watermelon } from "@/components/art/Watermelon";
import { Kite } from "@/components/art/Kite";

/**
 * Sining (the art). A gallery wall of black linen, the cloth of a Palestinian thob.
 * Five works that refused to disappear, each with a museum label, and one Filipino
 * painting that bore witness to our own colonization.
 *
 * Two are shown as they are, because they are free to show: a 19th-century embroidered dress
 * (The Metropolitan Museum of Art, public domain) and Juan Luna's Spoliarium (1884, public
 * domain). The others are still in copyright, or are a poem, so they appear as homages.
 */
export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const chapter = CHAPTERS.find((c) => c.id === "sining")!;

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
    <section id="sining" aria-labelledby="sining-title" className="tex-linen relative">
      <div ref={ref} className="relative" style={{ height: "720svh" }}>
        <div className="stage">
          <div
            ref={track}
            className="absolute inset-y-0 left-0 flex items-center gap-[clamp(4rem,10vw,10rem)] pl-[clamp(1rem,4.5vw,3.5rem)] pr-[20vw] will-change-transform"
          >
            <div className="w-[min(86vw,32rem)] shrink-0">
              <h2 id="sining-title" className="flex flex-wrap items-baseline gap-x-5">
                <span lang="fil" className="t-display italic">
                  {chapter.title}
                </span>
                <span className="t-statement opacity-80">{chapter.gloss}</span>
              </h2>
              <p className="t-statement mt-8 measure">
                What do people make when everything else is taken from them? Five works that refused to
                disappear.
              </p>
            </div>

            <Exhibit
              art={
                <ArtImage
                  src="/art/ramallah-dress.jpg"
                  width={1200}
                  height={1421}
                  className="h-full w-auto max-w-full"
                />
              }
              artLabel="A 19th-century Palestinian woman's dress, scarf and headdress from Ramallah, embroidered in red thread on undyed linen, on a faceless mannequin"
              title="Tatreez"
              meta="Village woman's dress, scarf and headdress, Ramallah, 19th century. Linen, cotton, metal; embroidered. The Metropolitan Museum of Art, New York, Gift of Irene Lewisohn and Alice Lewisohn Crowley, 1939. Public domain."
            >
              <p>
                Every village had its own stitches; a dress could tell you where a woman came from.
                Families who lost their villages in 1948 kept stitching them. In 2021, UNESCO inscribed
                tatreez as cultural heritage of humanity.
              </p>
              <p className="t-small mt-3 text-paper-dim">
                Look at the borders: red thread on undyed linen, every band a row of small crosses,
                sewn by hand more than a century ago.
              </p>
            </Exhibit>

            <Exhibit
              art={<ChildFromBehind className="h-full w-auto text-paper" />}
              artLabel="Ink drawing of a barefoot child seen from behind, hands clasped at his back"
              title="Handala"
              meta="Naji al-Ali, from 1969. Ink, in daily newspaper cartoons."
            >
              <p>
                A ten-year-old refugee boy, barefoot, hands clasped behind his back, his face turned
                away from us. Al-Ali said Handala would turn around only when Palestine is free. Al-Ali
                was shot in London in 1987. Handala has not turned around.
              </p>
              <p className="t-small mt-3 text-paper-dim">
                This drawing is an homage to the pose, made for this piece. The child you walked with in
                Gaza wore it too.
              </p>
            </Exhibit>

            <Exhibit
              art={
                <div className="flex h-full items-center">
                  <Watermelon className="w-full" />
                </div>
              }
              artLabel="A slice of watermelon, drained of colour"
              title="Not even a watermelon"
              meta="Sliman Mansour, Nabil Anani and Issam Badr. Gallery 79, Ramallah, 1980."
            >
              <p>
                The Israeli army shut their exhibition within hours. The artists were told that red,
                green, black and white together, the colours of the Palestinian flag, were forbidden,
                and that even a painted watermelon would be confiscated. Sliman Mansour died in August
                2026, at 79.
              </p>
              <p className="mt-3 italic">
                Have you noticed? This piece has never shown you those four colours together. Not yet.
              </p>
            </Exhibit>

            <Exhibit
              art={<Kite className="h-full w-auto" />}
              artLabel="A diamond kite with a ribboned tail, drained of colour"
              title="If I Must Die"
              meta="Refaat Alareer, 2011. Poem."
            >
              <p>
                A poet and teacher of English literature in Gaza, killed in an Israeli airstrike on 6
                December 2023. His poem asks whoever survives him to tell his story, and to fly a kite.
                It has since been translated into dozens of languages and flown on kites around the
                world.
              </p>
              <blockquote className="t-statement mt-4 italic">
                “If I must die, you must live to tell my story.”
              </blockquote>
            </Exhibit>

            <Exhibit
              art={
                <ArtImage
                  src="/art/spoliarium.jpg"
                  width={2000}
                  height={1078}
                  className="max-md:h-auto max-md:w-full md:h-full md:w-auto md:max-w-full"
                />
              }
              artLabel="Juan Luna's Spoliarium: in a dim Roman arena, slaves drag the body of a fallen gladiator by a chain while onlookers crowd the left and a woman kneels at the right"
              title="Spoliarium"
              meta="Juan Luna, 1884. Oil on canvas, 4.22 × 7.675 m. National Museum of Fine Arts, Manila. Public domain."
              wide
            >
              <p>
                Fallen gladiators dragged out of a Roman arena. Filipinos have long read it as an image
                of a colonized people: our own art bore witness too. It is one of the largest paintings
                in the country, and entry to the National Museum is free. Go and stand in front of it.
              </p>
            </Exhibit>

            <p className="t-statement w-[min(86vw,28rem)] shrink-0">
              Art is how a people says: we were here, and we are still here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Exhibit({
  art,
  artLabel,
  title,
  meta,
  children,
  wide = false,
}: {
  art: ReactNode;
  artLabel: string;
  title: string;
  meta: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <figure
      className={`m-0 grid shrink-0 items-end gap-x-10 gap-y-6 max-md:w-[84vw] md:grid-cols-[auto_minmax(0,22rem)] ${
        wide ? "md:w-[min(92vw,74rem)]" : "md:w-[min(86vw,52rem)]"
      }`}
    >
      <div
        role="img"
        aria-label={artLabel}
        className={`flex h-[min(52svh,30rem)] items-center justify-center max-md:h-[40svh] ${wide ? "md:h-[min(46svh,26rem)]" : ""}`}
      >
        {art}
      </div>
      <figcaption className="t-body pb-2">
        <h3 className="t-headline italic">{title}</h3>
        <p className="t-small mt-3 text-paper-dim">{meta}</p>
        <div className="mt-4">{children}</div>
      </figcaption>
    </figure>
  );
}

/** A real work, shown whole. The size is given so the track's width is known before it loads. */
function ArtImage({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: nothing to optimise on a server
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      decoding="async"
      className={`block object-contain shadow-[0_28px_60px_-28px_rgba(0,0,0,0.9)] ${className}`}
    />
  );
}
