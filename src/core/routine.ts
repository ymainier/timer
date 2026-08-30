import type { Phase } from "./roundTimer";

/**
 * The Routine as the athlete authored it: the whole workout as one markdown
 * list, stored raw. One line per Round, in order. Timing-free presentation
 * that deliberately never enters the timer core — parsed on demand and looked
 * up by Round number. See docs/adr/0001-routine-outside-timer-core.md.
 */
export type Routine = string;

// A leading ordered (`1.`, `1)`) or unordered (`-`, `*`, `+`) list marker,
// followed by whitespace or the end of the line. Cosmetic: stripped for
// display, and the number never assigns Round numbers.
const MARKER = /^\s*(?:\d+[.)]|[-*+])(?:\s+|$)/;

/**
 * Split the authored Routine into one line per Round. Blank lines are dropped;
 * every other line is a Round in order (first line is Round 1). The list marker
 * is stripped, so a marker-only line yields a blank Round.
 */
export function parseRoutine(routine: Routine): string[] {
  return routine
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(MARKER, "").trim());
}

/** What the display shows below the countdown, keyed on the timer's phase. */
export type ExerciseDisplay = {
  /** True during Rest/Preparation, when the line belongs to the next Round. */
  upcoming: boolean;
  exercise: string;
};

/**
 * During a Round, show that Round's line. During Rest or Preparation, preview
 * the upcoming Round's line (Preparation, with currentRound 0, previews Round 1).
 */
export function displayedExercises(
  routine: Routine,
  phase: Phase,
  currentRound: number
): ExerciseDisplay {
  const lines = parseRoutine(routine);
  const round = phase === "round" ? currentRound : currentRound + 1;
  const exercise = round >= 1 ? lines[round - 1] ?? "" : "";
  return { upcoming: phase !== "round", exercise };
}
