import { describe, it, expect } from "vitest";
import { adjust, STEP, MIN_DURATION, type RoundConfig } from "./roundConfig";

const config: RoundConfig = {
  roundDuration: 180_000,
  restDuration: 60_000,
  alarmTime: 30_000,
};

describe("adjust", () => {
  it("increments the named field by delta", () => {
    expect(adjust(config, "roundDuration", STEP).roundDuration).toBe(190_000);
  });

  it("decrements the named field by delta", () => {
    expect(adjust(config, "restDuration", -STEP).restDuration).toBe(50_000);
  });

  it("clamps at MIN_DURATION and never below", () => {
    const low: RoundConfig = { ...config, alarmTime: MIN_DURATION };
    expect(adjust(low, "alarmTime", -STEP).alarmTime).toBe(MIN_DURATION);
  });

  it("leaves the other fields untouched", () => {
    const next = adjust(config, "roundDuration", STEP);
    expect(next.restDuration).toBe(config.restDuration);
    expect(next.alarmTime).toBe(config.alarmTime);
  });

  it("does not mutate the input", () => {
    adjust(config, "roundDuration", STEP);
    expect(config.roundDuration).toBe(180_000);
  });
});
