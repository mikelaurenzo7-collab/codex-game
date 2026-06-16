# 0012 - Black-Keel Storylet Consequences

## State Assessment

The previous Tidewalk run created a deterministic coastal objective model: docking rights unlock a warehouse survey, the survey exposes a hostile Black-Keel salvage mark, and the player chooses either a safer quay route or a more dangerous countermark trail. The missing creative layer was consequence: the choice needed to generate authored fallout, faction pressure, settlement trust, rewards, and next hooks.

## Strategic Choice

**C. Narrative/World Sculpting** with systemic hooks.

This run adds a compact storylet layer instead of a broad lore document. The goal is to make Tidewalk choices feel like live world pressure while keeping the logic deterministic and testable.

## Work Completed

- Added `src/black-keel-storylets.js`.
- Added a locked/default storylet for unresolved Tidewalk state.
- Added `Lantern Line Afterglow` for the lower-risk quay-safe choice.
- Added `Countermark Pursuit` for the higher-risk Black-Keel route.
- Added faction pressure, settlement trust, rewards, unlocked flags, risk tags, authored twist text, and next-hook text for each consequence.
- Added `getBlackKeelStorylet(state)` for consequence selection.
- Added `listBlackKeelStorylets()` for future UI, atlas, codex, or debug panels.
- Added `tests/black-keel-storylets.test.mjs`.
- Updated `tests/run-all.mjs` so the full test suite includes the Black-Keel storylet tests.
- Updated `README.md` to reflect the new deterministic follow-on storylet layer.

## Validation Evidence

- Local isolated validation of the new module passed with: `black-keel storylet tests passed`.
- Full repository execution is still deferred to a live checkout/CI environment, but `tests/run-all.mjs` now imports the game-state suite, Tidewalk coastal objective suite, and Black-Keel storylet suite.

## Next Bottleneck

Integrate the Tidewalk and Black-Keel state layers into the live `src/game-state.js` and `src/game.js` arrival panel so the player can see and trigger warehouse survey progress, route selection, and storylet fallout from the playable HUD.
