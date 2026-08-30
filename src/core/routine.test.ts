import { describe, it, expect } from "vitest";
import { exercisesForRound, displayedExercises, type Routine } from "./routine";

const routine: Routine = [
  ["Jab / cross", "Slip left"],
  [],
  ["Uppercuts"],
];

describe("exercisesForRound", () => {
  it("returns a Round's Exercises by 1-based number", () => {
    expect(exercisesForRound(routine, 1)).toEqual(["Jab / cross", "Slip left"]);
    expect(exercisesForRound(routine, 3)).toEqual(["Uppercuts"]);
  });

  it("returns empty for a blank Round", () => {
    expect(exercisesForRound(routine, 2)).toEqual([]);
  });

  it("returns empty past the end of the Routine", () => {
    expect(exercisesForRound(routine, 4)).toEqual([]);
  });

  it("returns empty for non-positive Round numbers", () => {
    expect(exercisesForRound(routine, 0)).toEqual([]);
  });
});

describe("displayedExercises", () => {
  it("shows the current Round's Exercises during a Round", () => {
    expect(displayedExercises(routine, "round", 1)).toEqual({
      upcoming: false,
      exercises: ["Jab / cross", "Slip left"],
    });
  });

  it("previews the next Round's Exercises during a Rest", () => {
    expect(displayedExercises(routine, "rest", 2)).toEqual({
      upcoming: true,
      exercises: ["Uppercuts"],
    });
  });

  it("previews Round 1 during Preparation", () => {
    expect(displayedExercises(routine, "preparation", 0)).toEqual({
      upcoming: true,
      exercises: ["Jab / cross", "Slip left"],
    });
  });

  it("shows nothing past the end of the Routine", () => {
    expect(displayedExercises(routine, "round", 9)).toEqual({
      upcoming: false,
      exercises: [],
    });
  });
});
