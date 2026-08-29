import type { RoundConfig } from "./roundConfig";

export type State =
  | {
      status: "stopped";
      duration: null;
      lastTick: null;
      preparationDuration: number;
      roundDuration: number;
      restDuration: number;
      alarmTime: number;
    }
  | {
      status: "started" | "paused";
      duration: number;
      lastTick: number;
      preparationDuration: number;
      roundDuration: number;
      restDuration: number;
      alarmTime: number;
    };

export const DEFAULT = Object.freeze({
  PREPARATION_DURATION: 10_000,
  ROUND_DURATION: 180_000,
  REST_DURATION: 60_000,
  ALARM_TIME: 30_000,
});

export const initialState: State = Object.freeze({
  status: "stopped",
  duration: null,
  lastTick: null,
  preparationDuration: DEFAULT.PREPARATION_DURATION,
  roundDuration: DEFAULT.ROUND_DURATION,
  restDuration: DEFAULT.REST_DURATION,
  alarmTime: DEFAULT.ALARM_TIME,
});

export type Action =
  | { type: "START"; payload: number }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK"; payload: number }
  | { type: "UPDATE"; payload: RoundConfig };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START": {
      if (state.status === "started") return state;
      return {
        ...state,
        status: "started",
        duration: state.status === "stopped" ? 0 : state.duration,
        lastTick: action.payload,
      };
    }
    case "PAUSE": {
      if (state.status !== "started") return state;
      return { ...state, status: "paused" };
    }
    case "RESET": {
      return { ...state, status: "stopped", duration: null, lastTick: null };
    }
    case "TICK": {
      if (state.status !== "started") return state;
      return {
        ...state,
        duration: state.duration + action.payload - state.lastTick,
        lastTick: action.payload,
      };
    }
    case "UPDATE": {
      return {
        status: "stopped",
        duration: null,
        lastTick: null,
        preparationDuration: state.preparationDuration,
        roundDuration: action.payload.roundDuration,
        restDuration: action.payload.restDuration,
        alarmTime: action.payload.alarmTime,
      };
    }
    default:
      return state;
  }
}

export type Phase = "preparation" | "round" | "rest";

export function read(state: State): {
  phase: Phase;
  time: number;
  currentRound: number;
} {
  let duration = state.duration ?? 0;
  if (duration < state.preparationDuration) {
    return {
      phase: "preparation",
      time: state.preparationDuration - duration,
      currentRound: 0,
    };
  }
  duration = duration - state.preparationDuration;
  const durationModuloRoundPlusRest =
    duration % (state.roundDuration + state.restDuration);
  const isRound = durationModuloRoundPlusRest < state.roundDuration;

  const time = isRound
    ? state.roundDuration - durationModuloRoundPlusRest
    : state.roundDuration + state.restDuration - durationModuloRoundPlusRest;

  const currentRound =
    Math.floor(duration / (state.roundDuration + state.restDuration)) + 1;

  return { phase: isRound ? "round" : "rest", time, currentRound };
}
