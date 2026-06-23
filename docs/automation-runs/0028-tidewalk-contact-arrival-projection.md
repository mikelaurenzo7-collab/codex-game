# Automation Run 0028 - Tidewalk Contact Arrival Projection

## State Assessment

`docs/AGA_MANDATE.md` requires one scoped, traceable iteration that preserves playable code and deterministic tests. `docs/AGA_STATE.md` still names the Tidewalk route-commitment seam as the highest-value bottleneck: warehouse surveys are physical, but the branch commitment can still read like a dossier choice. Recent repository state already contains contact plan, contact field, Canvas renderer, runtime, client frame bridge, and frame adapter modules. The remaining risk is the arrival-panel/UI handoff: the player-facing dossier needs a deterministic projection that can suppress direct button commitment while pointing players toward the physical contacts.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Plan Critique

A broad `src/game.js` rewrite through connector-only access would be unnecessarily risky because the live file is large and currently owns many unrelated Canvas, HUD, checkpoint, and primer concerns. The safer increment is to harden the last missing UI contract in the focused contact-client module, then leave a precise surgical hook for the subsequent live-client edit.

## Execution Plan

- Add an arrival-panel projection to `src/tidewalk-contact-client.js`.
- Ensure the projection disables legacy route-choice buttons while contact commitment is active.
- Expand tests so the projection proves in-world contact guidance, disabled legacy choices, and post-commit resolved copy.
- Update player-facing Tidewalk contact docs and durable run documentation.

## Work Completed

- Added `getTidewalkContactArrivalProjection(state, input)`.
- Extended `stepTidewalkContactClient` and `runTidewalkContactFrame` to return the projection.
- Added test coverage for disabled legacy dossier choices, in-range contact copy, frame projection output, and resolved projection state.
- Updated `docs/TIDEWALK_CONTACTS.md`.

## Gameplay Decision

Tidewalk route commitment remains a held-**E** in-world faction contact action. The arrival panel is now guidance/status only during this phase and should not own direct commitment buttons.

## Visual-Design Decision

No Canva pass was used because the bottleneck was a live UI contract, not reference art. The existing Canvas hierarchy remains authoritative: warm gold safe-line language for the Lantern Tender, cold underpier countermark language for the Black-Keel Scout.

## Strict Review

- No secrets, credentials, services, dependencies, generated assets, or unrelated runtime systems were introduced.
- The change is scoped to contact-client projection logic, its deterministic tests, and documentation.
- The projection is state-read-only except where the existing frame step already performs contact commitment.
- Full local execution was not claimed from this connector-only environment; validation is by structural review and authored deterministic test coverage.

## Next Bottleneck

Perform the surgical `src/game.js` integration: import `runTidewalkContactFrame` or `createTidewalkContactGameFrameAdapter`, call it in the browser frame after `updateGameState`, render contact markers inside the world draw path, feed `getTidewalkContactArrivalProjection` into `updateArrival`, and remove the remaining `arrivalRouteChoiceList` direct click handler.
