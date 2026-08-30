# 01: Routine state and on-screen display

**What to build:** The athlete sees each Round's Exercises on the timer screen. The Routine — an ordered, dense map of Round number to that Round's Exercise lines — lives in `App` state. Below the big countdown: during a Round, the current Round's Exercises appear; during Rest or Preparation, the upcoming Round's Exercises appear framed as "Next up" (Preparation previews Round 1). Rounds past the end of the Routine, and empty Rounds, show nothing — no placeholder, no error. Seed the Routine with a temporary hardcoded value so the behaviour is demoable without an editor yet; Exercises render as plain text at this stage. The timing core stays untouched.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Routine is held in `App` as `string[][]` (outer index = Round number from 1, inner = that Round's Exercise lines); not added to `roundTimer.ts` state or the `UPDATE` action (see `docs/adr/0001-routine-outside-timer-core.md`).
- [ ] During a Round, the current Round's Exercises render below the countdown (`routine[currentRound]`).
- [ ] During Rest or Preparation, the upcoming Round's Exercises render as "Next up" (`routine[currentRound + 1]`; Preparation previews Round 1).
- [ ] Lookups past the last defined Round, and empty Rounds, render nothing.
- [ ] A temporary hardcoded Routine makes the feature demoable end-to-end.
- [ ] `roundTimer.ts` and its tests are unchanged.
