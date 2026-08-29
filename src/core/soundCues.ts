import { read, type State } from "./roundTimer";

/**
 * A cue names why a sound should fire, in the timer's own terms — not which
 * audio file plays. The playback adapter maps cues to sounds.
 */
export type Cue = "phase-changed" | "entered-alarm" | "prep-countdown";

/**
 * Derive the cues produced by a transition from `prev` to `next`.
 *
 * Every cue is a transition, so both states are needed. All cues are gated on
 * the timer running across the transition (`started -> started`): a paused or
 * stopped timer makes no sound.
 */
export function soundCues(prev: State, next: State): Cue[] {
  if (prev.status !== "started" || next.status !== "started") return [];

  const { mode, time } = read(next);
  const { mode: prevMode, time: prevTime } = read(prev);

  const cues: Cue[] = [];

  if (prevMode !== mode) {
    cues.push("phase-changed");
  }

  if (prevTime > next.alarmTime && time <= next.alarmTime) {
    cues.push("entered-alarm");
  }

  if (
    mode === "preparation" &&
    Math.floor(prevTime / 1000) !== Math.floor(time / 1000) &&
    Math.floor(time / 1000) < 5
  ) {
    cues.push("prep-countdown");
  }

  return cues;
}
