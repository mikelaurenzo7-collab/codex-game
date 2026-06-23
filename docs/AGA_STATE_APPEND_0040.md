# AGA State Append 0040 - Live Tidewalk Commitment Integration

## Current-State Delta

- Wired `stepTidewalkPlayableCommitmentStage` and `getTidewalkPlayableCommitmentStage` into the live browser client loop (`src/game.js`).
- Rendered Tidewalk contacts in-world using `drawTidewalkContactClient` during the Tidewalk scene.
- Integrated the stage dossier projection into the arrival route-choice HUD.
- Blocked legacy dossier buttons using `shouldBlockLegacyTidewalkRouteClick` to ensure players commit in-world.
- Fixed preexisting failing tests in `tests/tidewalk-contact.test.mjs`, `tests/tidewalk-contact-canvas.test.mjs`, and `tests/tidewalk-playable-commitment.test.mjs`.

## Iteration Log Entry

### 0040 - Live Tidewalk Commitment Integration

- **State Assessment:** The Tidewalk commitment stage was tested but not integrated into the live browser client. Preexisting tests were also failing due to interface mismatches and minor typos in mocks and assertions.
- **Strategic Choice:** D. Technical/Polish Overhaul.
- **Justification:** Integrating the verified commitment stage closes the Tidewalk loop interaction gap, ensuring players make route choices physically in-world rather than through menu buttons.
- **Execution Plan:**
  - Wire `stepTidewalkPlayableCommitmentStage` into the main frame update in `src/game.js`.
  - Wire `drawTidewalkContactClient` into the canvas rendering block.
  - Wire `stage.dossierProjection` and `shouldBlockLegacyTidewalkRouteClick` into `updateArrival` and the dossier route choice listener.
  - Fix test failures in contact canvas, contact plan, and commitment test expectations.
- **Success Metrics:**
  - All automated tests pass.
  - Live client renders contacts at Brinehook piers.
  - Clicks on the dossier buttons are blocked when in-world contacts are active.
- **Work Completed:** Integrated commitment stage into `src/game.js` and resolved the three failing test suites.
- **Next Bottleneck:** Implement the Tide Cycle system (Low, High, Surge) in the Tidewalk scenes to dynamically scale hazards.
