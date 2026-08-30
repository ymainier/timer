# 04: Author the Routine as one markdown list

**What to build:** Replace the per-Round textareas with a single textarea where the athlete writes the whole workout as a markdown list — one line per Round, numbered or bulleted or bare. Each non-blank line becomes a Round in order; the leading list marker (`N.`, `N)`, `-`, `*`, `+`) is cosmetic and stripped for display, the leading number does not assign Round numbers. A Round's line is one opaque string (commas and other text are shown verbatim), rendered with the existing inline bold/italic. Below the countdown, each Round shows its single line (no bulleted list); Rest/Preparation preview the next Round's line as "Next up"; blank or past-the-end shows nothing. The raw text the athlete typed is what's stored and what reappears when Settings is reopened.

This supersedes the per-Round editing and `Exercise[]`-per-Round model from tickets 01 and 03.

**Blocked by:** 01, 02, 03 (revises them)

**Status:** ready-for-agent

- [ ] `parseRoutine(text)` splits the raw Routine into per-Round lines: blank lines dropped, every other line a Round in order, leading list marker stripped, marker-only lines yielding a blank Round.
- [ ] Numbered lists, bulleted lists, and marker-less lines all parse to the same Rounds; the leading number is cosmetic.
- [ ] The Routine is stored in `App` as the raw authored string (default empty); parsing is a pure function, not stored state.
- [ ] Settings shows one textarea bound to the raw string — no per-Round widgets, no add/remove; reopening shows exactly what was typed.
- [ ] Each Round renders as a single line below the countdown (current Round during a Round, next Round as "Next up" during Rest/Preparation); blank and past-the-end render nothing.
- [ ] Inline bold/italic still render; raw HTML and other markdown stay literal.
- [ ] `roundTimer.ts` and its tests are unchanged; saving still resets the timer.
