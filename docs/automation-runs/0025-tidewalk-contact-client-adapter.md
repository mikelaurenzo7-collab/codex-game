# Automation Run 0025 - Tidewalk Contact Client Adapter

## State Assessment

The latest default branch already contains deterministic Tidewalk contact planning, field selection, Canvas rendering, runtime commit helpers, and aggregate tests. The durable state log still ends at the earlier bottleneck where Tidewalk route commitment was dossier-only, while player-facing README text now describes in-world contact commitment. The single highest-leverage bottleneck for this run was therefore the client integration seam: `src/game.js` still needs one stable browser-frame surface that can render contacts, step held input, invalidate arrival UI, and supply HUD/dossier copy without duplicating contact logic.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Justification

A direct `game.js` wiring pass would touch a large monolithic client file. The safest scoped increment was to collapse the existing contact modules behind a tiny client adapter first, with tests proving the exact statuses and invalidation flags the live shell should consume. This reduces the risk of the next playable wiring pass and prevents ad hoc imports from spreading contact presentation logic through the client.

## Execution Plan

- Add a no-dependency `src/tidewalk-contact-client.js` adapter around the existing runtime and Canvas renderer.
- Return player-facing status text, objective copy, dossier mode, render flag, and arrival invalidation from one deterministic call surface.
- Add tests for ready, committing, resolved, inactive, and draw-bridge behavior.
- Register the new test in the aggregate suite.
- Update player-facing Tidewalk contact documentation.

## Work Completed

- Added `src/tidewalk-contact-client.js`.
- Added `tests/tidewalk-contact-client.test.mjs`.
- Registered the test in `tests/run-all.mjs`.
- Updated `docs/TIDEWALK_CONTACTS.md` to name the client adapter as the intended live integration seam.

## Gameplay Decision

Tidewalk contact commitment remains a held-input, in-world faction choice: moving into a contact ring and holding **E** commits the branch, returns a consumed-input flag, and marks arrival UI for refresh. The client adapter makes that interaction consume a single browser-frame contract rather than separate rendering, runtime, and dossier calls.

## Visual-Design Decision

No Canva pass was used because the visual hierarchy already exists in the Canvas renderer and the current bottleneck is client wiring risk, not art-direction ambiguity. The approved visual language remains warm gold lantern/safe-line for the Lantern Tender and cold red-black countermark for the Black-Keel Scout.

## Validation

- Structural repository inspection confirmed `src/game.js` does not yet import the contact runtime/client adapter.
- The new test covers client states for active ready contact, active held-commit copy, resolved Black-Keel contact, inactive archive scene, and renderer bridge behavior.
- Full local Node/browser execution was not available in this connector-only run, so validation is limited to authored deterministic tests plus structural review. No runtime pass is claimed.

## Next Bottleneck

Wire `src/game.js` to `drawTidewalkContactClient` and `stepTidewalkContactClient`, render contacts after the Tidewalk warehouse survey completes, route held **E** through the adapter, and remove or disable the remaining dossier route-choice button path once the Canvas contact path is live.
