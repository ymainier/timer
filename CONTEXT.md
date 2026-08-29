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
The athlete-adjustable durations of a session — Round, Rest, and Alarm — excluding the fixed Preparation.
_Avoid_: settings (the UI panel), options, preferences.
