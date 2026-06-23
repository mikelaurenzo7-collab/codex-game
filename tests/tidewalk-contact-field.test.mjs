import assert from "node:assert/strict";
import {
  getTidewalkContactField,
  resolveTidewalkContactAtPlayer
} from "../src/tidewalk-contact-field.js";

function createState({ scene = "tidewalk", x = 1580, y = 260 } = {}) {
  return {
    scene,
    time: 12,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId: null
    }
  };
}

{
  const field = getTidewalkContactField(createState());
  assert.equal(field.active, true);
  assert.equal(field.complete, false);
  assert.equal(field.contacts.length, 2);
  assert.equal(field.actionableContact.id, "lantern-tender");
  assert.equal(field.closestContact.id, "lantern-tender");
  assert.equal(field.actionableContact.inRange, true);
}

{
  const field = getTidewalkContactField(createState({ scene: "archive" }));
  assert.equal(field.active, false);
  assert.equal(field.actionableContact, null);
  assert.equal(resolveTidewalkContactAtPlayer(createState({ scene: "archive" })), null);
}

{
  const state = createState({ x: 50, y: 50 });
  const field = getTidewalkContactField(state);
  assert.equal(field.active, true);
  assert.equal(field.actionableContact, null);
  assert.equal(resolveTidewalkContactAtPlayer(state), null);
  assert.equal(state.frontier.selectedRouteChoiceId, null);
}

{
  const state = createState({ x: 1570, y: 860 });
  const contact = resolveTidewalkContactAtPlayer(state);
  assert.equal(contact.id, "black-keel-scout");
  assert.equal(state.frontier.selectedRouteChoiceId, "black-keel-countermark");
  assert.equal(getTidewalkContactField(state).complete, true);
}

console.log("tidewalk contact field tests passed");
