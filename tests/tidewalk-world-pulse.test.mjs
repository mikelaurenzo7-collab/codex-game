import assert from "node:assert/strict";
import { formatTidewalkWorldPulse, getTidewalkWorldPulse } from "../src/tidewalk-world-pulse.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 80,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const pulse = getTidewalkWorldPulse(createState());
  assert.equal(pulse.active, true);
  assert.equal(pulse.mood, "watchful");
  assert.equal(pulse.tideColor, "lantern-gold");
  assert.equal(pulse.hazardPosture, "held-back");
  assert.match(formatTidewalkWorldPulse(pulse), /watchful/);
}

{
  const pulse = getTidewalkWorldPulse(createState({ x: 1570, y: 860 }));
  assert.equal(pulse.mood, "threatening");
  assert.equal(pulse.tideColor, "black-red");
  assert.equal(pulse.hazardPosture, "surging");
  assert.equal(pulse.routePressure, "truth-race");
}

{
  const pulse = getTidewalkWorldPulse(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(pulse.complete, true);
  assert.equal(pulse.mood, "hunted");
  assert.equal(pulse.routePressure, "truth-race");
}

{
  const pulse = getTidewalkWorldPulse(createState({ scene: "archive" }));
  assert.equal(pulse.active, false);
  assert.equal(formatTidewalkWorldPulse(pulse), "Tidewalk is quiet.");
}

console.log("tidewalk world pulse tests passed");
