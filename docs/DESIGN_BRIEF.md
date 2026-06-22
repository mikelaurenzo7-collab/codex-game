# Signal Below Design Brief

## Initial Concept

**Selected option:** Option 4, Atmospheric Exploration/Mystery.

**Working title:** Signal Below.

**Premise:** The player is a salvage cartographer descending through a drowned archive beneath a dead coastal city. The archive is full of hidden memory fragments, unstable relays, and hostile acoustic echoes left behind by a failed expedition.

**Core fantasy:** The player is not fighting the ruin. They are reading it under pressure, deciding when to spend limited signal power to reveal truths before the archive closes around them.

## MVP Scope

The first playable slice proves one core loop:

1. Explore a compact top-down archive map.
2. Spend signal power to emit a pulse.
3. Use the pulse to reveal hidden memory fragments and stun nearby echoes.
4. Collect all fragments.
5. Reach the extraction gate once the archive thread is complete.

## Unique Selling Proposition

The mystery mechanic is spatial and resource-bound. Evidence is not simply found by walking over glowing objects; it is revealed by choosing where and when to pulse. That gives future iterations a natural design space for harder clues, false signals, unreliable maps, and narrative risk.

## Technology Stack

The first slice uses vanilla HTML5 Canvas and ES modules.

**Justification:** The repository started empty, so the fastest honest proof is a no-dependency browser-playable prototype with testable game-state logic. It can later be packaged for PC through Electron, Tauri, or an engine migration if the loop earns that cost.

## Open-World Trajectory

The current `Signal Below` slice is the validated seed mechanic for the broader open-world direction chosen for the long-running automation: `Frontier of the Deep Green`. The signal pulse, evidence journal, and field-analysis rules should evolve into wilderness survey tools for a larger explorable world with regions, settlements, faction memory, ecological hazards, and player-authored routes. Until that larger structure exists, each run should preserve the playable slice and extend it with mechanics that can survive the transition into a systemic open-world game.

The first scale bridge is the survey atlas: named regions, authored landmarks, current-region awareness, and persistent discoveries. This should grow toward a dense world structure inspired by the breadth of major open-world RPGs: many distinct holds/biomes, memorable routes, local histories, settlements, dangerous wilderness pockets, and systemic reasons to revisit places after new evidence or tools are gained.

The next scale bridge is the frontier route layer: explicit region-to-region corridors, off-map prospects, travel-gate identities, hazard pressure, and settlement opportunities. This lets the current archive feel like one surveyed chunk inside a much larger world, while giving future runs a clean path toward chunk streaming, overworld travel, faction geography, and authored road stories.

The first settlement foothold is Tidewalk Coast. Once the archive lift route is linked, the arrival dossier now exposes a state-backed edge encounter where the player secures docking rights with Tidelantern Quay. That handoff now continues into a state-backed coastal survey operation with two drowned warehouses, turning the route into a small follow-up loop that surfaces resources, traces a hostile salvage mark, and seeds the first coastal faction trail for later field slices.

The first spatial frontier consequences now branch out of the Tidewalk dossier: choosing `black-keel-countermark` creates a physical return-to-gate field operation at the Coastline Lift, while choosing `quay-safe-lantern-line` sends the player back inland to sync a witness relay at South Relay Camp. This keeps scope pragmatic while proving a key open-world principle for `Frontier of the Deep Green`: authored route choices should change not just text, but where the player must go next and what they must physically stabilize in the world.

The first world-boundary payoff is Brinehook Low Piers, a separate Tidewalk Coast micro-scene reached after either coastal field operation. It reuses the signal economy as a survival tool: black-tide pools drain signal, pulses suppress them temporarily, and each route choice resolves at a different authored destination before returning persistent evidence inland.

## Success Metrics

- A player can load the prototype locally.
- The world renders as a navigable, atmospheric play space.
- The pulse consumes signal and creates a visible scan wave.
- Hidden fragments can be revealed, collected, and counted.
- The gate unlocks only after all fragments are collected.
- Automated tests cover the core state transitions.

## First Strategic Decision

**Category:** A. Core Mechanic Deep Dive.

**Reason:** The first bottleneck was the absence of a playable core loop. Adding meta-progression, multiplayer, persistence, or external services before movement and signal reveal are proven would create unearned complexity.

## Known Risks

- The prototype lacks onboarding and may require external instructions for controls.
- Canvas rendering is custom and will need tooling if the art direction expands.
- The initial map is hand-authored, so procedural mystery structure is not yet tested.
- Echo pressure is functional but not yet tuned for interesting difficulty.
