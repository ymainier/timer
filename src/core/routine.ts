import type { Phase } from "./roundTimer";

/**
 * The athlete-authored Exercises for each Round. Dense and ordered: element 0
 * is Round 1, element 1 is Round 2, and so on. A Round with no Exercises is an
 * empty inner list; Rounds past the end of the array are unlabeled.
 *
 * The Routine is timing-free presentation and deliberately never enters the
 * timer core. See docs/adr/0001-routine-outside-timer-core.md.
 */
export type Routine = string[][];

/** The Exercises for a given Round number (1-based). Empty when unset. */
export function exercisesForRound(routine: Routine, round: number): string[] {
  if (round < 1) return [];
  return routine[round - 1] ?? [];
}

/** What the display shows below the countdown, keyed on the timer's phase. */
export type ExerciseDisplay = {
  /** True during Rest/Preparation, when the exercises belong to the next Round. */
  upcoming: boolean;
  exercises: string[];
};

/**
 * During a Round, show that Round's Exercises. During Rest or Preparation,
 * preview the upcoming Round's Exercises (Preparation, with currentRound 0,
 * previews Round 1).
 */
export function displayedExercises(
  routine: Routine,
  phase: Phase,
  currentRound: number
): ExerciseDisplay {
  const round = phase === "round" ? currentRound : currentRound + 1;
  return { upcoming: phase !== "round", exercises: exercisesForRound(routine, round) };
}
