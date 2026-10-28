"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { store } from "@/lib/store";

/** Every 3D scene in the piece. Each module builds its geometry once in prepare(). */
const SCENES = [
  () => import("@/components/three/KeyStage"),
  () => import("@/components/three/WalkStage"),
  () => import("@/components/three/LightsStage"),
  () => import("@/components/three/GlobeStage"),
];

/** If a download stalls, the page lets go anyway; the scenes then load as you reach them. */
const GIVE_UP_MS = 15000;

/** Lets the dust beam and the title keep moving between the heavy steps. */
const breathe = () => new Promise((resolve) => setTimeout(resolve, 16));

/**
 * The first screen needs nothing heavy, so it shows at once. Scrolling waits until every 3D
 * scene is downloaded and built, so nobody walks into an empty stage. This line under the
 * title counts the scenes in, then becomes the usual hint.
 */
export function LoadGate({ className = "" }: { className?: string }) {
  const [done, setDone] = useState(0);
  const [away, setAway] = useState(false);
  const total = SCENES.length + 1;

  useEffect(() => {
    let live = true;
    const release = () => {
      if (!live || store.get().ready) return;
      store.set({ ready: true });
      document.documentElement.classList.remove("loading");
      ScrollTrigger.refresh();
    };
    const timer = window.setTimeout(release, GIVE_UP_MS);

    // A reload can land mid-piece, far from this line; a second copy then shows at the bottom.
    const onScroll = () => setAway(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    (async () => {
      const downloads = SCENES.map((load) => load());
      await document.fonts?.ready;
      if (live) setDone(1);
      for (const download of downloads) {
        const scene = await download;
        await breathe();
        scene.prepare();
        if (live) setDone((n) => n + 1);
      }
    })()
      .catch(() => undefined)
      .finally(release);

    return () => {
      live = false;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const percent = Math.round((done / total) * 100);
  const status = (
    <>
      <span role="status">Preparing the scenes</span>{" "}
      <span aria-hidden className="tabular">
        {percent}%
      </span>
      <span aria-hidden className="mt-2.5 block h-px w-[min(13rem,60vw)] bg-paper/15">
        <span
          className="block h-full origin-left bg-lamp transition-transform duration-500 ease-[var(--ease-out-expo)]"
          style={{ transform: `scaleX(${done / total})` }}
        />
      </span>
    </>
  );

  return (
    <>
      <p className={`t-small text-paper-dim ${className}`}>
        <span className="[html.loading_&]:hidden">Scroll slowly. Sound is optional, top right.</span>
        <span className="[html:not(.loading)_&]:hidden">{status}</span>
      </p>
      {away && (
        <p
          aria-hidden
          className="t-small pointer-events-none fixed inset-x-0 bottom-[6svh] z-50 flex justify-center text-paper [html:not(.loading)_&]:hidden"
        >
          <span className="bg-night/90 px-4 py-2.5">{status}</span>
        </p>
      )}
    </>
  );
}
