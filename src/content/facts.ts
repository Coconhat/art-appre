/**
 * Every number the artwork states lives here, with the date it was true.
 * Before presenting, check the sources page and update anything that has moved.
 */
export const FACTS = {
  /** Gaza Ministry of Health, total reported killed since 7 October 2023. */
  killed: 74_561,
  injured: 175_759,
  killedAsOf: "27 October 2026",

  /** Gaza Ministry of Health count of children killed, June 2025 (the total has risen since). */
  childrenKilled: 17_121,

  /** OCHA, 22 October 2026: people killed since the October 2025 ceasefire was announced. */
  killedSinceCeasefire: 1_522,
  childrenKilledSinceCeasefire: 351,

  /** Lancet capture–recapture study (Jan 2025): estimated undercount to 30 June 2024. */
  lancetUndercountPct: 41,

  /** CPJ, June 2026: journalists and media workers killed since 7 October 2023. */
  journalistsKilled: 250,

  /** UNRWA personnel killed (staff and partners), March 2026. */
  unrwaKilled: 391,

  /** UNOSAT satellite assessment, October 2025. */
  structuresDamagedPct: 81,

  gazaAreaKm2: 365,
  gazaLengthKm: 41,
  gazaPopulation: "2.1 million",
  quezonCityAreaKm2: 171.7,

  nakbaRefugees: "750,000",
  palestineRefugeesToday: "nearly 6 million",
  yearsSinceNakba: 78,

  manilaToGazaKm: 8_843,

  /** 1947 roll call on General Assembly Resolution 181 (II). */
  vote1947: { yes: 33, no: 13, abstained: 10, absent: 1 },

  filipinosInIsrael: "about 30,000",
  filipinosInGaza2023: 136,
  galaxyLeaderFilipinos: 17,
  galaxyLeaderDays: 429,

  kitesRecord: { count: 12_350, date: "28 July 2011" },

  // Halaga (the price): how the region's wars reached the pump, the market and the world.
  /** UN, EU and World Bank damage and needs assessment, April 2026. */
  gazaRebuildBillionUsd: 71.4,
  /** Suez Canal Authority revenue, FY2022/23 vs FY2023/24, billion USD. */
  suezRevenueBefore: 9.4,
  suezRevenueAfter: 7.2,
  /** Brent crude, per barrel, before the 2026 Iran war and at its late-March peak. */
  brentBefore: 72,
  brentPeak: 118,
  /** Share of oil through the Strait of Hormuz bound for Asia (2024). */
  hormuzToAsiaPct: 84,
  /** DOE: share of Philippine crude imports from the Middle East (March 2026). */
  phCrudeFromMiddleEastPct: 98,
  /** GMA News Research, 1 March 2026. */
  filipinosInMiddleEast: "about 2.4 million",
  /** Diesel per litre: national reading 9 Feb 2026; DOE Metro Manila monitoring after. */
  diesel: {
    before: 56.5,
    lateMarchLow: 105,
    lateMarchHigh: 131.9,
    lateMarchCommon: 119.2,
    peak: 153.7,
    now: 93.3,
  },
  /** PSA headline inflation via Trading Economics. */
  inflationFeb2026: 2.4,
  inflationApr2026: 7.2,
  /** PIDS, April 2026 (lower-bound scenario). */
  pushedIntoPoverty: "1.34 million",
} as const;

export const fmt = (n: number) => n.toLocaleString("en-US");

/** 74,561 candles, one per second, without stopping. */
export function timeToLightAll(count: number = FACTS.killed) {
  const hours = Math.floor(count / 3600);
  const minutes = Math.round((count % 3600) / 60);
  return { hours, minutes };
}
