# 03: Author the Routine in Settings

**What to build:** The athlete can create and edit the Routine in the Settings panel. Alongside the existing duration steppers, a Routine section lists the Rounds; each Round is a textarea where one line is one Exercise. The athlete can add a Round and remove a Round. Saving commits the Routine and resets the timer exactly as saving does today. This replaces the temporary hardcoded seed from ticket 01; the default is an empty Routine, so until the athlete authors one the app behaves exactly as it did before this feature.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Settings shows a Routine section with one entry per Round; each is a textarea where each line is one Exercise.
- [ ] The athlete can add a Round and remove a Round.
- [ ] Saving commits the edited Routine to `App` state and resets the timer to stopped, consistent with today's Save behaviour.
- [ ] The temporary hardcoded seed from ticket 01 is removed; the default Routine is empty.
- [ ] With an empty Routine, nothing renders below the countdown and the app behaves as before the feature.
- [ ] An authored Routine drives the display from tickets 01/02 during a run.
