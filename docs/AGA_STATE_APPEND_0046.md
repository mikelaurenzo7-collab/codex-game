# AGA State Append 0046 - Brinehook Resolution Client Contract

- **State Assessment:** Brinehook Low Piers had playable encounter state and deterministic resolution outcomes, but the live-client seam was still underspecified. HUD copy, primer copy, bottom-log copy, tone, and Canvas marker semantics needed a single stable contract before wiring them into `src/game.js`.
- **Strategic Choice:** D. Technical/Polish Overhaul.
- **Justification:** The bottleneck was not more worldbuilding or a new mechanic. The most useful increment was to make existing branch outcomes consumable by the playable client without duplicating branch logic.
- **Execution Plan:**
  - **Specific Tasks:** Add a read-only Brinehook client presentation selector; map every resolution status to HUD/status/primer/bottom-log copy; expose tone and marker target data; extend tests; update player-facing Brinehook docs.
  - **Technology Stack Justification:** The existing no-dependency ES module and HTML5 Canvas stack remains appropriate. The selector is browser-independent deterministic logic that the Canvas layer can consume directly.
  - **Success Metrics:** Brinehook dormant, Black-Keel, and Lantern states all produce deterministic copy and marker semantics; tests cover the contract; no gameplay mutation is introduced.
  - **Risk Mitigation:** Presentation selection delegates gameplay truth to `getBrinehookResolutionState` and never mutates the state object.
- **Work Completed:** Added `getBrinehookResolutionClientState` in `src/brinehook-resolution.js`, extended `tests/brinehook-resolution.test.mjs`, updated `docs/BRINEHOOK_LOW_PIERS.md`, and logged this run in `docs/automation-runs/0046-brinehook-resolution-client-contract.md`.
- **Gameplay Decision:** Brinehook guidance now shifts from cargo search to sentinel suppression on Black-Keel, and from haven approach to cargo proof on Lantern.
- **Visual-Design Decision:** Encoded the UI palette as state tones: `danger`, `warning`, `safe`, `success`, and `muted`. Canva was not used because the necessary increment was deterministic presentation plumbing rather than visual reference generation.
- **Validation Evidence:** Static review confirmed the selector is read-only. Tests were authored for all Brinehook presentation states. Full local runtime execution was not claimed in this connector-only run.
- **Next Bottleneck:** Wire the client presentation selector into `src/game.js` for actual live HUD/Canvas rendering and eventual Brinehook exit flow.
