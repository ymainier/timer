import { describe, it, expect } from "vitest";
import {
  reducer,
  read,
  initialState,
  DEFAULT,
  type State,
} from "./roundTimer";

type RunningState = Extract<State, { status: "started" | "paused" }>;

/** A running state at an arbitrary elapsed duration, with default durations. */
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

describe("reducer", () => {
  it("START from stopped begins at duration 0", () => {
    const next = reducer(initialState, { type: "START", payload: 5_000 });
    expect(next.status).toBe("started");
    expect(next.duration).toBe(0);
    expect(next.lastTick).toBe(5_000);
  });

  it("START while already started is a no-op", () => {
    const started = reducer(initialState, { type: "START", payload: 5_000 });
    const again = reducer(started, { type: "START", payload: 9_000 });
    expect(again).toBe(started);
  });

  it("START from paused resumes without losing elapsed duration", () => {
    const paused: State = { ...runningAt(42_000), status: "paused" };
    const resumed = reducer(paused, { type: "START", payload: 7_000 });
    expect(resumed.status).toBe("started");
    expect(resumed.duration).toBe(42_000);
    expect(resumed.lastTick).toBe(7_000);
  });

  it("PAUSE only acts on a started timer", () => {
    expect(reducer(initialState, { type: "PAUSE" })).toBe(initialState);
    const started = reducer(initialState, { type: "START", payload: 0 });
    expect(reducer(started, { type: "PAUSE" }).status).toBe("paused");
  });

  it("RESET returns to stopped and clears duration", () => {
    const next = reducer(runningAt(50_000), { type: "RESET" });
    expect(next.status).toBe("stopped");
    expect(next.duration).toBeNull();
    expect(next.lastTick).toBeNull();
  });

  it("TICK accumulates elapsed time by the wall-clock delta", () => {
    const state = runningAt(10_000); // lastTick 1_000
    const next = reducer(state, { type: "TICK", payload: 1_400 });
    expect(next.duration).toBe(10_400);
    expect(next.lastTick).toBe(1_400);
  });

  it("TICK is ignored when not started", () => {
    expect(reducer(initialState, { type: "TICK", payload: 500 })).toBe(
      initialState
    );
  });

  it("UPDATE applies new durations and resets to stopped", () => {
    const next = reducer(runningAt(50_000), {
      type: "UPDATE",
      payload: { roundDuration: 120_000, restDuration: 30_000, alarmTime: 20_000 },
    });
    expect(next.status).toBe("stopped");
    expect(next.duration).toBeNull();
    expect(next.roundDuration).toBe(120_000);
    expect(next.restDuration).toBe(30_000);
    expect(next.alarmTime).toBe(20_000);
    expect(next.preparationDuration).toBe(DEFAULT.PREPARATION_DURATION);
  });
});

describe("read — phase math", () => {
  it("stopped state reads as preparation counting down from the prep duration", () => {
    expect(read(initialState)).toEqual({
      mode: "preparation",
      time: DEFAULT.PREPARATION_DURATION,
      currentRound: 0,
    });
  });

  it("mid-preparation counts down, round 0", () => {
    expect(read(runningAt(4_000))).toEqual({
      mode: "preparation",
      time: 6_000,
      currentRound: 0,
    });
  });

  it("just past preparation enters round 1 at full round time", () => {
    // duration == prep (10s) => 0 into round 1
    expect(read(runningAt(10_000))).toEqual({
      mode: "round",
      time: DEFAULT.ROUND_DURATION,
      currentRound: 1,
    });
  });

  it("counts down within round 1", () => {
    // 10s prep + 30s into round => 150s left
    expect(read(runningAt(40_000))).toEqual({
      mode: "round",
      time: 150_000,
      currentRound: 1,
    });
  });

  it("enters rest after the round ends", () => {
    // 10s prep + 180s round => start of rest, 60s left
    expect(read(runningAt(190_000))).toEqual({
      mode: "rest",
      time: DEFAULT.REST_DURATION,
      currentRound: 1,
    });
  });

  it("wraps into round 2 after the first rest", () => {
    // 10s prep + 180s round + 60s rest => start of round 2
    expect(read(runningAt(250_000))).toEqual({
      mode: "round",
      time: DEFAULT.ROUND_DURATION,
      currentRound: 2,
    });
  });
});
