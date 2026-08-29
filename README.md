# Round Timer

An interval timer for round-based training: boxing, HIIT, circuits. Work a round, rest, repeat, with a lead-in to get set and a bell on every transition so you can keep your eyes off the screen.

It runs in the browser and installs as a PWA. Once loaded it works offline, keeps the screen awake while a session runs, and caches its own sounds.

Live at [ymainier.github.io/timer](https://ymainier.github.io/timer/).

## How a session runs

A session is one preparation lead-in followed by rounds that cycle until you stop:

```
Preparation → Round 1 → Rest → Round 2 → Rest → Round 3 → ...
```

There's no fixed round count. The timer loops round-then-rest forever, numbering each round as it goes. You adjust three durations in Settings: round, rest, and the alarm window (the last stretch of a round). Preparation is fixed. Defaults are a 10-second prep, 3-minute rounds, 1-minute rests, and a 30-second alarm.

Three sounds mark what's happening:

- **Bell** on every phase change: prep into round, round into rest, rest into round.
- **Knocks** when a round drops into its alarm window, so you know it's almost over.
- **Snap** on each of the last few prep seconds, counting you in.

## Running it locally

```sh
npm install
npm run dev      # dev server with hot reload
npm test         # Vitest, watch mode
npm run build    # type-check and bundle to dist/
npm run preview  # serve the production build
```

Requires Node 24 (matching CI). The build type-checks with `tsc -b` before Vite bundles, so a type error fails the build.

## How it's built

React 19, Vite, Tailwind, TypeScript. The timing logic is a small pure core with the UI kept at the edges.

- `src/core/roundTimer.ts` — a reducer over one elapsed `duration`, plus `read()`, which derives the current phase, remaining time, and round number from that single number. All the round/rest looping is modular arithmetic here, no wall-clock branching.
- `src/core/soundCues.ts` — `soundCues(prev, next)` compares two states and returns why a sound should fire (`phase-changed`, `entered-alarm`, `prep-countdown`), named in the timer's own terms. It never touches audio.
- `src/hooks/useRoundTimer.ts` — drives the reducer on a 100ms tick, holds the screen wake lock, and maps cues to actual `<audio>` playback.

Keeping cues separate from playback means the core is testable without a DOM or a speaker. The cue logic, the reducer, and time formatting all have unit tests next to them.

## Docs

- `CONTEXT.md` — the domain vocabulary. Phase, Round, Rest, Alarm, Cue, and Config have precise meanings here; the code uses these words deliberately.
- `docs/agents/` — conventions for the issue tracker and domain docs used when working with coding agents.

## Deploying

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows`. The app is served under `/timer/`, set as Vite's `base`.
