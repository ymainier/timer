import React, { useRef } from "react";
import { useRoundTimer } from "./hooks/useRoundTimer";
import { Button } from "./components/ui/button";
import { Settings } from "./components/Settings";

function App() {
  const refs = {
    bell: useRef<HTMLAudioElement>(null),
    knocks: useRef<HTMLAudioElement>(null),
    snap: useRef<HTMLAudioElement>(null),
  };

  const {
    time,
    isRound,
    status,
    currentRound,
    roundDuration,
    alarmTime,
    restDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
  } = useRoundTimer(refs);

  const [showSettings, setShowSettings] = React.useState(false);

  const getBackgroundColor = () => {
    switch (status) {
      case "paused":
        return isRound
          ? "bg-gray-300 text-foreground"
          : "bg-gray-700 text-white";
      case "stopped":
        return "bg-background text-foreground";
      default:
        return isRound
          ? "bg-background text-foreground"
          : "bg-black text-white";
    }
  };

  const isRunning = status === "started";

  return (
    <div
      className={`flex flex-col justify-between min-h-svh ${getBackgroundColor()} transition-colors duration-300`}
    >
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isRound ? "Round" : "Rest"} {currentRound}
          </h1>
          <div
            className="font-mono font-bold text-[15vw] leading-none"
            aria-live="polite"
          >
            {time}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-wrap gap-4 justify-center items-center text-foreground">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          variant={isRunning ? "outline" : "default"}
          size="lg"
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="lg">
          Reset
        </Button>
        <Button
          onClick={() => setShowSettings(true)}
          variant="outline"
          size="lg"
        >
          Settings
        </Button>
      </div>
      {showSettings && (
        <Settings
          roundDuration={roundDuration}
          restDuration={restDuration}
          alarmTime={alarmTime}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      <audio ref={refs.bell} preload="auto">
        <source src="./bell.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={refs.knocks} preload="auto">
        <source src="./knocks.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={refs.snap} preload="auto">
        <source src="./snap.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
