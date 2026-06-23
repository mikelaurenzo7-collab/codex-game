# Tidewalk Contact Interaction

After both drowned warehouse survey sites are completed on foot, Tidewalk Coast exposes two physical faction contacts instead of treating the branch as a purely administrative dossier decision.

## Player Controls

- Move with **WASD** or arrow keys.
- Use **Space** to pulse against black-tide pressure.
- Move into a contact's range ring and hold **E** to commit through that contact.

## Contact Choices

### Lantern Tender

The Lantern Tender is the safer north-pier contact. Choosing this line commits to `quay-safe-lantern-line`, stabilizing a witnessed route back toward Tidelantern Quay.

Visual hierarchy: warm gold lantern cue, readable safe-line ring, and a direct `Hold E to commit` affordance.

### Black-Keel Scout

The Black-Keel Scout is the hostile underpier contact. Choosing this line commits to `black-keel-countermark`, opening the more dangerous countermark pursuit.

Visual hierarchy: cold underpier countermark, dark hostile ring, red-black threat treatment, and the same explicit `Hold E to commit` affordance so the choice remains mechanically fair.

## Current Implementation Status

The deterministic contact plan, field-state selector, Canvas renderer, and runtime commit helper are now split into focused modules with tests:

- `src/tidewalk-contact.js`
- `src/tidewalk-contact-field.js`
- `src/tidewalk-contact-canvas.js`
- `src/tidewalk-contact-runtime.js`

The next browser-client integration step is to import `drawTidewalkContactRuntime` and `commitTidewalkContactFromInput` into `src/game.js`, call the renderer in the Tidewalk scene when the survey is complete, route held **E** through the runtime helper, and remove the remaining dossier route-choice button handler.
