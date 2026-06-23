import assert from "node:assert/strict";
import {
  createGameCheckpoint,
  createGameState,
  getTidewalkExpedition,
  triggerPulse,
  updateGameState
} from "../src/game-state.js";
import { getBrinehookEncounterState } from "../src/brinehook-encounter.js";

function readyForBrinehook(choiceId) {
  const state = createGameState();
  state.frontier.traversedRouteIds = ["intake-coastline-lift"];
  state.frontier.resolvedEncounterIds = ["tidewalk-docking-rights"];
  state.frontier.surveyedSiteIds = ["north-spool-house", "lamp-black-warehouse"];
  state.frontier.discoveredCoastalClueIds = ["warehouse-ledger", "black-keel-mark"];
  state.frontier.selectedRouteChoiceId = choiceId;
  state.frontier.lastRouteChoice = { routeId: "intake-coastline-lift", choiceId, label: choiceId, chosenAt: 0 };
  state.frontier.resolvedCoastalOperationIds = [
    choiceId === "black-keel-countermark" ? "black-keel-cache-scout" : "lantern-line-witness-sync"
  ];
  state.player.x = 140;
  state.player.y = 1012;
  return state;
}

function holdAction(state, seconds = 2.2) {
  for (let elapsed = 0; elapsed < seconds; elapsed += 0.05) {
    updateGameState(state, { analyze: true }, 0.05);
  }
}

{
  const state = readyForBrinehook("black-keel-countermark");
  holdAction(state);

  const expedition = getTidewalkExpedition(state);
  assert.equal(state.scene, "tidewalk");
  assert.equal(expedition.phase, "field");
  assert.ok(state.frontier.tidewalkExpedition.sentinel, "Black-Keel branch should spawn a hunting sentinel");
  assert.equal(state.frontier.tidewalkExpedition.cargoItems.length, 3);

  const encounter = getBrinehookEncounterState(state);
  assert.equal(encounter.active, true);
  assert.equal(encounter.branch, "black-keel-countermark");
  assert.equal(encounter.threat.pressure, "hunting");
  assert.match(encounter.bottomLogText, /sentinel hunting/);
}

{
  const state = readyForBrinehook("quay-safe-lantern-line");
  holdAction(state);

  const encounter = getBrinehookEncounterState(state);
  assert.equal(encounter.active, true);
  assert.equal(encounter.threat, null);
  assert.equal(encounter.supportZone.active, true);
  assert.match(encounter.bottomLogText, /haven/);
}

{
  const state = readyForBrinehook("black-keel-countermark");
  holdAction(state);
  state.player.x = 900;
  state.player.y = 800;
  state.time = 3;
  state.signal = 100;

  assert.equal(triggerPulse(state), true);
  const revealed = state.frontier.tidewalkExpedition.cargoItems.filter((item) => item.revealed);
  assert.ok(revealed.some((item) => item.id === "cargo-sextant"), "Pulse should reveal nearby salvage cargo");

  updateGameState(state, {}, 0.05);
  assert.ok(state.frontier.cargo.includes("Tarnished Sextant"), "Walking onto revealed cargo should recover it");
  assert.ok(state.signal > 75, "Recovered cargo should partially offset the pulse cost");

  const encounter = getBrinehookEncounterState(state);
  assert.equal(encounter.recoveredCargo, 1);
  assert.equal(encounter.cargoRecovered.includes("Tarnished Sextant"), true);
}

{
  const state = readyForBrinehook("black-keel-countermark");
  holdAction(state);
  state.player.x = 1302;
  state.player.y = 540;
  state.signal = 10;

  updateGameState(state, {}, 0.3);
  assert.ok(state.signal < 10, "Unstunned sentinel contact should drain signal");

  const checkpoint = createGameCheckpoint(state);
  assert.match(checkpoint, /tidewalkExpedition/, "Launched Brinehook encounter should remain checkpoint-safe");
}

console.log("brinehook encounter tests passed");
