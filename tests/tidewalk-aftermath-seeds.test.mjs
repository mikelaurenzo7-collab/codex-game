import assert from "node:assert/strict";
import { formatTidewalkAftermathSeed, getTidewalkAftermathSeeds } from "../src/tidewalk-aftermath-seeds.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 100,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const deck = getTidewalkAftermathSeeds(createState());
  assert.equal(deck.active, true);
  assert.equal(deck.complete, false);
  assert.equal(deck.contactId, "lantern-tender");
  assert.equal(deck.primarySeed.armed, false);
  assert.match(formatTidewalkAftermathSeed(deck), /Foreshadowed/);
}

{
  const deck = getTidewalkAftermathSeeds(createState({ selectedRouteChoiceId: "quay-safe-lantern-line" }));
  assert.equal(deck.complete, true);
  assert.equal(deck.primarySeed.id, "quay-witness-choir");
  assert.equal(deck.primarySeed.armed, true);
  assert.match(deck.primarySeed.unlock, /trust-led/);
}

{
  const deck = getTidewalkAftermathSeeds(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(deck.complete, true);
  assert.equal(deck.contactId, "black-keel-scout");
  assert.equal(deck.primarySeed.id, "salvage-net-wakes");
  assert.match(formatTidewalkAftermathSeed(deck), /Armed/);
}

{
  const deck = getTidewalkAftermathSeeds(createState({ scene: "archive" }));
  assert.equal(deck.active, false);
  assert.equal(formatTidewalkAftermathSeed(deck), "No Tidewalk aftermath armed.");
}

console.log("tidewalk aftermath seed tests passed");
