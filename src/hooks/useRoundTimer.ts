import { useEffect, useCallback, useReducer, useRef, RefObject } from "react";
import { reducer, initialState, read, type State } from "../core/roundTimer";

type Refs = {
  bell: RefObject<HTMLAudioElement>;
  knocks: RefObject<HTMLAudioElement>;
  snap: RefObject<HTMLAudioElement>;
};

function useSounds(state: State, { bell, knocks, snap }: Refs) {
  const previousStateRef = useRef(state);
  const previousState = previousStateRef.current;

  const { mode, time } = read(state);
  const { mode: previousMode, time: previousTime } = read(previousState);

  if (
    previousState.status === "started" &&
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
    previousState.status === "started" &&
    state.status === "started" &&
    previousTime > state.alarmTime &&
    time <= state.alarmTime
  ) {
    knocks.current?.play();
  }

  if (
    mode === "preparation" &&
    Math.floor(previousTime / 1000) !== Math.floor(time / 1000) &&
    Math.floor(time / 1000) < 5
  ) {
    snap.current?.play();
  }

  previousStateRef.current = state;
}

export function useWakeLock(shouldLock: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.error("Failed to acquire wake lock:", err);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release().catch(console.error);
    wakeLockRef.current = null;
  }, []);

  useEffect(() => {
    if (shouldLock) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [shouldLock, requestWakeLock, releaseWakeLock]);

  // Reacquire wake lock when the tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && shouldLock) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [shouldLock, requestWakeLock]);
}

export function useRoundTimer(refs: Refs) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useSounds(state, refs);
  useWakeLock(state.status === "started" || state.status === "paused");

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

  const { mode, time, currentRound } = read(state);

  return {
    time,
    mode,
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
