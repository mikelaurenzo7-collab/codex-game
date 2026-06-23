# AGA State Append 0028 - Tidewalk Contact Arrival Projection

This append preserves durable state for automation run 0028 without rewriting the long canonical `docs/AGA_STATE.md` file through connector-only access.

## State Assessment

The canonical state log still identifies the Tidewalk route-commitment seam as the highest-value bottleneck. Recent default-branch modules already provide deterministic contact planning, in-world contact field detection, Canvas contact rendering, held-input commitment, and a frame adapter. The remaining safe bottleneck for this run was the UI handoff: the arrival panel still needed a tested projection that tells the player to meet contacts in world and suppresses direct legacy route-choice commitment while the contact field is active.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Work Completed

- Added `getTidewalkContactArrivalProjection(state, input)` in `src/tidewalk-contact-client.js`.
- Returned the projection from `stepTidewalkContactClient` and `runTidewalkContactFrame`.
- Expanded `tests/tidewalk-contact-client.test.mjs` with deterministic coverage for projection mode, disabled legacy choices, in-range guidance, resolved state, and frame return values.
- Updated `docs/TIDEWALK_CONTACTS.md`.
- Logged the run in `docs/automation-runs/0028-tidewalk-contact-arrival-projection.md`.

## Gameplay Decision

Tidewalk contact commitment remains an in-world held-**E** faction decision. The arrival panel should function as guidance/status only during this step, not as the commitment surface.

## Visual-Design Decision

No Canva pass was used. The current Canvas art direction remains sufficient and deliberately contrasted: warm gold lantern-safe-line readability for the safer contact, cold underpier countermark hostility for the Black-Keel contact.

## Validation

Deterministic tests were authored for the new projection contract. Full local Node/browser execution was not claimed from this connector-only environment.

## Next Bottleneck

Wire the tested contact client into `src/game.js`: call the contact frame after `updateGameState`, draw the contact markers in the scene, render the arrival projection in the route-choice panel, and remove the direct dossier route-choice click handler.
