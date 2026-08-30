# 02: Inline markdown rendering for Exercises

**What to build:** Exercise lines render with inline markdown — **bold** and *italic* only. Everything else is shown literally: no links, no code spans, no block structure, and any raw HTML in the athlete's text is escaped and displayed as plain characters rather than interpreted. This applies to the Exercise display introduced in ticket 01, both in the current Round and in the "Next up" preview.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `**text**` (or `__text__`) renders bold; `*text*` (or `_text_`) renders italic.
- [ ] Raw HTML in an Exercise is escaped and shown as literal text — never injected into the DOM.
- [ ] Links, code spans, and block-level markdown are not interpreted; they appear as literal characters.
- [ ] The renderer is a pure function with unit tests covering bold, italic, HTML escaping, and malformed/unclosed markers.
- [ ] The renderer is applied to Exercises in both the current-Round display and the "Next up" preview.
