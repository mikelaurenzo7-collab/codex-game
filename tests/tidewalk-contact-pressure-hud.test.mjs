import assert from "node:assert/strict";
import {
  applyTidewalkContactPressureHud,
  getTidewalkContactPressureHud
} from "../src/tidewalk-contact-pressure-hud.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 22,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

function createReadout() {
  return { textContent: "" };
}

{
  const hud = getTidewalkContactPressureHud(createState());
  assert.equal(hud.active, true);
  assert.equal(hud.complete, false);
  assert.equal(hud.band, "ready");
  assert.equal(hud.focusContactLabel, "Lantern tender");
  assert.equal(hud.shouldOverrideStatus, true);
  assert.equal(hud.shouldAppendLog, true);
  assert.match(hud.line, /Hold E/);
  assert.match(hud.logLine, /other line/);
}

{
  const statusReadout = createReadout();
  const logReadout = createReadout();
  const hud = applyTidewalkContactPressureHud({
    state: createState({ x: 1570, y: 860 }),
    statusReadout,
    logReadout
  });
  assert.equal(hud.focusContactLabel, "Countermark scout");
  assert.match(statusReadout.textContent, /dangerous truth/);
  assert.match(logReadout.textContent, /other line/);
}

{
  const statusReadout = createReadout();
  const logReadout = createReadout();
  const hud = applyTidewalkContactPressureHud({
    state: createState({ selectedRouteChoiceId: "quay-safe-lantern-line" }),
    statusReadout,
    logReadout
  });
  assert.equal(hud.active, false);
  assert.equal(hud.complete, true);
  assert.match(statusReadout.textContent, /gold line is knotted/);
  assert.match(logReadout.textContent, /gold line is knotted/);
}

{
  const statusReadout = createReadout();
  const logReadout = createReadout();
  const hud = applyTidewalkContactPressureHud({
    state: createState({ scene: "archive" }),
    statusReadout,
    logReadout
  });
  assert.equal(hud.active, false);
  assert.equal(hud.complete, false);
  assert.equal(statusReadout.textContent, "");
  assert.equal(logReadout.textContent, "");
}

{
  assert.throws(() => applyTidewalkContactPressureHud(), /requires a game state/);
}

console.log("tidewalk contact pressure HUD tests passed");
