"use client";

import { useEffect, useState } from "react";
import { store, useStore } from "@/lib/store";
import { mulberry32 } from "@/lib/random";

const ITEMS = [
  "Photographs",
  "Phone and charger",
  "Water",
  "The house key",
  "Birth certificates",
  "Medicine",
  "A blanket",
  "Rice",
  "The cat",
  "Lola's rosary",
  "Your diploma",
  "Cash",
] as const;

const KEY = "The house key";
const LIMIT = 3;

// Luggage tags hang a little crooked; the angles are fixed so every screen shows the same table.
const rand = mulberry32(7);
const TILTS = ITEMS.map(() => (rand() - 0.5) * 7);

/** The one live thing in "Tahanan": pack three things, and the piece answers your choice. */
export function PackTags() {
  const packed = useStore((s) => s.packed);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("gk-packed") ?? "[]");
      if (Array.isArray(saved)) store.set({ packed: saved.filter((s) => ITEMS.includes(s)).slice(0, LIMIT) });
    } catch {
      /* private mode or blocked storage: start empty */
    }
  }, []);

  const toggle = (item: string) => {
    const current = store.get().packed;
    let next: string[];
    if (current.includes(item)) next = current.filter((i) => i !== item);
    else if (current.length < LIMIT) next = [...current, item];
    else return;
    store.set({ packed: next });
    setAnnounce(next.length === LIMIT ? "Your bag is full." : `${next.length} of ${LIMIT} packed.`);
    try {
      localStorage.setItem("gk-packed", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const full = packed.length === LIMIT;
  const tookKey = packed.includes(KEY);

  return (
    <div className="frame relative pb-[18svh] pt-[6svh]">
      <h3 className="t-statement measure">
        Choose three. You can change your mind, but not for long.
      </h3>

      <ul className="mt-10 grid max-w-[68rem] grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
        {ITEMS.map((item, i) => {
          const isPacked = packed.includes(item);
          const locked = full && !isPacked;
          return (
            <li key={item} style={{ rotate: `${TILTS[i]}deg` }} className="transition-[rotate] duration-500">
              <button
                type="button"
                aria-pressed={isPacked}
                disabled={locked}
                onClick={() => toggle(item)}
                className={`group relative flex h-[4.6rem] w-full cursor-pointer items-center gap-3 pl-10 pr-3 text-left sm:pl-12 sm:pr-4 text-ink transition duration-300 ease-[var(--ease-out-expo)] tex-paper [clip-path:polygon(14%_0,100%_0,100%_100%,14%_100%,0_70%,0_30%)] hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-35 ${
                  isPacked ? "-translate-y-1" : ""
                }`}
              >
                {/* eyelet */}
                <span aria-hidden className="absolute left-[7%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-night" />
                <span className="t-body leading-tight">{item}</span>
                <span
                  aria-hidden
                  className={`absolute right-1.5 top-1.5 shrink-0 -rotate-12 border-2 border-thread bg-[#e9e2d3] px-1.5 text-[0.7rem] italic leading-5 text-thread transition duration-300 sm:static sm:ml-auto sm:bg-transparent ${
                    isPacked ? "scale-100 opacity-100" : "scale-125 opacity-0"
                  }`}
                >
                  packed
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <div
        className={`mt-14 max-w-[44rem] transition duration-700 ease-[var(--ease-out-expo)] ${
          full ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!full}
      >
        <p className="t-statement">
          {tookKey
            ? "You took the key. Of course you did: you mean to come back."
            : "You left the key behind. Most people don't. They take it, because they mean to come back."}
        </p>
        <p className="t-body mt-5 measure-wide text-paper-dim">
          Families in one place on this earth have had to make this choice for real, and more than
          once. Keep scrolling to meet them.
        </p>
      </div>
    </div>
  );
}
