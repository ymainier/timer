# Spec: Exercises per Round

Status: Ready

Show the athlete which exercises to do during each Round. Exercises are timing-free labels layered on the existing Round countdown; the timer's structure and audio are unchanged.

See `CONTEXT.md` for the **Exercise**, **Routine**, and **Config** glossary terms, and `docs/adr/0001-routine-outside-timer-core.md` for why the Routine stays out of the timer core.

## Domain

- **Exercise** — the movements for a Round, written as one free-text line within the Routine. Not a modeled unit: a Round has exactly one line. Rendered with inline markdown, **bold and italic only** (no code, links, block structure, or raw HTML).
- **Routine** — the athlete-authored workout as a single markdown list, one line per Round in order. The list marker and any number are cosmetic; blank lines are not Rounds. A sibling to Config; carries no durations. Once the list runs out, later Rounds are unlabeled.
- **Config** is unchanged (the three durations).

## Data model

- Routine shape: a **single authored string** — the whole markdown list as the athlete typed it. Stored raw in `App` React state; default empty.
- A pure `parseRoutine(text)` is the seam to per-Round lines: split on newlines, drop blank lines, and every remaining non-blank line is a Round in order (first line → Round 1). For each line, strip a leading list marker — `N.`, `N)`, `-`, `*`, `+` + whitespace — and keep the rest; a marker-only line is a blank Round that renders nothing.
- **Not** added to `roundTimer.ts` `State` or the `UPDATE` action (see `docs/adr/0001-routine-outside-timer-core.md`).
- Persistence is **out of scope**: the Routine is ephemeral, resetting on reload, exactly like Config today.

## Display

Below the big countdown, a single line per Round (no list):

- **Round** phase → render the current Round's line.
- **Rest** or **Preparation** phase → render the upcoming Round's line framed as "Next up". (Preparation has `currentRound === 0`, so it previews Round 1.)
- Any lookup past the last Round, or a blank Round, renders nothing — no placeholder, no error.

This relies on `read()` holding `currentRound` steady through a Round and its trailing Rest.

## Markdown rendering

- Minimal inline renderer (small helper, not a heavyweight markdown tree).
- Supports **bold** and *italic* only. Everything else — including any raw HTML — is escaped and shown as literal text. No links, no code spans.

## Editing (Settings)

- Existing duration steppers are unchanged.
- A single **textarea** bound to the raw Routine string — the athlete writes the whole workout as a markdown list, one line per Round. No per-Round widgets, no add/remove controls. Reopening Settings shows exactly what was typed.
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
2. A Routine written as a markdown list shows each Round's line during that Round, and previews the next Round's line during the preceding Rest; Preparation previews Round 1.
3. Numbered and bulleted lists, and bare lines with no marker, all parse the same way; the marker is stripped for display and the leading number is cosmetic.
4. Rounds past the last line, and marker-only (blank) Rounds, render nothing.
5. `**bold**` and `*italic*` render as bold/italic; raw HTML and other markdown appear as literal text.
6. Reopening Settings shows the raw text exactly as it was typed.
7. `roundTimer.ts` and its tests are unchanged.
8. Saving Settings resets the timer, whether durations or the Routine changed.
