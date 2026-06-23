# Automation Run 0026 - Tidewalk Contact Frame Bridge

## State Assessment

The latest default branch contained deterministic Tidewalk contacts, field selection, Canvas rendering, runtime stepping, and a browser-facing adapter. The highest-leverage bottleneck was still the live-client seam: `src/game.js` needs one frame-level call that can step held-input commitment, render contact markers, and invalidate HUD/arrival surfaces without duplicating contact-state rules.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Plan Critique

A direct wholesale rewrite of `src/game.js` through the connector would be too risky because the file is large and replacement-only writes could accidentally regress unrelated rendering, HUD, checkpoint, or input code. The safer scoped increment was to add the missing frame bridge inside the already-tested contact client module, then document the exact tiny live hookup that remains.

## Execution Plan

- Add a single frame-level contact helper that accepts `{ ctx, state, input }`.
- Let the helper step commitment before rendering, so a just-committed contact does not draw stale active markers.
- Return explicit HUD and arrival invalidation flags for the live client.
- Extend deterministic tests to cover draw-only, commit, invalidation, and missing-state failure behavior.
- Update player-facing contact documentation and durable run documentation.

## Work Completed

- Added `runTidewalkContactFrame` to `src/tidewalk-contact-client.js`.
- Expanded `tests/tidewalk-contact-client.test.mjs` with frame-bridge coverage.
- Updated `docs/TIDEWALK_CONTACTS.md` with the new single-call integration contract.
- Added this durable run log.

## Gameplay Decision

Tidewalk route commitment remains a physical held-**E** contact choice. The frame bridge steps commitment first, then draws only if the choice is still active, preventing stale contact affordances after the player commits to a faction.

## Visual-Design Decision

No Canva pass was used. The existing Canvas hierarchy remains the stronger implementation surface for this increment: warm safe-line Lantern Tender versus cold hostile Black-Keel countermark, both expressed directly through in-world range rings and glyphs.

## Validation

- The new frame helper is dependency-free and only composes existing deterministic client/runtime/canvas modules.
- Test coverage now verifies draw-only frames, commit frames, HUD/arrival invalidation flags, resolved dossier state, and invalid missing-state usage.
- Full local Node/browser execution was not claimed because this automation environment does not provide a runnable repository checkout; validation is structural plus authored deterministic tests.

## Next Bottleneck

Wire `runTidewalkContactFrame` into `src/game.js` with a minimal import and per-frame call, use its invalidation flags to refresh the arrival panel after commitment, render contact markers in the completed Tidewalk survey scene, and remove the legacy dossier route-choice button handler once browser smoke confirms the Canvas path is live.
