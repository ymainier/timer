/** The athlete-adjustable durations of a session, excluding the fixed Preparation. */
export type RoundConfig = {
  roundDuration: number;
  restDuration: number;
  alarmTime: number;
};

export type ConfigField = keyof RoundConfig;

/** Amount each adjustment moves a duration. */
export const STEP = 10_000;

/** Floor for any adjustable duration. */
export const MIN_DURATION = 10_000;

/** Move one field by `delta`, clamped at MIN_DURATION. Other fields are untouched. */
export function adjust(
  config: RoundConfig,
  field: ConfigField,
  delta: number
): RoundConfig {
  return {
    ...config,
    [field]: Math.max(MIN_DURATION, config[field] + delta),
  };
}
