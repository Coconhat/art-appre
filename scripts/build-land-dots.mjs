// Samples the globe evenly (Fibonacci sphere) and keeps the points that fall on land.
// The output feeds the embroidered globe in the "Sinulid" chapter: every point becomes
// one cross-stitch. Run with: node scripts/build-land-dots.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const topo = JSON.parse(
  readFileSync(join(root, "node_modules/world-atlas/land-110m.json"), "utf8"),
);
const land = feature(topo, topo.objects.land);

const SAMPLES = 26000;
const golden = Math.PI * (3 - Math.sqrt(5));
const dots = [];

for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // Antarctica would only add noise at the bottom of the globe
  if (geoContains(land, [lon, lat])) dots.push(+lat.toFixed(2), +lon.toFixed(2));
}

const out = join(root, "src/data/land-dots.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(dots));
console.log(`${dots.length / 2} land stitches written to ${out}`);
