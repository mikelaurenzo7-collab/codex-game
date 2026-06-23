# Automation Run 0021 - Tidewalk Contact Field Contract

## State Assessment

The latest durable state still identifies the highest-leverage bottleneck as Tidewalk route commitment: warehouse surveying now happens physically, but the route commitment must keep moving out of the arrival dossier and into in-world coastal contacts. The repository already contained `src/tidewalk-contact.js`, `src/tidewalk-contact-field.js`, and contact-field tests, so the best scoped increment was to harden that field contract rather than add another disconnected prototype.

## Strategic Choice

**D. Technical/Polish Overhaul** with a narrow gameplay-support outcome.

## Justification

The contact system is the seam between deterministic Tidewalk route state and Canvas/HTML5 presentation. Before the client renderer is expanded, the field selector needs to provide everything the playable layer requires: nearest contact, actionable contact, contact objective target, interaction copy, and visual-art-direction metadata. That prevents the next UI pass from inventing duplicated presentation rules in `src/game.js`.

## Execution Plan

- Add stable contact-field instruction copy for out-of-range and in-range states.
- Expose `focusContact` and `objectiveTarget` so the Canvas objective arrow can target the correct coastal contact.
- Attach visual hierarchy metadata to each contact: warm safe-line lantern contact versus cold underpier countermark contact.
- Tighten `tests/tidewalk-contact-field.test.mjs` around objective target, focus contact, instruction copy, and visual tone.
- Update player-facing docs so Tidewalk route commitment is described as in-world contact commitment, not dossier route choice.

## Work Completed

- Refined `src/tidewalk-contact-field.js` with `instruction`, `focusContact`, `objectiveTarget`, and `visual` metadata per contact.
- Expanded `tests/tidewalk-contact-field.test.mjs` to prove actionable contact resolution, off-scene inactivity, out-of-range guidance, and branch-specific visual tone.
- Updated `README.md` controls and prototype summary to describe in-world Tidewalk contact commitment.

## Validation Evidence

- Local Node validation was run against a reconstructed minimal dependency surface for the changed contact-field module: `node tests/tidewalk-contact-field.test.mjs` -> `tidewalk contact field tests passed`.
- Full repository runtime execution was not possible through the container because outbound GitHub cloning was unavailable, so the strict review scope was limited to connector reads/writes plus local syntax/logic validation of the edited module surface.

## Gameplay Decision

The player-facing Tidewalk route commitment should be treated as a physical coastal-contact interaction. The selector now gives the next client pass a single focus contact and objective target so the player can be guided through movement rather than through a menu.

## Visual-Design Decision

Canva was not used because the bottleneck was deterministic playable integration, not mood-board discovery. The visual direction was captured directly in code: Lantern Tender remains a warm gold, north-pier safe-line read; Black-Keel Scout remains a cold underpier countermark read with hostile pressure. This gives the Canvas renderer presentable art-direction tokens without letting a design surface replace playable logic.

## Next Bottleneck

Wire `getTidewalkContactField` into `src/game.js`: import the selector/action, draw the two contact markers in the Tidewalk scene, route the active objective/HUD copy through contact instructions after warehouse survey completion, and let `E` resolve `resolveTidewalkContactAtPlayer` instead of relying on dossier route-choice buttons.
