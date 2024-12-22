import React from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Plus, Minus } from "lucide-react";

interface SettingsProps {
  roundDuration: number;
  restDuration: number;
  onUpdate: (roundDuration: number, restDuration: number) => void;
  onClose: () => void;
}

export function Settings({
  roundDuration,
  restDuration,
  onUpdate,
  onClose,
}: SettingsProps) {
  const [newRoundDuration, setNewRoundDuration] = React.useState(
    roundDuration / 1000
  );
  const [newRestDuration, setNewRestDuration] = React.useState(
    restDuration / 1000
  );

  const formatTimeForDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const adjustTime = (currentTime: number, adjustment: number) => {
    return Math.max(10, currentTime + adjustment);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(newRoundDuration * 1000, newRestDuration * 1000);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                  setNewRoundDuration((time) => adjustTime(time, -10))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono">
                {formatTimeForDisplay(newRoundDuration)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setNewRoundDuration((time) => adjustTime(time, 10))
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
                  setNewRestDuration((time) => adjustTime(time, -10))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono">
                {formatTimeForDisplay(newRestDuration)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setNewRestDuration((time) => adjustTime(time, 10))
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
