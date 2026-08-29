import { useEffect, useCallback, useReducer, useRef, RefObject } from "react";
import { reducer, initialState, read, type State } from "../core/roundTimer";
import { soundCues, type Cue } from "../core/soundCues";
import type { RoundConfig } from "../core/roundConfig";

type Refs = {
  bell: RefObject<HTMLAudioElement>;
  knocks: RefObject<HTMLAudioElement>;
  snap: RefObject<HTMLAudioElement>;
};

/** Playback adapter: turn cues into sounds on the given audio elements. */
function playCues(cues: Cue[], { bell, knocks, snap }: Refs) {
  for (const cue of cues) {
    switch (cue) {
      case "phase-changed":
        if (bell.current) {
          bell.current.pause();
          bell.current.currentTime = 0;
          bell.current.play();
        }
        break;
      case "entered-alarm":
        knocks.current?.play();
        break;
      case "prep-countdown":
        snap.current?.play();
        break;
    }
  }
}

function useSounds(state: State, refs: Refs) {
  const previousStateRef = useRef(state);
  // App rebuilds the `refs` object each render; the inner refs are stable, so
  // track the latest container without making it an effect dependency.
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    playCues(soundCues(previousStateRef.current, state), refsRef.current);
    previousStateRef.current = state;
  }, [state]);
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
  const updateSettings = useCallback((config: RoundConfig) => {
    dispatch({ type: "UPDATE", payload: config });
  }, []);

  const { phase, time, currentRound } = read(state);

  return {
    time,
    phase,
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
