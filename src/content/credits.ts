/**
 * Who made the work. Anything left empty is simply not shown.
 */
export const CREDITS = {
  names: ["Nhat Vu Le", "Jay-el Oconer", "Renzo Cabral", "Marc Bradley Arboleda"],
  course: "Art Appreciation",
  /** e.g. "De La Salle University" */
  school: "",
  term: "2026",
};

/** "A, B, C and D" */
export function namesInline(names: string[] = CREDITS.names) {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** "for Art Appreciation, De La Salle University, 2026" */
export function courseInline() {
  return [CREDITS.course, CREDITS.school, CREDITS.term].filter(Boolean).join(", ");
}
