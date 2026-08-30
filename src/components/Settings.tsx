import { useReducer, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Minus, Trash2 } from "lucide-react";
import {
  adjust,
  STEP,
  type RoundConfig,
  type ConfigField,
} from "../core/roundConfig";
import type { Routine } from "../core/routine";

/** One line per Exercise; blank lines are dropped. */
function textToExercises(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type Action = { type: "ADJUST"; field: ConfigField; delta: number };

function reducer(state: RoundConfig, action: Action): RoundConfig {
  switch (action.type) {
    case "ADJUST":
      return adjust(state, action.field, action.delta);
    default:
      return state;
  }
}

function formatTimeForDisplay(ms: number) {
  const minutes = Math.floor(ms / 60_000);
  const remainingSeconds = Math.floor((ms % 60_000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

interface SettingsProps {
  roundDuration: number;
  restDuration: number;
  alarmTime: number;
  routine: Routine;
  onUpdate: (config: RoundConfig) => void;
  onRoutineChange: (routine: Routine) => void;
  onClose: () => void;
}

export function Settings({
  roundDuration,
  restDuration,
  alarmTime,
  routine,
  onUpdate,
  onRoutineChange,
  onClose,
}: SettingsProps) {
  const [state, dispatch] = useReducer(reducer, {
    roundDuration,
    restDuration,
    alarmTime,
  });
  // One textarea's raw text per Round; converted to Exercises on save.
  const [rounds, setRounds] = useState<string[]>(() =>
    routine.map((exercises) => exercises.join("\n"))
  );

  const setRound = (index: number, text: string) =>
    setRounds(rounds.map((round, i) => (i === index ? text : round)));
  const addRound = () => setRounds([...rounds, ""]);
  const removeRound = (index: number) =>
    setRounds(rounds.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRoutineChange(rounds.map(textToExercises));
    onUpdate(state);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white text-foreground rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="roundDuration">Round Duration (MM:SS)</Label>
            <div className="flex items-center justify-between mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "roundDuration", delta: -STEP })
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono">
                {formatTimeForDisplay(state.roundDuration)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "roundDuration", delta: STEP })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="restDuration">Rest Duration (MM:SS)</Label>
            <div className="flex items-center justify-between mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "restDuration", delta: -STEP })
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono">
                {formatTimeForDisplay(state.restDuration)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "restDuration", delta: STEP })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="restDuration">Alarm Time (MM:SS)</Label>
            <div className="flex items-center justify-between mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "alarmTime", delta: -STEP })
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono">
                {formatTimeForDisplay(state.alarmTime)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  dispatch({ type: "ADJUST", field: "alarmTime", delta: STEP })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Label>Routine (one exercise per line)</Label>
            <div className="mt-2 space-y-3">
              {rounds.map((text, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Round {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRound(index)}
                      aria-label={`Remove round ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <textarea
                    className="w-full rounded-md border border-input p-2 text-sm font-mono"
                    rows={3}
                    value={text}
                    onChange={(e) => setRound(index, e.target.value)}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRound}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add round
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
