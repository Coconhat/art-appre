# Design skills installed for this project

These live in `.claude/skills/` and load automatically when Claude Code works in this folder.
Each was read before installing; nothing in them was run during setup. Licences are kept inside
each skill folder.

## Taste and anti-"AI slop" design

| Skill | Source | Use it for |
| --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (official) | Distinctive art direction; the list of generated-page tells to avoid |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Strict house rules (no eyebrows, gradients, glass, icon cards), layout and type laws, critique loop. Its scripts need Node 22+ |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `/impeccable audit`, `polish`, `bolder`, `quieter`, `typeset`, `animate`… Its launcher downloads a checksummed binary on first use |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (official) | Reviewing UI code against Vercel's interface guidelines |
| `algorithmic-art` | anthropics/skills (official) | Generative-art thinking for new procedural pieces |

## Motion and scroll

| Skill | Source | Use it for |
| --- | --- | --- |
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `gsap-performance`, `gsap-utils`, `gsap-frameworks` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (official) | Every scroll-scrubbed timeline in the piece |
| `scrollytelling` | [doodledood/claude-code-plugins](https://github.com/doodledood/claude-code-plugins) | Narrative scroll patterns, accessibility, mobile viewport units |
| `emil-design-eng`, `animate`, `improve-animations`, `review-animations`, `animation-performance`, `animation-vocabulary`, `find-animation-opportunities` | [emilkowalski/skill](https://github.com/emilkowalski/skill) | Easing, duration and craft of interface motion |

## 3D and WebGL

| Skill | Source | Use it for |
| --- | --- | --- |
| `threejs-fundamentals`, `-geometry`, `-materials`, `-lighting`, `-shaders`, `-textures`, `-animation`, `-interaction`, `-postprocessing`, `-performance`, `-react-three-fiber` | [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) | The key, the Gaza walk, the lights and the globe |
| `img2threejs` | [hoainho/img2threejs](https://github.com/hoainho/img2threejs) | Rebuilding an object from a reference photo as procedural Three.js. Needs Python 3 for its pipeline |

## React and shipping

| Skill | Source | Use it for |
| --- | --- | --- |
| `vercel-react-best-practices` | vercel-labs/agent-skills (official) | React and Next.js performance rules |
| `deploy-to-vercel` | vercel-labs/agent-skills (official) | Putting the piece online so classmates can open it on their phones |

## Looked at and left out

- **ScrollCraft:** no public repository could be found, and it requires a paid fal.ai key. The GSAP
  ScrollTrigger and scrollytelling skills cover the same ground.
- **Motion.dev / Anime.js:** no official skill exists yet; GSAP (now free, including all plugins)
  does everything this piece needs.
- `ui-ux-pro-max` was already installed for your user account, so it was not duplicated here.
