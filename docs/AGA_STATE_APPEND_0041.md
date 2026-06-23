# AGA State Append 0041 - Dynamic Tide Cycle System

## Current-State Delta

- Implemented a dynamic Tide Cycle system in `src/game-state.js` that cycles through `low` -> `high` -> `surge` -> `low` every 15 seconds.
- Dynamically scales hazard radii (0.6x in Low, 1.0x in High, 1.5x in Surge) for both survey descent and expedition micro-scenes.
- Scales hazard signal drain rate (0.5x in Low, 1.0x in High, 2.0x in Surge) depending on current tide phase.
- Surfaced the active tide phase indicator inside the HUD's `fragmentReadout` label (e.g. `(LOW TIDE)`, `(SURGE TIDE)`).
- Added full unit test coverage in `tests/tidewalk-tide.test.mjs` verifying transitions, scaling, and checkpoint serialization.
- Bumped `GAME_SAVE_VERSION` to `3` to handle schema validation for the persistent tide state object.

## Iteration Log Entry

### 0041 - Dynamic Tide Cycle System

- **State Assessment:** The Tidewalk scenes had static hazards with fixed collision bounds and constant signal drain, which made exploration predictable and decoupled from the maritime theme.
- **Strategic Choice:** B. Systemic Expansion.
- **Justification:** Fluctuating tide cycles deepen survival tension and force players to time their movements and survey holds based on the rising and falling black tide.
- **Execution Plan:**
  - Initialize the `tide` structure in `createGameState()`.
  - Step the tide phase timer when `state.scene === "tidewalk"`.
  - Adjust radii returned by `getTidewalkSurveyField` and `getTidewalkExpedition`.
  - Adjust signal drain rates inside their respective resolution blocks.
  - Append the uppercase tide phase text to the `fragmentReadout` element in `updateHud()`.
  - Write test suite `tests/tidewalk-tide.test.mjs` and register it in `run-all.mjs`.
- **Success Metrics:**
  - Automated tests pass.
  - Tide state saves and restores through local checkpoints.
  - HUD readout shows current tide level when in Tidewalk scenes.
- **Work Completed:** Implemented tide state, update loop, scaling rules, HUD readouts, test suite, and checkpoint upgrades.
- **Next Bottleneck:** Make the acoustic echoes react to the player's pulse by hunting the pulse origin location (Echo Hunt System).
