# 0019 — Tidewalk Contact Field Adapter

## Scope

This run adds a scene-aware adapter for Tidewalk contact choices. It gives the Canvas layer one deterministic source for which coastal contact is closest, actionable, or already resolved.

## Delivered

- Added `src/tidewalk-contact-field.js`.
- Added a proximity-based resolver that only works in the Tidewalk scene.
- Added tests for scene gating, range gating, safe Lantern Tender selection, and Black-Keel selection.
- Added the new test suite and module syntax check to the validation workflow.

## Next seam

After the final warehouse survey, `game-state.js` should keep the player in Tidewalk and expose this field. `game.js` should render the two contact anchors and complete a hold-to-confirm ring before calling `resolveTidewalkContactAtPlayer(state)`. The dossier choice buttons then become read-only status.

## Validation

The workflow now reports the Node version before syntax checks and deterministic tests. A successful GitHub-hosted run is still required before merging this branch.
