# Design

## Idea

The question *Gaano kalayo?* (How far?) is asked on the first screen and answered on the last:
*Hindi malayo.* It is not far. Curiosity comes before advocacy: Palestine is named in part three,
"Free Palestine" is said in part nine.

## Rules that carry meaning

1. **The four flag colours never appear together before *Kalayaan*.** Red (thread), black (night)
   and white (text) may appear; green does not, and never all four. The watermelon and kite are
   greyscale in *Sining*. This mirrors the 1967–1993 flag ban and the 1980 Gallery 79 closure.
2. **Questions are italic.** The voice of the one asking.
3. **The child is always seen from behind** (homage to Handala). He never turns around.
4. **Scroll is the only clock.** No autoplaying sequences except ambient life (dust, flicker, kite).
5. **No photographs of victims.** People appear as light, figures and names.

## Tokens (`src/app/globals.css`)

| Token | Hex | From |
| --- | --- | --- |
| night | `#0b1621` | Gaza at night during a blackout |
| lamp | `#f0b965` | the oil lamp / candle |
| paper | `#e6e0d4` | text on night |
| dust | `#cdc7bc` | concrete dust |
| ink | `#1c1b19` | text on dust |
| concrete | `#a19e96` | the separation wall |
| linen | `#151311` | black linen of a thob |
| thread | `#a3162a` | madder-red tatreez thread |
| sun | `#f2c230` | the Philippine sun |
| LED red | `#ff3d24` | the roadside fuel price board in *Halaga* |
| flag-* | `#000 #fff #007a3d #ce1126` | held back until *Kalayaan* |

## Type

Newsreader (variable, optical sizes) for everything Latin; Amiri for Arabic; Courier Prime only
inside the 1947 roll-call replica. Three sizes do the work: `.t-display`, `.t-headline`/`.t-statement`,
`.t-body`. Each is sized for a phone first (16px body, 20px statement) and grows with the screen.

## Layout

One outer margin (`.frame`). Pinned stages (`.stage`, 100svh, sticky) inside tall sections; text
on the left half on wide screens, at the bottom on phones (`.over-scene` gives it a solid band).
Lines that take turns share one grid cell (`.beats`), so the block is as tall as its longest line
and never runs off a phone screen. Scrolling is held until every 3D scene is built (`LoadGate`).
