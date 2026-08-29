# Spec: Exercises per Round

Status: Ready

Show the athlete which exercises to do during each Round. Exercises are timing-free labels layered on the existing Round countdown; the timer's structure and audio are unchanged.

See `CONTEXT.md` for the **Exercise**, **Routine**, and **Config** glossary terms, and `docs/adr/0001-routine-outside-timer-core.md` for why the Routine stays out of the timer core.

## Domain

- **Exercise** — one athlete-typed line shown during a Round. Rendered with inline markdown, **bold and italic only** (no code, links, block structure, or raw HTML). No duration of its own.
- **Routine** — an ordered, **dense** map of Round `1..N` → that Round's `Exercise[]`. A sibling to Config; carries no durations. An empty Round is valid and renders nothing. After Round N the Routine runs out and later Rounds are unlabeled.
- **Config** is unchanged (the three durations).

## Data model

- Routine shape: `string[][]` — outer index is Round number (dense, from Round 1), inner list is that Round's Exercise lines.
- Lives in `App` React state. **Not** added to `roundTimer.ts` `State` or the `UPDATE` action.
- Persistence is **out of scope**: the Routine is ephemeral, resetting on reload, exactly like Config today.

## Display

Below the big countdown:

- **Round** phase → render the current Round's Exercises: `routine[currentRound]`.
- **Rest** or **Preparation** phase → render the upcoming Round's Exercises framed as "Next up": `routine[currentRound + 1]`. (Preparation has `currentRound === 0`, so it previews Round 1.)
- Any lookup past N, or an empty Round, renders nothing — no placeholder, no error.

This relies on `read()` holding `currentRound` steady through a Round and its trailing Rest.

## Markdown rendering

- Minimal inline renderer (small helper, not a heavyweight markdown tree).
- Supports **bold** and *italic* only. Everything else — including any raw HTML — is escaped and shown as literal text. No links, no code spans.

## Editing (Settings)

- Existing duration steppers are unchanged.
- Add a Routine section: a list of Rounds, each with a **textarea where one line = one Exercise**, plus add-Round and remove-Round controls.
- **Save applies everything and resets the timer to `stopped`, exactly as today** — including Routine-only edits. There is deliberately no mid-session Routine edit without a restart.

## Audio

- **No new Cue and no new sound.** Entering a Round still fires the existing `phase-changed` bell; the Exercises just appear alongside it.

## Explicitly out of scope

- Persistence / `localStorage`.
- Timed sub-intervals (a circuit within a Round) — Exercises are labels only.
- A preset Exercise library — freeform text only.
- Links, images, or block-level markdown.
- Per-Round distinct timing; every Round keeps the same duration.

## Acceptance

1. With no Routine authored, the app behaves exactly as before (nothing below the countdown).
2. A Routine of N Rounds shows each Round's Exercises during that Round, and previews the next Round's Exercises during the preceding Rest; Preparation previews Round 1.
3. Rounds past N, and empty Rounds, render nothing.
4. `**bold**` and `*italic*` render as bold/italic; raw HTML and other markdown appear as literal text.
5. `roundTimer.ts` and its tests are unchanged.
6. Saving Settings resets the timer, whether durations or the Routine changed.
