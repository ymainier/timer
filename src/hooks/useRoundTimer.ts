import { useReducer, useCallback, useEffect } from "react";

export type State =
  | {
      status: "stopped";
      duration: null;
      lastTick: null;
      roundDuration: number;
      restDuration: number;
    }
  | {
      status: "started" | "paused";
      duration: number;
      lastTick: number;
      roundDuration: number;
      restDuration: number;
    };

const DEFAULT = Object.freeze({
  ROUND_DURATION: 180_000,
  REST_DURATION: 60_000,
});

export const initialState: State = Object.freeze({
  status: "stopped",
  duration: null,
  lastTick: null,
  roundDuration: DEFAULT.ROUND_DURATION,
  restDuration: DEFAULT.REST_DURATION,
});

type Action =
  | { type: "START"; payload: number }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK"; payload: number }
  | {
      type: "UPDATE";
      payload: { roundDuration: number; restDuration: number };
    };

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
        roundDuration: action.payload.roundDuration,
        restDuration: action.payload.restDuration,
      };
    }
    default:
      return state;
  }
}

const formatTime = (timeInMs: number): string => {
  const tenthsOfSeconds = Math.round(timeInMs / 100);
  const minutes = Math.floor(tenthsOfSeconds / 600);
  const seconds = Math.floor((tenthsOfSeconds % 600) / 10);
  const tenths = tenthsOfSeconds % 10;
  return `${minutes}:${seconds.toString().padStart(2, "0")}:${tenths}`;
};

export function useRoundTimer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK", payload: Date.now() });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const startTimer = useCallback(() => {
    dispatch({ type: "START", payload: Date.now() });
  }, []);
  const pauseTimer = useCallback(() => {
    dispatch({ type: "PAUSE" });
  }, []);
  const resetTimer = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);
  const updateSettings = useCallback(
    (roundDuration: number, restDuration: number) => {
      dispatch({ type: "UPDATE", payload: { roundDuration, restDuration } });
    },
    []
  );

  if (state.status === "stopped") {
    return {
      time: formatTime(state.roundDuration),
      isRound: true,
      status: state.status,
      currentRound: 1,
      roundDuration: state.roundDuration,
      restDuration: state.restDuration,
      startTimer,
      pauseTimer,
      resetTimer,
      updateSettings,
    };
  }

  const durationModuloRoundPlusRest =
    state.duration % (state.roundDuration + state.restDuration);
  const isRound = durationModuloRoundPlusRest < state.roundDuration;
  const time = isRound
    ? state.roundDuration - durationModuloRoundPlusRest
    : state.roundDuration + state.restDuration - durationModuloRoundPlusRest;

  const currentRound =
    Math.floor(state.duration / (state.roundDuration + state.restDuration)) + 1;

  return {
    time: formatTime(time),
    isRound,
    status: state.status,
    currentRound,
    roundDuration: state.roundDuration,
    restDuration: state.restDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
  };
}
