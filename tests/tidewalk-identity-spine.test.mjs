import assert from "node:assert/strict";
import { formatTidewalkIdentitySpine, getTidewalkIdentitySpine } from "../src/tidewalk-identity-spine.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 120,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const spine = getTidewalkIdentitySpine(createState());
  assert.equal(spine.active, true);
  assert.equal(spine.identityName, "Lantern-Watched Coast");
  assert.equal(spine.palette, "lantern-gold");
  assert.match(spine.bottomLogText, /Faction debts previewed/);
  assert.match(formatTidewalkIdentitySpine(spine), /Lantern-Watched Coast/);
}

{
  const spine = getTidewalkIdentitySpine(createState({ x: 1570, y: 860 }));
  assert.equal(spine.identityName, "Countermarked Coast");
  assert.equal(spine.palette, "black-red");
  assert.equal(spine.routePressure, "truth-race");
}

{
  const spine = getTidewalkIdentitySpine(createState({ selectedRouteChoiceId: "quay-safe-lantern-line" }));
  assert.equal(spine.complete, true);
  assert.equal(spine.identityName, "Witness-Bound Archive");
  assert.equal(spine.primaryAftermath.id, "quay-witness-choir");
}

{
  const spine = getTidewalkIdentitySpine(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(spine.complete, true);
  assert.equal(spine.identityName, "Hunted Archive");
  assert.equal(spine.primaryAftermath.id, "salvage-net-wakes");
}

{
  const spine = getTidewalkIdentitySpine(createState({ scene: "archive" }));
  assert.equal(spine.active, false);
  assert.equal(formatTidewalkIdentitySpine(spine), "Tidewalk identity dormant.");
}

console.log("tidewalk identity spine tests passed");
