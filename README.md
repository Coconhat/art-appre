# Gaano Kalayo? (How far is far?)

An interactive artwork about Palestine, and how close it is to the Philippines, made for an Art
Appreciation final by Nhat Vu Le, Jay-el Oconer, Renzo Cabral and Marc Bradley Arboleda. Ten
scroll-driven parts with 3D scenes, procedural art and live sound.

- **Present it:** [docs/PRESENTER_GUIDE.md](docs/PRESENTER_GUIDE.md)
- **What everything means:** the Artist statement page at `/statement`
- **Every number and its source:** [src/content/facts.ts](src/content/facts.ts) and
  [src/content/sources.ts](src/content/sources.ts)
- **Your names on the credits:** [src/content/credits.ts](src/content/credits.ts)

## Run it

```bash
npm install
npm run dev        # while editing, http://localhost:3000
npm run build && npm run start   # for presenting (smoother)
```

## How it is built

| Part | File | Technique |
| --- | --- | --- |
| Simula | `src/components/chapters/Threshold.tsx` | canvas dust in a light beam |
| Tahanan | `Home.tsx`, `PackTags.tsx` | scroll-scrubbed doorway, packing choice remembered |
| Susi | `KeyChapter.tsx`, `three/KeyStage.tsx` | procedural 3D key, rust shader |
| Boto | `Vote.tsx` | typewritten roll call, SVG pencil circle |
| Pader | `Wall.tsx` | horizontal scroll, SVG spray-paint filter |
| Lakad | `Walk.tsx`, `three/WalkStage.tsx`, `three/walkData.ts` | instanced 3D Gaza Strip, steerable walk |
| Bilang | `Count.tsx`, `three/LightsStage.tsx` | 74,561-point shader field |
| Sining | `Gallery.tsx`, `art/*`, `public/art/*` | two real public-domain works (Met dress, Luna's Spoliarium), SVG homages for the rest |
| Sinulid | `Thread.tsx`, `three/GlobeStage.tsx` | cross-stitch globe, running-stitch threads |
| Halaga | `Price.tsx`, `art/Ripples.tsx`, `art/PriceBoard.tsx` | canvas ripples, SVG seven-segment fuel price board |
| Kalayaan | `Freedom.tsx`, `art/KiteSky.tsx` | flag assembly, kite physics |

Scroll choreography is in `src/hooks/useChapter.ts` (GSAP ScrollTrigger + Lenis). The globe's land
stitches come from `scripts/build-land-dots.mjs`. Sound is in `src/lib/audio.ts`.

## Design skills for Claude Code

The project ships with design and animation skills in `.claude/skills/`; see
[docs/SKILLS.md](docs/SKILLS.md) for what each one is for and where it came from.
