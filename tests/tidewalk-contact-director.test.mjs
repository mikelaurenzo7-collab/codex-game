import assert from "node:assert/strict";
import {
  applyTidewalkContactDirector,
  getTidewalkContactDirectorState
} from "../src/tidewalk-contact-director.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 60,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const director = getTidewalkContactDirectorState(createState());
  assert.equal(director.active, true);
  assert.equal(director.complete, false);
  assert.equal(director.headline, "Commit window: Lantern tender");
  assert.equal(director.shouldOverrideObjective, true);
  assert.equal(director.shouldSuppressLegacyRouteButtons, true);
  assert.match(director.bottomLogText, /lantern tender/i);
}

{
  const objectiveReadout = { textContent: "old objective" };
  const statusReadout = { textContent: "old status" };
  const logs = [];
  const director = applyTidewalkContactDirector({
    state: createState({ x: 50, y: 50 }),
    input: {},
    objectiveReadout,
    statusReadout,
    logSink: (line) => logs.push(line)
  });
  assert.equal(director.active, true);
  assert.match(objectiveReadout.textContent, /Move toward Lantern tender/);
  assert.match(statusReadout.textContent, /Move toward Lantern tender/);
  assert.equal(logs.length, 1);
  assert.match(logs[0], /gold lantern/i);
}

{
  const director = getTidewalkContactDirectorState(createState({ x: 1570, y: 860 }));
  assert.equal(director.headline, "Commit window: Countermark scout");
  assert.equal(director.omenDeck.focusOmen.title, "Countermark Pursuit");
}

{
  const objectiveReadout = { textContent: "keep objective" };
  const statusReadout = { textContent: "keep status" };
  const director = applyTidewalkContactDirector({
    state: createState({ scene: "archive" }),
    objectiveReadout,
    statusReadout
  });
  assert.equal(director.active, false);
  assert.equal(objectiveReadout.textContent, "keep objective");
  assert.equal(statusReadout.textContent, "keep status");
}

{
  const director = getTidewalkContactDirectorState(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(director.complete, true);
  assert.match(director.headline, /Line committed/);
  assert.match(director.statusText, /Countermark scout chosen/);
}

console.log("tidewalk contact director tests passed");
