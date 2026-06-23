# Automation Run 0023 - Tidewalk Contact Runtime Contract

## State Assessment

The latest durable state log still names the Tidewalk route-commitment seam as the single highest-leverage bottleneck: warehouse surveying is physical, but the final route commitment still needs to move from dossier UI into the coast. The previous run added a Canvas renderer for the contacts, but the project still needed a compact runtime seam that browser input can call without duplicating contact-field or rendering rules.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Justification

A direct `src/game.js` patch would be the final playable-client step, but that file is large and the current connector only supports whole-file replacement. The safest high-utility increment was therefore to create a small runtime contract that unifies the already-authored contact field, Canvas renderer, and commit semantics under deterministic tests. This reduces the next browser-client change to imports plus two calls instead of a speculative large-file rewrite.

## Execution Plan

- **Specific Tasks:** Add a runtime helper around contact field state, Canvas rendering, and held-input commitment; prove no-commit, in-range commit, out-of-range guard, and renderer delegation in tests; register the runtime test in the aggregate runner; document the player-facing interaction and the exact remaining browser-client seam.
- **Technology Stack Justification:** Vanilla ES modules remain the right tool because the runtime seam must be importable by the existing HTML5 Canvas client and testable under Node without a DOM.
- **Success Metrics:** Runtime exposes `canCommit` and HUD copy, only commits when an interaction input is active and a contact is in range, preserves out-of-range guards, delegates drawing through the Canvas renderer, and is covered by `tests/run-all.mjs`.
- **Risk Mitigation:** The helper does not introduce new global state, browser APIs, dependencies, secrets, or rendering assumptions. It composes existing deterministic modules and can be imported or reverted independently.

## Work Completed

- Added `src/tidewalk-contact-runtime.js`.
- Added `tests/tidewalk-contact-runtime.test.mjs`.
- Added the runtime test to `tests/run-all.mjs`.
- Added player-facing interaction documentation in `docs/TIDEWALK_CONTACTS.md`.

## Gameplay Decision

The Tidewalk commitment is now expressed as a held interaction contract: if the player is in a contact ring and presses/holds the shared interaction input, the runtime resolves the contact through the existing deterministic route-choice state. Out-of-range and inactive scenes return `null` and do not mutate frontier choice state.

## Visual-Design Decision

The runtime preserves the prior Canvas visual language instead of inventing a parallel UI: Lantern Tender remains the warm safe-line path, while Black-Keel Scout remains the cold hostile countermark path. The player-facing documentation names those visual hierarchies explicitly so the upcoming `src/game.js` wiring has a clear presentation target.

## Validation

- Structural review confirmed the new runtime imports only existing local contact modules and exposes pure browser-facing helpers.
- The runtime test covers HUD label readiness, no-input safety, in-range commitment, out-of-range guarding, and renderer delegation through a fake Canvas context.
- Full local execution is still not available in this automation container because repository network access is blocked; validation is therefore limited to repository-side structural review and deterministic test authoring, not an executed Node run.

## Next Bottleneck

Patch `src/game.js` with the now-small integration: import `drawTidewalkContactRuntime` and `commitTidewalkContactFromInput`; render contacts inside the Tidewalk scene after survey completion; call the commit helper from the frame loop while `input.analyze` is active; surface `getTidewalkContactRuntime(state).hudLabel` in the HUD/primer; then remove or disable the remaining dossier route-choice click handler.
