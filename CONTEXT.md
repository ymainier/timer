# Round Timer

A timer for interval training structured as rounds of work separated by rest, with a preparation lead-in and audio cues at the transitions.

## Language

**Phase**:
Which segment of a session the timer is currently in — Preparation, Round, or Rest.
_Avoid_: mode, stage, period.

**Preparation**:
The fixed lead-in before the first Round, counting down so the athlete can get ready.
_Avoid_: warmup, prep, countdown.

**Round**:
A work interval. Rounds are numbered from 1 and repeat, each one followed by a Rest.
_Avoid_: set, interval.

**Rest**:
The recovery interval between two Rounds.
_Avoid_: break, cooldown.

**Alarm**:
The final stretch of a Round, beginning `alarmTime` before it ends, announced as a warning that the Round is nearly over.
_Avoid_: warning, buzzer.

**Cue**:
A reason for a sound to fire, named in the timer's own terms rather than by which audio file plays — a Phase change, entering the Alarm window, or a Preparation tick.
_Avoid_: sound, alert, trigger.

**Config**:
The athlete-adjustable durations of a session — Round, Rest, and Alarm — excluding the fixed Preparation. A sibling to the Routine, not a container for it.
_Avoid_: settings (the UI panel), options, preferences.

**Exercise**:
A single named movement the athlete authors as one line of text, shown during a Round. Rendered with inline markdown — bold and italic only (no code, links, or block structure). Has no duration or timing of its own; it is a label, never a timed sub-interval.
_Avoid_: move, activity, drill, set.

**Routine**:
The athlete-authored, ordered list mapping each Round from 1 to its Exercises. Dense: Rounds 1..N each carry a list of Exercises (possibly empty), and after the last defined Round the Routine runs out, leaving later Rounds unlabeled. A blank Round renders nothing and is valid. A sibling to Config, not part of it; carries no durations.
_Avoid_: workout, program, plan, playlist.
