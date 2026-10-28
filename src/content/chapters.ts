export type Chapter = {
  id: string;
  /** Filipino title, the one shown large. */
  title: string;
  /** English gloss. */
  gloss: string;
};

export const CHAPTERS: Chapter[] = [
  { id: "simula", title: "Simula", gloss: "Beginning" },
  { id: "tahanan", title: "Tahanan", gloss: "Home" },
  { id: "susi", title: "Susi", gloss: "The key" },
  { id: "boto", title: "Boto", gloss: "The vote" },
  { id: "pader", title: "Pader", gloss: "The wall" },
  { id: "lakad", title: "Lakad", gloss: "The walk" },
  { id: "bilang", title: "Bilang", gloss: "The count" },
  { id: "sining", title: "Sining", gloss: "The art" },
  { id: "sinulid", title: "Sinulid", gloss: "The thread" },
  { id: "halaga", title: "Halaga", gloss: "The price" },
  { id: "kalayaan", title: "Kalayaan", gloss: "Freedom" },
];
