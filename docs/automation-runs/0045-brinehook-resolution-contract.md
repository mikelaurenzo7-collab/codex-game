# Automation Run 0045 - Brinehook Resolution Contract

## State Assessment

Latest `main` shows Brinehook Low Piers has a stable Canvas scene contract and a deterministic encounter selector for sentinel/haven/cargo pressure. The highest-leverage bottleneck is that those pressures do not yet collapse into a clear branch-specific resolution state. Without that layer, the player can sense danger or support but the game cannot reliably say whether the pier outcome is escaped, secured, or still contested.

## Strategic Choice

**A. Core Mechanic Deep Dive.**

## Execution Plan

- Add a deterministic Brinehook resolution selector over the existing encounter state.
- Preserve existing game-state mutation rules; the selector must be read-only.
- Prove both branches: Black-Keel cargo plus sentinel suppression, and Lantern haven plus cargo proof.
- Register the test in the aggregate runner.
- Update player-facing Brinehook documentation.

## Work Completed

- Added `src/brinehook-resolution.js`.
- Added `tests/brinehook-resolution.test.mjs`.
- Registered the new test in `tests/run-all.mjs`.
- Updated `docs/BRINEHOOK_LOW_PIERS.md` with resolution states and usage guidance.

## Gameplay Decision

Brinehook now has explicit outcome states. Black-Keel requires at least two cargo recoveries plus sentinel suppression to become `escaped-with-cargo`; Lantern requires safe-haven range plus recovered cargo to become `witness-secured`.

## Visual-Design Decision

Canva was not used. The bottleneck was resolution logic for the existing Canvas-present play space, not new art direction. Existing visual language remains: dark low piers, warm haven safety, red-black pursuit pressure, and pulse-revealed gold cargo pings.

## Validation

- Structural review: the selector is read-only and imports only the existing Brinehook encounter selector.
- Test authoring covers dormant, Black-Keel contested, Black-Keel cargo-under-hunt, Black-Keel escaped, Lantern safe-line-ahead, Lantern haven-holding, and Lantern witness-secured outcomes.
- Full local runtime execution was not claimed because this connector-only run cannot execute the repository in a local checkout.

## Next Bottleneck

Wire `getBrinehookResolutionState` into the live HUD/bottom log and then create the actual Brinehook exit/return transition from completed resolution states.
