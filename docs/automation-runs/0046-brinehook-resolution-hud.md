# Automation Run 0046 — Brinehook Resolution HUD Wiring

## State Assessment

Pulled origin/main, reviewed all docs and operating rules. Two test regressions were
present in connector-authored runs 0044–0045 and needed fixing before the next
iteration could be logged with honest validation:

- `brinehook-encounter.test.mjs`: sentinel contact assertion failed because the sentinel
  had patrolled ~75 px away from its spawn point during the extra post-launch ticks
  inside `holdAction`. Fixed by explicitly resetting sentinel position to (1300, 540)
  before the contact check.
- `brinehook-resolution.test.mjs`: referenced a nonexistent cargo ID `"cargo-bell"`.
  Fixed to `"cargo-logbook"`, which is one of the three actual cargo items.

After those fixes all 26 suites passed. The highest-leverage bottleneck then was that
`getBrinehookResolutionState` — covering six outcome states — was invisible to the
player. The HUD showed only "Brinehook Low Piers" during the entire pier crossing.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Work Completed

- Fixed `tests/brinehook-encounter.test.mjs`: reset sentinel to spawn before contact assertion.
- Fixed `tests/brinehook-resolution.test.mjs`: replaced `"cargo-bell"` with `"cargo-logbook"`.
- Added `getBrinehookResolutionState` import to `src/game.js`.
- Computed `resolution` in `updateHud` alongside existing selectors.
- Updated status readout: Brinehook field phase now shows `resolution.title`; tide-stilled
  state appends it as `Black tide suppressed · ${resolution.title}`.
- Updated `formatObjective`: when expedition is in field phase and resolution is active,
  returns `resolution.objective` instead of the generic distance label.
- Passed `resolution` through `formatObjective` signature without altering other branches.
- Updated `docs/AGA_STATE.md` current state bullet and added iteration log entry.

## Validation

`node --check src/game.js` — no syntax errors.
`node tests/run-all.mjs` — all 26 suites passed.

## Next Bottleneck

Create a Brinehook exit/return transition from completed resolution states
(`escaped-with-cargo`, `witness-secured`) so the player can leave the pier with
their outcome recorded in the arrival dossier and the world.
