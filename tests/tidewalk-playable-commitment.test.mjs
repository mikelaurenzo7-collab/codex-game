import assert from "node:assert/strict";
import {
  getTidewalkPlayableCommitmentStage,
  stepTidewalkPlayableCommitmentStage
} from "../src/tidewalk-playable-commitment.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 240,
    status: "running",
    player: { x, y, radius: 18 },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId,
      lastRouteChoice: null
    }
  };
}

{
  const state = createState({ x: 1100, y: 540 });
  const stage = getTidewalkPlayableCommitmentStage(state);
  assert.equal(stage.active, true);
  assert.equal(stage.complete, false);
  assert.equal(stage.shouldSuppressLegacyRouteButtons, true);
  assert.equal(stage.dossierProjection.suppressLegacyChoiceButtons, true);
  assert.match(stage.dossierProjection.title, /Choose a coastal contact/);
  assert.ok(stage.dossierProjection.choices.every((choice) => choice.disabled));
  assert.match(stage.identityText, /Coast/);
}

{
  const state = createState({ x: 1580, y: 260 });
  const stage = stepTidewalkPlayableCommitmentStage(state, { analyze: true }, { draw: false });
  assert.equal(stage.committedContact.id, "lantern-tender");
  assert.equal(state.frontier.selectedRouteChoiceId, "quay-safe-lantern-line");
  assert.equal(stage.shouldInvalidateHud, true);
  assert.equal(stage.complete, true);
  assert.equal(stage.spine.identityName, "Witness-Bound Archive");
  assert.match(stage.statusText, /chosen/i);
}

{
  const state = createState({ x: 1570, y: 860 });
  const stage = stepTidewalkPlayableCommitmentStage(state, { interact: true }, { draw: false });
  assert.equal(stage.committedContact.id, "black-keel-scout");
  assert.equal(state.frontier.selectedRouteChoiceId, "black-keel-countermark");
  assert.equal(stage.spine.identityName, "Hunted Archive");
  assert.match(stage.bottomLogText, /Black-Keel/);
}

{
  const state = createState({ scene: "archive" });
  const stage = getTidewalkPlayableCommitmentStage(state);
  assert.equal(stage.active, false);
  assert.equal(stage.shouldSuppressLegacyRouteButtons, false);
  assert.equal(stage.dossierProjection, null);
}

console.log("tidewalk playable commitment tests passed");
