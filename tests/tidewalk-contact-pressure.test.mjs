import assert from "node:assert/strict";
import {
  getTidewalkContactPressure,
  getTidewalkContactPressureLog
} from "../src/tidewalk-contact-pressure.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 24,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const pressure = getTidewalkContactPressure(createState({ x: 50, y: 50 }));
  assert.equal(pressure.active, true);
  assert.equal(pressure.complete, false);
  assert.equal(pressure.band, "far");
  assert.equal(pressure.focusContact.id, "lantern-tender");
  assert.match(pressure.line, /gold lantern/);
  assert.ok(pressure.tension >= 0 && pressure.tension <= 1);
  assert.match(getTidewalkContactPressureLog(createState({ x: 50, y: 50 })), /Countermark scout remains visible/);
}

{
  const pressure = getTidewalkContactPressure(createState({ x: 1465, y: 295 }));
  assert.equal(pressure.active, true);
  assert.equal(pressure.band, "near");
  assert.match(pressure.line, /safe passage is close/);
}

{
  const pressure = getTidewalkContactPressure(createState());
  assert.equal(pressure.active, true);
  assert.equal(pressure.band, "ready");
  assert.equal(pressure.focusContact.id, "lantern-tender");
  assert.match(pressure.line, /Hold E/);
  assert.match(pressure.pulseHint, /other line/);
}

{
  const pressure = getTidewalkContactPressure(createState({ x: 1570, y: 860 }));
  assert.equal(pressure.active, true);
  assert.equal(pressure.band, "ready");
  assert.equal(pressure.focusContact.id, "black-keel-scout");
  assert.match(pressure.line, /dangerous truth/);
}

{
  const pressure = getTidewalkContactPressure(createState({ scene: "archive" }));
  assert.equal(pressure.active, false);
  assert.equal(pressure.band, "silent");
  assert.equal(getTidewalkContactPressureLog(createState({ scene: "archive" })), null);
}

{
  const pressure = getTidewalkContactPressure(createState({ selectedRouteChoiceId: "quay-safe-lantern-line" }));
  assert.equal(pressure.active, false);
  assert.equal(pressure.complete, true);
  assert.equal(pressure.band, "committed");
  assert.match(pressure.line, /gold line is knotted/);
  assert.match(getTidewalkContactPressureLog(createState({ selectedRouteChoiceId: "black-keel-countermark" })), /Black-Keel knows/);
}

console.log("tidewalk contact pressure tests passed");
