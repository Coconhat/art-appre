"use client";

import { useEffect } from "react";
import { ambient } from "@/lib/audio";
import { CHAPTERS } from "@/content/chapters";
import { store, useStore } from "@/lib/store";

export function SoundToggle() {
  const on = useStore((s) => s.sound);

  useEffect(() => {
    if (!on) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) ambient.setMood(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [on]);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        const next = !store.get().sound;
        if (next) ambient.start();
        else ambient.stop();
        store.set({ sound: next });
      }}
      className="cursor-pointer bg-transparent p-0 text-inherit underline-offset-[0.18em] hover:underline"
    >
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
