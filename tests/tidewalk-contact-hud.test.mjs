import assert from "node:assert/strict";
import {
  applyTidewalkContactHudBridge,
  getTidewalkContactHudBridge
} from "../src/tidewalk-contact-hud.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 18,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const bridge = getTidewalkContactHudBridge(createState());
  assert.equal(bridge.active, true);
  assert.equal(bridge.complete, false);
  assert.equal(bridge.shouldOverrideObjective, true);
  assert.equal(bridge.shouldOverrideStatus, true);
  assert.equal(bridge.actionableContactLabel, "Lantern tender");
  assert.match(bridge.objectiveText, /Hold E to commit/);
  assert.equal(bridge.shouldHideLegacyRouteButtons, true);
}

{
  const objectiveReadout = { textContent: "original objective" };
  const statusReadout = { textContent: "original status" };
  const bridge = applyTidewalkContactHudBridge({
    state: createState({ x: 50, y: 50 }),
    input: { analyze: false },
    objectiveReadout,
    statusReadout
  });
  assert.equal(bridge.active, true);
  assert.match(objectiveReadout.textContent, /Move toward Lantern tender/);
  assert.match(statusReadout.textContent, /Move toward Lantern tender/);
}

{
  const objectiveReadout = { textContent: "keep objective" };
  const statusReadout = { textContent: "keep status" };
  const bridge = applyTidewalkContactHudBridge({
    state: createState({ scene: "archive" }),
    objectiveReadout,
    statusReadout
  });
  assert.equal(bridge.active, false);
  assert.equal(bridge.shouldOverrideObjective, false);
  assert.equal(objectiveReadout.textContent, "keep objective");
  assert.equal(statusReadout.textContent, "keep status");
}

{
  const bridge = getTidewalkContactHudBridge(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(bridge.active, false);
  assert.equal(bridge.complete, true);
  assert.equal(bridge.shouldOverrideObjective, false);
  assert.equal(bridge.shouldOverrideStatus, true);
  assert.equal(bridge.selectedContactLabel, "Countermark scout");
  assert.match(bridge.statusText, /Countermark scout chosen/);
}

console.log("tidewalk contact HUD bridge tests passed");
