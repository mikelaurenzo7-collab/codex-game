# AGA State Append 0042 - Echo Signal Tracking (Hunt) System

## Current-State Delta

- Implemented the "Echo Signal Tracking (Hunt) System" in `src/game-state.js`.
- Configured echoes to register a `huntTarget` at the player's coordinates if they are within twice the pulse radius (`WORLD.pulseRadius * 2.0`) when a pulse is triggered.
- Modified `moveEchoes` to prioritize moving towards the `huntTarget` at $1.5\times$ speed if one is active.
- Made echoes clear `huntTarget` and resume their normal patrol path when they are within 5 pixels of the target.
- Added full unit test coverage in `tests/echo-hunt.test.mjs` verifying hunting behavior, speed multipliers, stun overrides, and checkpoint validation.

## Iteration Log Entry

### 0042 - Echo Signal Tracking (Hunt) System

- **State Assessment:** Echoes moved in fixed patrol loops regardless of player actions, which made avoiding them a mechanical movement exercise and disconnected the scan pulse from high-risk gameplay.
- **Strategic Choice:** A. Core Mechanic Deep Dive.
- **Justification:** Making echoes trace the origin of pulses turns the scan pulse into a double-edged sword: pulsing reveals hidden clues and stuns nearby targets, but draws distant threats straight to the player.
- **Execution Plan:**
  - Initialize the `huntTarget` field on each echo.
  - In `triggerPulse`, set `huntTarget` coordinates for echoes within $2\times$ the pulse radius.
  - In `moveEchoes`, if `huntTarget` exists and the echo is not stunned, interpolate towards the target at $1.5\times$ speed. Clear target and resume patrol once near.
  - Update validation in `validateCheckpointState` to support `huntTarget` schema.
  - Write test suite `tests/echo-hunt.test.mjs` and register it in `run-all.mjs`.
- **Success Metrics:**
  - Automated tests pass.
  - Pulsing attracts echoes to the pulse origin.
  - Stunned echoes wait for their stun to expire before hunting.
- **Work Completed:** Implemented signal tracing hunting state, speed modifiers, checkpoint integration, and test suite.
- **Next Bottleneck:** Consolidate these three runs into the master state log and verify the entire vertical slice end-to-end.
