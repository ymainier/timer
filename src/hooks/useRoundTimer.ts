import { useEffect, useCallback, useReducer, useRef, RefObject } from "react";

export type State =
  | {
      status: "stopped";
      duration: null;
      lastTick: null;
      roundDuration: number;
      restDuration: number;
      alarmTime: number;
    }
  | {
      status: "started" | "paused";
      duration: number;
      lastTick: number;
      roundDuration: number;
      restDuration: number;
      alarmTime: number;
    };

const DEFAULT = Object.freeze({
  ROUND_DURATION: 180_000,
  REST_DURATION: 60_000,
  ALARM_TIME: 30_000,
});

export const initialState: State = Object.freeze({
  status: "stopped",
  duration: null,
  lastTick: null,
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

function computeTimeAndRound(state: State) {
  const duration = state.duration ?? 0;
  const durationModuloRoundPlusRest =
    duration % (state.roundDuration + state.restDuration);
  const isRound = durationModuloRoundPlusRest < state.roundDuration;

  const time = isRound
    ? state.roundDuration - durationModuloRoundPlusRest
    : state.roundDuration + state.restDuration - durationModuloRoundPlusRest;

  const currentRound =
    Math.floor(duration / (state.roundDuration + state.restDuration)) + 1;

  return { isRound, time, currentRound };
}

type Refs = {
  bell: RefObject<HTMLAudioElement>;
  knocks: RefObject<HTMLAudioElement>;
  snap: RefObject<HTMLAudioElement>;
};

function useSounds(state: State, { bell, knocks }: Refs) {
  const previousState = useRef(state);

  const { isRound, time } = computeTimeAndRound(state);
  const { isRound: previousIsRound, time: previousTime } = computeTimeAndRound(
    previousState.current
  );

  if (
    previousState.current.status === "stopped" &&
    state.status === "started"
  ) {
    bell.current?.play();
  }

  if (
    previousState.current.status === "started" &&
    state.status === "started" &&
    previousIsRound !== isRound
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

  const { isRound, time, currentRound } = computeTimeAndRound(state);

  return {
    time: formatTime(time),
    isRound,
    status: state.status,
    currentRound,
    roundDuration: state.roundDuration,
    restDuration: state.restDuration,
    alarmTime: state.alarmTime,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
  };
}
