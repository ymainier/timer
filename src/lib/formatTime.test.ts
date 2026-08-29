import { describe, it, expect } from "vitest";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("formats zero", () => {
    expect(formatTime(0)).toBe("0:00:0");
  });

  it("pads seconds to two digits", () => {
    expect(formatTime(5_000)).toBe("0:05:0");
  });

  it("formats minutes, seconds and tenths", () => {
    expect(formatTime(95_400)).toBe("1:35:4");
  });

  it("rounds to the nearest tenth of a second", () => {
    expect(formatTime(1_249)).toBe("0:01:2");
    expect(formatTime(1_250)).toBe("0:01:3");
  });
});
