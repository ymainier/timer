import { describe, it, expect } from "vitest";
import { parseRoutine, displayedExercises } from "./routine";

describe("parseRoutine", () => {
  it("takes each non-blank line as a Round in order", () => {
    expect(parseRoutine("jab-cross\nkicks")).toEqual(["jab-cross", "kicks"]);
  });

  it("strips ordered markers (1. and 1))", () => {
    expect(parseRoutine("1. jab-cross\n2) kicks")).toEqual(["jab-cross", "kicks"]);
  });

  it("strips unordered markers (-, *, +)", () => {
    expect(parseRoutine("- jab\n* cross\n+ hook")).toEqual(["jab", "cross", "hook"]);
  });

  it("parses numbered, bulleted and bare lists the same way", () => {
    expect(parseRoutine("1. a\n2. b")).toEqual(parseRoutine("- a\n- b"));
    expect(parseRoutine("- a\n- b")).toEqual(parseRoutine("a\nb"));
  });

  it("treats the number as cosmetic, not a Round index", () => {
    expect(parseRoutine("1. a\n5. b")).toEqual(["a", "b"]);
  });

  it("drops blank lines without shifting Round numbers", () => {
    expect(parseRoutine("a\n\n\nb")).toEqual(["a", "b"]);
  });

  it("yields a blank Round for a marker-only line", () => {
    expect(parseRoutine("1. a\n2.\n3. c")).toEqual(["a", "", "c"]);
  });

  it("keeps commas and other text verbatim", () => {
    expect(parseRoutine("1. jab-cross-hook, jab-cross-slip-teep")).toEqual([
      "jab-cross-hook, jab-cross-slip-teep",
    ]);
  });

  it("is empty for an empty Routine", () => {
    expect(parseRoutine("")).toEqual([]);
  });
});

describe("displayedExercises", () => {
  const routine = "1. jab-cross\n2.\n3. kicks";

  it("shows the current Round's line during a Round", () => {
    expect(displayedExercises(routine, "round", 1)).toEqual({
      upcoming: false,
      exercise: "jab-cross",
    });
  });

  it("previews the next Round's line during a Rest", () => {
    expect(displayedExercises(routine, "rest", 2)).toEqual({
      upcoming: true,
      exercise: "kicks",
    });
  });

  it("previews Round 1 during Preparation", () => {
    expect(displayedExercises(routine, "preparation", 0)).toEqual({
      upcoming: true,
      exercise: "jab-cross",
    });
  });

  it("shows nothing for a blank Round", () => {
    expect(displayedExercises(routine, "round", 2)).toEqual({
      upcoming: false,
      exercise: "",
    });
  });

  it("shows nothing past the end of the Routine", () => {
    expect(displayedExercises(routine, "round", 9)).toEqual({
      upcoming: false,
      exercise: "",
    });
  });
});
