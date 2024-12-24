import { useReducer, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Minus } from "lucide-react";

type State = {
  roundDuration: number;
  restDuration: number;
  alarmTime: number;
};

type Action =
  | { type: "INCREMENT_ROUND" }
  | { type: "DECREMENT_ROUND" }
  | { type: "INCREMENT_REST" }
  | { type: "DECREMENT_REST" }
  | { type: "INCREMENT_ALARM" }
  | { type: "DECREMENT_ALARM" };

function adjust(currentTime: number, adjustment: number) {
  return Math.max(10_000, currentTime + adjustment);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT_ROUND":
      return { ...state, roundDuration: adjust(state.roundDuration, 10_000) };
    case "DECREMENT_ROUND":
      return { ...state, roundDuration: adjust(state.roundDuration, -10_000) };
    case "INCREMENT_REST":
      return { ...state, restDuration: adjust(state.restDuration, 10_000) };
    case "DECREMENT_REST":
      return { ...state, restDuration: adjust(state.restDuration, -10_000) };
    case "INCREMENT_ALARM":
      return { ...state, alarmTime: adjust(state.alarmTime, 10_000) };
    case "DECREMENT_ALARM":
      return { ...state, alarmTime: adjust(state.alarmTime, -10_000) };
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
  onUpdate: (
    roundDuration: number,
    restDuration: number,
    alarmTime: number
  ) => void;
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
    onUpdate(state.roundDuration, state.restDuration, state.alarmTime);
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
                onClick={() => dispatch({ type: "DECREMENT_ROUND" })}
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
                onClick={() => dispatch({ type: "INCREMENT_ROUND" })}
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
                onClick={() => dispatch({ type: "DECREMENT_REST" })}
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
                onClick={() => dispatch({ type: "INCREMENT_REST" })}
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
                onClick={() => dispatch({ type: "DECREMENT_ALARM" })}
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
                onClick={() => dispatch({ type: "INCREMENT_ALARM" })}
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
