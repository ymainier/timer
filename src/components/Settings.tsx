import { useReducer, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Minus } from "lucide-react";
import {
  adjust,
  STEP,
  type RoundConfig,
  type ConfigField,
} from "../core/roundConfig";

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
  onUpdate: (config: RoundConfig) => void;
  onClose: () => void;
}

export function Settings({
  roundDuration,
  restDuration,
  alarmTime,
  onUpdate,
  onClose,
}: SettingsProps) {
  const [state, dispatch] = useReducer(reducer, {
    roundDuration,
    restDuration,
    alarmTime,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(state);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white text-foreground rounded-lg p-6 w-full max-w-md">
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
