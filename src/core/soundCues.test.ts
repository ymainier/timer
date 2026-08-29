import { describe, it, expect } from "vitest";
import { soundCues } from "./soundCues";
import { DEFAULT, type State } from "./roundTimer";

type RunningState = Extract<State, { status: "started" | "paused" }>;

function runningAt(duration: number): RunningState {
  return {
    status: "started",
    duration,
    lastTick: 1_000,
    preparationDuration: DEFAULT.PREPARATION_DURATION,
    roundDuration: DEFAULT.ROUND_DURATION,
    restDuration: DEFAULT.REST_DURATION,
    alarmTime: DEFAULT.ALARM_TIME,
  };
}

describe("soundCues", () => {
  it("emits phase-changed when crossing preparation -> round", () => {
    // prep ends at 10_000
    expect(soundCues(runningAt(9_900), runningAt(10_100))).toEqual([
      "phase-changed",
    ]);
  });

  it("emits phase-changed when crossing round -> rest", () => {
    // round ends at 10_000 + 180_000 = 190_000
    expect(soundCues(runningAt(189_900), runningAt(190_100))).toEqual([
      "phase-changed",
    ]);
  });

  it("emits entered-alarm when time crosses down through alarmTime", () => {
    // alarm at 30_000 left in the round: round ends at 190_000, so 30s left is
    // duration 160_000. Cross from just above to just below.
    const cues = soundCues(runningAt(159_900), runningAt(160_100));
    expect(cues).toContain("entered-alarm");
    expect(cues).not.toContain("phase-changed");
  });

  it("emits prep-countdown when a preparation second ticks under 5s", () => {
    // prep counts down from 10s; under-5s boundary. 6s left -> 4s left region:
    // duration 5_900 (4.1s left) vs 6_100 (3.9s left) crosses the 4s boundary.
    expect(soundCues(runningAt(5_900), runningAt(6_100))).toEqual([
      "prep-countdown",
    ]);
  });

  it("stays silent when preparation crosses a second but more than 5s remain", () => {
    // 8.1s left -> 7.9s left: crosses the 8->7 boundary, still above 5s
    expect(soundCues(runningAt(1_900), runningAt(2_100))).toEqual([]);
  });

  it("emits nothing when the previous state was not started", () => {
    const paused: State = { ...runningAt(9_900), status: "paused" };
    expect(soundCues(paused, runningAt(10_100))).toEqual([]);
  });

  it("emits nothing when the next state is not started", () => {
    const paused: State = { ...runningAt(10_100), status: "paused" };
    expect(soundCues(runningAt(9_900), paused)).toEqual([]);
  });

  it("emits nothing on a steady tick within a round", () => {
    expect(soundCues(runningAt(40_000), runningAt(40_100))).toEqual([]);
  });
});
