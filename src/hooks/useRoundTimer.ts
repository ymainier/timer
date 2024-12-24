import { useEffect, useCallback, useReducer, useRef, RefObject } from "react";

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

const DEFAULT = Object.freeze({
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

type Action =
  | { type: "START"; payload: number }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK"; payload: number }
  | {
      type: "UPDATE";
      payload: {
        roundDuration: number;
        restDuration: number;
        alarmTime: number;
      };
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
        preparationDuration: DEFAULT.PREPARATION_DURATION,
        roundDuration: action.payload.roundDuration,
        restDuration: action.payload.restDuration,
        alarmTime: action.payload.alarmTime,
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

type Mode = "preparation" | "round" | "rest";
function computeModeTimeAndRound(state: State): {
  mode: Mode;
  time: number;
  currentRound: number;
} {
  let duration = state.duration ?? 0;
  if (duration < state.preparationDuration) {
    return {
      mode: "preparation",
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

  return { mode: isRound ? "round" : "rest", time, currentRound };
}

type Refs = {
  bell: RefObject<HTMLAudioElement>;
  knocks: RefObject<HTMLAudioElement>;
  snap: RefObject<HTMLAudioElement>;
};

function useSounds(state: State, { bell, knocks }: Refs) {
  const previousState = useRef(state);

  const { mode, time } = computeModeTimeAndRound(state);
  const { mode: previousMode, time: previousTime } = computeModeTimeAndRound(
    previousState.current
  );

  if (
    previousState.current.status === "stopped" &&
    state.status === "started" &&
    mode === "round"
  ) {
    bell.current?.play();
  }

  if (
    previousState.current.status === "started" &&
    state.status === "started" &&
    previousMode !== mode
  ) {
    if (bell.current) {
      bell.current.pause();
      bell.current.currentTime = 0;
      bell.current.play();
    }
  }

  if (
    previousState.current.status === "started" &&
    state.status === "started" &&
    previousTime > state.alarmTime &&
    time <= state.alarmTime
  ) {
    knocks.current?.play();
  }

  previousState.current = state;
}

export function useRoundTimer(refs: Refs) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useSounds(state, refs);

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
    (roundDuration: number, restDuration: number, alarmTime: number) => {
      dispatch({
        type: "UPDATE",
        payload: { roundDuration, restDuration, alarmTime },
      });
    },
    []
  );

  const { mode, time, currentRound } = computeModeTimeAndRound(state);

  return {
    time: formatTime(time),
    mode,
    status: state.status,
    currentRound,
    formattedRoundDuration: formatTime(state.roundDuration),
    roundDuration: state.roundDuration,
    restDuration: state.restDuration,
    alarmTime: state.alarmTime,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
  };
}
