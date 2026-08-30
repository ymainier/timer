# Routine lives outside the timer core

The Routine (each Round's Exercises) is derived, timing-free annotation, so we keep it out of `roundTimer.ts` entirely. The timer reducer keeps deriving `phase` and `currentRound` from elapsed time; the Routine lives in `App` view-state and is a pure lookup keyed on `currentRound`. This works because `currentRound` holds steady through a Round and its trailing Rest, so display can show `routine[currentRound]` during a Round and preview `routine[currentRound + 1]` during Rest/Preparation without the core knowing Exercises exist.

## Considered options

- **Thread the Routine through the timer `State` and `UPDATE`**, alongside the durations. Rejected: it puts non-timing, presentation-only data into the timing reducer, expanding the state that the timer tests and transitions have to carry for no timing benefit.

## Consequences

- `roundTimer.ts` and its tests are untouched by this feature.
- The Routine can be modelled and tested as a plain data lookup, independent of the reducer.
- If Exercises ever gain timing (a real circuit-within-a-round), this decision must be revisited — that would genuinely belong in the core.
