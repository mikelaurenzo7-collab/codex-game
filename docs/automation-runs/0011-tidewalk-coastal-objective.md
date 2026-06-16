# 0011 - Tidewalk Coastal Micro-Objective

## State Assessment

The durable state log identified the next bottleneck as making the resolved Tidewalk foothold produce a playable coastal micro-objective: surveying a drowned warehouse, discovering a hostile salvage mark, or opening a Tidewalk route choice with risk/reward consequences.

## Strategic Choice

**B. Systemic Expansion** with narrative/world payoff.

The previous run made docking rights state-backed. This run turns that settlement consequence into a deterministic follow-on objective that can be wired into the playable client in a later pass without inventing the rules from scratch.

## Work Completed

- Added `src/tidewalk-coastal-objective.js`.
- Modeled a locked → ready → surveying → route-choice → route-chosen coastal objective flow.
- Added Brinehook Warehouse survey progression gated behind resolved Tidelantern Quay docking rights.
- Added hostile Black-Keel salvage-mark discovery after survey completion.
- Added two Tidewalk route choices:
  - `Lantern Line`, lower risk and safer archive return.
  - `Countermark Trail`, higher risk and stronger hostile-faction lead.
- Added `tests/tidewalk-coastal-objective.test.mjs` for the new state transitions.
- Added `tests/run-all.mjs` as the aggregate test entry point.
- Updated `package.json` so `npm test` / `node`-equivalent project testing now runs the full state suite instead of only `tests/game-state.test.mjs`.

## Validation Evidence

- Local isolated validation of the new module passed with: `tidewalk coastal objective tests passed`.
- Repository-side runtime execution was not available through the connector session, but the new aggregate runner is committed and ready for the next local/CI execution.

## Next Bottleneck

Wire the Tidewalk coastal objective into the existing `src/game-state.js` and `src/game.js` flow so the arrival panel exposes the warehouse survey, Black-Keel clue, and route choice in the live playable HUD after docking rights are secured.
