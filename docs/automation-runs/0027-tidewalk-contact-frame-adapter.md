# Automation Run 0027 - Tidewalk Contact Game Frame Adapter

## State Assessment

The latest default branch already contains deterministic Tidewalk contact state, field selectors, Canvas contact rendering, runtime commit logic, and a browser-facing `runTidewalkContactFrame` helper. The remaining bottleneck is the live browser seam: `src/game.js` still owns the final frame-loop integration and still contains the old dossier click path. Replacing the entire large game client through connector-only writes would be a high-risk change, so this run reduced the seam to a stricter tested adapter rather than performing a broad rewrite.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Execution Plan

- Add a focused frame adapter that can be imported by the live Canvas client.
- Enforce the deterministic order: normal state update, Tidewalk contact commit/draw, arrival invalidation, game draw, HUD refresh.
- Extend client tests to prove the adapter calls each frame responsibility in the correct order and preserves commit state.
- Update player-facing and run documentation to clarify the exact remaining browser-loop hookup.

## Work Completed

- Added `createTidewalkContactGameFrameAdapter` to `src/tidewalk-contact-client.js`.
- Expanded `tests/tidewalk-contact-client.test.mjs` with frame-adapter ordering and mutation coverage.
- Updated `docs/TIDEWALK_CONTACTS.md` with the live-client adapter contract.

## Gameplay Decision

Tidewalk contact commitment remains an in-world held-**E** faction choice after both drowned warehouse surveys. The adapter guarantees the commitment is resolved after the normal state step and before game draw/HUD refresh, so committed contacts do not leave stale markers or stale arrival-panel state for an extra frame.

## Visual-Design Decision

No Canva pass was used. The current visual-design language remains sufficient for this bottleneck: Lantern Tender uses warm lantern/safe-line hierarchy, while Black-Keel Scout uses a colder countermark treatment. This run improved the Canvas client seam rather than generating external visual references.

## Validation

- Structural review confirmed no secrets, external services, dependencies, generated assets, or broad client rewrites were introduced.
- The expanded test asserts adapter order: `updateGameState -> invalidateArrival -> drawGame -> updateHud` when a contact is committed.
- Full local execution was not claimed from this connector-only environment. The validation standard for this run is authored deterministic test coverage plus strict code review.

## Next Bottleneck

Perform the final surgical `src/game.js` hookup: import `createTidewalkContactGameFrameAdapter` or `runTidewalkContactFrame`, use it from the browser frame loop, draw contact markers in Tidewalk after survey completion, invalidate `arrivalSnapshot` on contact commit, and remove the dossier route-choice button handler in the same reviewed change.
