# 0020 — Tidewalk Contact Field Review Cleanup

## Bottleneck

`docs/AGA_STATE.md` identifies the current highest-leverage seam: after the physical Tidewalk warehouse survey, the coastal route commitment still needs to become an in-world contact choice rather than a dossier button.

## Review finding

The latest default branch already contained a stronger integrated foundation than a standalone prototype: `src/tidewalk-contact.js`, `src/tidewalk-contact-field.js`, deterministic contact tests, and workflow coverage for the contact modules. That adapter is the correct bridge because it gives the live Canvas scene a single source of truth for closest, actionable, and selected contacts.

## Work completed

- Removed the duplicate standalone Tidewalk contact-choice prototype files that were briefly added during this run.
- Preserved the mainline `tidewalk-contact` and `tidewalk-contact-field` modules and their tests.
- Left the live implementation seam explicit: `game-state.js` should keep the player in Tidewalk after the second warehouse survey, `game.js` should render/contact-confirm the two anchors, and the dossier should become read-only status.

## Gameplay decision

Do not split contact choice into a separate playable page. The route decision belongs in the existing Tidewalk scene, after the warehouse survey, with proximity and held `E` confirmation routed through `resolveTidewalkContactAtPlayer(state)`.

## Visual-design decision

Use the existing authored contact contrast as the visual reference: the Lantern Tender should read as warm gold lantern-chain safety at the north pier, while the Black-Keel Scout should read as cold black paint, lower-pier suspicion, and hostile underpier geometry. Canva was not used because the repo already contains enough visual direction for this narrow integration pass and the blocker is playable state/render wiring.

## Validation status

No local checkout/runtime was available in this execution environment, so validation was limited to connector-level file inspection. The existing test runner already includes `tests/tidewalk-contact.test.mjs` and `tests/tidewalk-contact-field.test.mjs`; the next implementation pass must run `node tests/run-all.mjs` after wiring the field into the live Canvas client.
