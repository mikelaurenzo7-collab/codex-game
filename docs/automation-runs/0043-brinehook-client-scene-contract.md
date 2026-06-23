# Automation Run 0043 - Brinehook Client Scene Contract

## State Assessment

The durable state log identified Brinehook Low Piers as the next bottleneck. Inspection found a sharper live-client issue inside that bottleneck: `src/game.js` draws `BRINEHOOK_SCENE.piers`, but the browser module had no declared Brinehook scene contract in scope. That could break the playable Canvas scene exactly when the expedition becomes active.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Justification

Before expanding Brinehook with more branch-specific interactions, the live Canvas client needed a stable scene contract for the authored pier silhouettes it already tries to draw. This is the smallest high-leverage stabilization because it protects the first coastal micro-scene from runtime failure.

## Execution Plan

- Expose the Brinehook pier-layout contract before the module client loads.
- Add a regression test that detects the client/HTML contract seam.
- Register the test in the aggregate runner.
- Update player-facing documentation with reachability and scene rules.

## Work Completed

- Updated `index.html` with a pre-module `BRINEHOOK_SCENE` contract containing the six authored Low Piers silhouettes.
- Added `tests/brinehook-client-contract.test.mjs`.
- Registered the new test in `tests/run-all.mjs`.
- Updated `README.md`.
- Added `docs/BRINEHOOK_LOW_PIERS.md`.

## Gameplay Decision

Prioritized making Brinehook reliably playable before adding new content beats. The current Brinehook loop remains: descend, navigate tide pressure, hold `E` at the branch target, and use `Space` to suppress hazards.

## Visual-Design Decision

Kept the existing Canvas/HTML5 visual direction and formalized the low-pier silhouette contract: broad dark pier shapes over black water, lantern warmth for safe witness play, and red danger language for Black-Keel pressure. Canva was not used because the bottleneck was implementation integrity rather than missing visual references.

## Validation

- Added deterministic static regression coverage for the Brinehook client contract.
- Connector-side strict review confirmed no secrets, no external assets, and no unrelated files were touched.
- Full local runtime execution was not available inside this connector-only run, so validation is limited to repository-committed tests and static review.

## Next Bottleneck

Move the Brinehook scene contract out of the HTML global and into an exported ES module shared by state, Canvas rendering, and tests, then expand branch-specific Brinehook objectives once the contract is fully modular.
