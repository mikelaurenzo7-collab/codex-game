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

## Contact Pressure

`src/tidewalk-contact-pressure.js` adds authored pressure lines and a deterministic tension scalar for the live contact moment. Before commitment, the coast now speaks differently when the nearest contact is far, near, or ready. After commitment, the pressure layer returns the chosen contact's committed line so the HUD or bottom log can make the faction consequence feel immediate.

`src/tidewalk-contact-pressure-canvas.js` makes that tension visible in the playable Canvas layer. The currently focused contact receives a pulsing aura keyed to its authored faction palette: gold dashed breath for the Lantern Tender and red-black broken pressure for the Black-Keel Scout. The aura grows with deterministic tension and labels the proximity band so screenshots and smoke tests can verify the player-facing state.

## Current Implementation Status

The deterministic contact plan, field-state selector, Canvas renderer, runtime commit helper, browser-facing client adapter, game-frame adapter, arrival-panel projection, HUD bridge, pressure layer, and pressure-aura renderer are split into focused modules with tests:

- `src/tidewalk-contact.js`
- `src/tidewalk-contact-field.js`
- `src/tidewalk-contact-canvas.js`
- `src/tidewalk-contact-runtime.js`
- `src/tidewalk-contact-client.js`
- `src/tidewalk-contact-hud.js`
- `src/tidewalk-contact-pressure.js`
- `src/tidewalk-contact-pressure-canvas.js`

`src/tidewalk-contact-runtime.js` exposes `stepTidewalkContactRuntime(state, input)`, a browser-frame contract that returns the pre-step field, post-step field, committed contact, input-consumption flag, and HUD-refresh flag.

`src/tidewalk-contact-client.js` exposes `runTidewalkContactFrame({ ctx, state, input })`, the intended single-call live-client seam. It steps the held-**E** contact commit, draws the Canvas pressure aura plus contact markers when the choice remains active, returns the active status/objective/dossier copy, and reports both HUD and arrival invalidation flags after commitment.

`src/tidewalk-contact-client.js` also exposes `getTidewalkContactArrivalProjection(state, input)`. This projection converts the contact runtime into player-facing arrival-panel copy and deliberately marks legacy route-choice buttons as disabled while the in-world contact choice is active. The arrival panel should show contact rows as guidance only; commitment belongs to the held-**E** world interaction.

`src/tidewalk-contact-hud.js` exposes `getTidewalkContactHudBridge(state, input)` and `applyTidewalkContactHudBridge(...)`. The bridge is the smallest safe live-client insertion point for overriding objective/status copy and suppressing dossier route buttons while the in-world contact choice is active.

`src/tidewalk-contact-client.js` also exposes `createTidewalkContactGameFrameAdapter(...)` for the live browser loop. The adapter enforces the order that keeps the playable frame deterministic:

1. advance normal game state;
2. process the Tidewalk contact held-**E** commit;
3. invalidate arrival HUD state if the commit resolved;
4. draw the game;
5. refresh HUD copy.

The remaining `src/game.js` hookup should now be a surgical import and frame-loop replacement rather than a broad rewrite. The old dossier route-choice click handler should be removed only in the same reviewed change that calls this adapter from the live client and renders `getTidewalkContactArrivalProjection` in the arrival panel.
