# AGA State Append 0044 - Brinehook Encounter Contract

## Current State Delta

- Brinehook Low Piers now has a deterministic encounter selector in `src/brinehook-encounter.js`.
- The selector summarizes active branch identity, Black-Keel sentinel pressure, lantern haven support, pulse-revealed cargo, recovered cargo, and bottom-log copy.
- `tests/brinehook-encounter.test.mjs` launches both Brinehook branches through the state loop and verifies sentinel spawn/drain, lantern haven reporting, cargo reveal/recovery, signal reward, and checkpoint safety.
- Player-facing docs now explain Brinehook cargo pings, sentinel suppression, and lantern haven behavior.

## Iteration Log Entry

### 0044 - Brinehook Encounter Contract

- **State Assessment:** Brinehook had a fixed Canvas scene contract but needed stronger interaction depth and deterministic coverage for the micro-scene's branch-specific mechanics.
- **Strategic Choice:** A. Core Mechanic Deep Dive.
- **Justification:** The most useful increment was to harden the moment-to-moment Brinehook play contract rather than add another route, menu, or design-only asset surface.
- **Work Completed:** Added `src/brinehook-encounter.js`, `tests/brinehook-encounter.test.mjs`, aggregate test registration, updated README guidance, updated `docs/BRINEHOOK_LOW_PIERS.md`, and logged the run in `docs/automation-runs/0044-brinehook-encounter-contract.md`.
- **Gameplay Decision:** Black-Keel Brinehook is now formally modeled as a hunted underpier route, while the lantern branch is formally modeled as a supported witness route. Both support pulse-revealed salvage cargo.
- **Visual-Design Decision:** Canva was not used. Canvas remains the authoritative presentation layer: red sentinel pressure, warm lantern haven, dark low-pier silhouettes, and small gold cargo pings.
- **Validation Evidence:** Deterministic tests were added and registered for the full aggregate suite. Connector-side review was performed; full local runtime was not claimed.
- **Next Bottleneck:** Wire the Brinehook encounter selector into the live HUD/bottom-log feedback so players can read sentinel, haven, and cargo state during the crossing.
