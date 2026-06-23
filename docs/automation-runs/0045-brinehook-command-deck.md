# Automation Run 0045 — Brinehook Command Deck

## State Assessment

Brinehook had a usable Canvas encounter, deterministic branch selectors, tide pressure, pulse-revealed cargo, and a resolution contract. The weak seam was interpretation: the active game HUD could identify the scene and objective, but it did not assemble those signals into a compact crossing-level command readout. That left the most volatile scene feeling mechanically richer than it read moment to moment.

## Strategic Choice

**D. Technical/Polish Overhaul**, with a deliberately bold presentation shift.

## Decision

Add a scene-specific, tide-aware tactical command deck that is visible only during Brinehook Low Piers. It projects existing HUD values rather than introducing a second state store, new actions, hidden completion rules, or duplicate tide logic.

## Work Completed

- Added `src/brinehook-command-brief.js`, a pure selector that turns location, status, and objective readouts into a compact tactical brief.
- Added `src/brinehook-command-deck.js`, a DOM projection that observes canonical live HUD readouts and only shows the command deck during Brinehook.
- Added `src/brinehook-command-deck.css` with a restrained coastal command language: teal clarity, gold operational pressure, and red surge warning.
- Mounted the deck in `index.html` without changing the Canvas renderer or progression state.
- Added deterministic unit coverage and registered it in `tests/run-all.mjs`.
- Updated player-facing documentation.

## UX Contract

- **Archive / standard Tidewalk:** no command deck. The core HUD remains the only information surface.
- **Brinehook Low Piers:** the deck shows the tide phase, current condition, canonical objective, and a concise field instruction.
- **Black tide suppressed:** the deck shifts to a teal recovery posture and tells the player to reposition, collect revealed cargo, and commit before pressure returns.
- **Surge tide:** the deck shifts to red and makes the pulse-and-move survival rhythm explicit.

## Reliability

The deck reads the live HUD; it never writes gameplay state. It therefore cannot desynchronize signal, tide, sentinel, cargo, route choice, checkpoint, or completion rules. The pure selector has direct tests for inactive, surge-pressure, and tide-suppressed states.

## Next Bottleneck

Feed the existing `getBrinehookEncounterState` and `getBrinehookResolutionState` directly into the live game HUD, replacing the DOM projection with a fully typed client adapter that can report exact sentinel distance, haven occupancy, and cargo recovery count.