# AGA State Append 0038 - Tidewalk Playable Commitment Stage

## Current-State Delta

- Tidewalk now has a tested playable commitment-stage contract that composes the contact client, identity spine, dossier projection, HUD invalidation, and legacy-route-button suppression.
- The route-commitment model is explicitly in-world: the dossier guides the player to coastal contacts, and the contact stage resolves the Lantern Tender or Black-Keel Scout commitment through held interaction.

## Iteration Log Entry

### 0038 - Tidewalk Playable Commitment Stage

- **State Assessment:** The state log's active bottleneck remains the Tidewalk commitment seam: route choice should no longer be a dossier button. Recent Tidewalk modules created contact, pressure, aftermath, and identity primitives, but they needed a single client-facing orchestration surface.
- **Strategic Choice:** D. Technical/Polish Overhaul.
- **Justification:** The highest-leverage increment was to reduce integration ambiguity before adding more coastal content. A tested stage contract makes future `src/game.js` wiring safer and preserves the playable contact decision as the source of truth.
- **Execution Plan:**
  - **Specific Tasks:** Add a playable commitment stage; compose contact frame state with identity spine; suppress legacy route-button semantics; expose objective/status/bottom-log projections; add tests for guidance, Lantern commitment, Black-Keel commitment, and dormant archive behavior; register the aggregate test.
  - **Technology Stack Justification:** Vanilla ES modules remain appropriate. The work is deterministic state/client orchestration that should be tested without Canvas or external services, while still feeding the HTML5 Canvas client.
  - **Success Metrics:** The stage reports active contact guidance after both warehouses are surveyed; legacy route buttons are disabled/suppressed; holding interaction at either contact mutates `selectedRouteChoiceId`; identity changes to `Witness-Bound Archive` or `Hunted Archive`; archive-only state remains dormant.
  - **Risk Mitigation:** The stage wraps existing modules rather than rewriting route-choice primitives. Rollback is isolated to one new module, one test, one aggregate import, and documentation.
- **Work Completed:** Added `src/tidewalk-playable-commitment.js`, `tests/tidewalk-playable-commitment.test.mjs`, aggregate test registration, and run documentation.
- **Validation Evidence:** Connector-side structural review plus deterministic tests registered in `tests/run-all.mjs`. Local runtime/browser execution was not available through the connector, so no local test pass is claimed.
- **Gameplay Decision:** Tidewalk route commitment is represented as a field contact stage: the player commits through the Lantern Tender or Black-Keel Scout, not a menu choice.
- **Visual-Design Decision:** No Canva pass. The stage preserves the established hierarchy: dossier as guidance/status, Canvas contact field as the decision surface, lantern-safe versus black-red countermark identity.
- **Next Bottleneck:** Wire `stepTidewalkPlayableCommitmentStage` into `src/game.js` so the root frame/HUD loop consumes this single Tidewalk contract directly.
