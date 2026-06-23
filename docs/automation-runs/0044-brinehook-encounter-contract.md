# Automation Run 0044 - Brinehook Encounter Contract

## State Assessment

The latest durable state and Brinehook docs showed that Brinehook Low Piers had a fixed Canvas scene contract, but the highest-leverage bottleneck was interaction depth inside the micro-scene. The scene already needed branch-specific pressure that could be tested without relying on visual inspection.

## Strategic Choice

**A. Core Mechanic Deep Dive.**

## Plan Critique

A new biome, extra route chain, or Canva mood board would not address the immediate playable bottleneck. The corrected scope was to harden the mechanics already present in Brinehook: branch support/threat identity, pulse-revealed salvage, and deterministic encounter reporting.

## Execution Plan

- Add a pure Brinehook encounter selector that describes sentinel pressure, lantern haven support, salvage cargo visibility, and recovered cargo.
- Add deterministic tests that launch each branch into Brinehook and verify sentinel, haven, cargo reveal, cargo recovery, signal reward, sentinel drain, and checkpoint safety.
- Update player-facing documentation and the durable run log.

## Work Completed

- Added `src/brinehook-encounter.js`.
- Added `tests/brinehook-encounter.test.mjs`.
- Registered the test in `tests/run-all.mjs`.
- Updated `README.md` and `docs/BRINEHOOK_LOW_PIERS.md`.

## Gameplay Decision

Brinehook now has a formal encounter contract: the Black-Keel line is a hostile underpier sentinel chase, while the lantern line is a protected witness route with a safe-haven support pocket. Both lines can use pulse play to reveal salvage cargo and recover signal.

## Visual-Design Decision

No Canva pass. The visual language stays in Canvas: red triangular sentinel pressure, warm lantern haven radius, dark lateral piers, and small gold salvage pings revealed by pulse instead of permanent UI markers.

## Validation

Connector-side structural review plus deterministic test coverage. Full local runtime was not claimed in this tool-only run.

## Next Bottleneck

Wire the Brinehook encounter selector into the live HUD/bottom-log layer so players receive clearer feedback about sentinel state, haven range, and cargo pings while crossing the Low Piers.
