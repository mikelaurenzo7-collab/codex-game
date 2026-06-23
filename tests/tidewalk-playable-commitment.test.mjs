import assert from "node:assert/strict";
import {
  createTidewalkPlayableCommitmentFrameAdapter,
  getTidewalkPlayableCommitmentStage,
  shouldBlockLegacyTidewalkRouteClick,
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
  assert.equal(shouldBlockLegacyTidewalkRouteClick(stage), true);
  assert.equal(shouldBlockLegacyTidewalkRouteClick(state), true);
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
  assert.equal(shouldBlockLegacyTidewalkRouteClick(stage), false);
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
  assert.equal(shouldBlockLegacyTidewalkRouteClick(stage), false);
}

{
  const calls = [];
  const state = createState({ x: 1580, y: 260 });
  const input = { analyze: true };
  const runFrame = createTidewalkPlayableCommitmentFrameAdapter({
    state,
    input,
    updateGameState(frameState, frameInput, dt) {
      calls.push(`update:${dt}:${frameInput.analyze}`);
      frameState.time += dt;
    },
    drawGame(stage) {
      calls.push(`draw:${stage.spine.identityName}`);
    },
    updateHud(stage) {
      calls.push(`hud:${stage.statusText}`);
    },
    invalidateArrival(stage) {
      calls.push(`invalidate:${stage.committedContact.id}`);
    },
    drawContacts: false
  });

  const stage = runFrame(0.25);
  assert.equal(state.frontier.selectedRouteChoiceId, "quay-safe-lantern-line");
  assert.equal(stage.committedContact.id, "lantern-tender");
  assert.deepEqual(calls, [
    "update:0.25:true",
    "invalidate:lantern-tender",
    "draw:Witness-Bound Archive",
    "hud:Lantern Tender chosen"
  ]);
}

{
  assert.throws(
    () => createTidewalkPlayableCommitmentFrameAdapter({ state: createState(), input: {} }),
    /requires updateGameState/
  );
}

console.log("tidewalk playable commitment tests passed");
