@AGENTS.md

# Gaano Kalayo? — notes for Claude

An interactive artwork (Art Appreciation final) about Palestine and its closeness to the
Philippines. Read `DESIGN.md` before changing anything visual; it records the decisions that
carry meaning, and breaking one of them breaks the piece's argument.

- Use the project skills in `.claude/skills/` (see `docs/SKILLS.md`): `frontend-design` and
  `design-taste-frontend` for visual work, the `gsap-*` skills for scroll motion, the `threejs-*`
  skills for scenes.
- Every number shown lives in `src/content/facts.ts` with its source in `src/content/sources.ts`.
  Never add a claim without a source; never invent casualties, quotes or names.
- Shader uniforms must live on materials created in `useMemo` (React Three Fiber copies uniforms
  passed as JSX props, so per-frame updates to the original object never reach the GPU).
- The site is a static export (`output: "export"` in `next.config.ts`): no server features
  (route handlers, server actions, ISR, `next/image` optimisation, Cache Components).
  `npm run start` serves the built `out/` folder.
- Client components must not call `Math.random()`/`Date.now()` during render (it breaks
  hydration of the prerendered HTML). Use `mulberry32` from `src/lib/random.ts`.
