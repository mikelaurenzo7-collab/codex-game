# Automation Run 0039 - Tidewalk Live Commitment Adapter

## State Assessment

The latest default branch already had deterministic Tidewalk contact, pressure, identity, and playable commitment modules, but the live browser seam was still too easy to wire incorrectly: `src/game.js` could keep honoring old dossier route buttons unless the contact stage owned frame order and legacy-click suppression.

## Single Highest-Leverage Bottleneck

The Tidewalk route commitment needed one strict live-frame contract that composes normal game-state stepping, in-world contact commitment, Canvas draw availability, HUD invalidation, and dossier-button suppression.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Execution Plan

- Add a browser-frame adapter to `src/tidewalk-playable-commitment.js`.
- Add a pure guard for blocking legacy Tidewalk route clicks while the in-world contact choice is active.
- Extend deterministic tests to prove frame order, state mutation, HUD invalidation, and guard behavior.
- Update player-facing contact documentation with the preferred live-client integration seam.

## Work Completed

- Added `createTidewalkPlayableCommitmentFrameAdapter(...)`.
- Added `shouldBlockLegacyTidewalkRouteClick(...)`.
- Extended `tests/tidewalk-playable-commitment.test.mjs` with live-frame adapter and legacy-click guard coverage.
- Updated `docs/TIDEWALK_CONTACTS.md` to name the playable commitment module as the preferred live seam.

## Gameplay Decision

Tidewalk commitment remains an in-world held-**E** faction contact, not a dossier button. The adapter enforces that route state changes only through the contact runtime while the physical choice remains active.

## Visual-Design Decision

No Canva pass. The useful visual-design choice was preserving the existing Canvas language: Lantern Tender remains warm, readable, and safe-line gold; Black-Keel remains hostile red-black pressure. The dossier is now guidance/status hierarchy rather than the decision surface.

## Validation

Deterministic test coverage was extended. Connector-side code review checked import scope, callback order, route mutation, and legacy-click blocking. A full local runtime/browser smoke was not available from this connector-only run, so no local execution claim is made.

## Next Bottleneck

Perform the surgical `src/game.js` hookup: import the playable commitment adapter, call it from the live frame loop, pass the stage into draw/HUD paths, and guard or remove the old route-choice click handler in the same reviewed change.
