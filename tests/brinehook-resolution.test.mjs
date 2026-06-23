import assert from "node:assert/strict";
import {
  createGameState,
  getTidewalkExpedition,
  triggerPulse,
  updateGameState
} from "../src/game-state.js";
import {
  formatBrinehookResolution,
  getBrinehookResolutionClientState,
  getBrinehookResolutionState
} from "../src/brinehook-resolution.js";

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

function recoverCargo(state, cargoId) {
  const cargo = state.frontier.tidewalkExpedition.cargoItems.find((item) => item.id === cargoId);
  assert.ok(cargo, `missing cargo ${cargoId}`);
  cargo.revealed = true;
  state.player.x = cargo.x;
  state.player.y = cargo.y;
  updateGameState(state, {}, 0.05);
}

{
  const state = createGameState();
  const resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.active, false);
  assert.equal(resolution.status, "dormant");
  assert.match(formatBrinehookResolution(state), /No pier decision/);

  const client = getBrinehookResolutionClientState(state);
  assert.equal(client.active, false);
  assert.equal(client.status, "dormant");
  assert.equal(client.tone, "muted");
  assert.equal(client.marker, null);
}

{
  const state = readyForBrinehook("black-keel-countermark");
  holdAction(state);
  const expedition = getTidewalkExpedition(state);
  assert.equal(expedition.phase, "field");

  let resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "hunted");
  assert.equal(resolution.complete, false);

  let client = getBrinehookResolutionClientState(state);
  assert.equal(client.status, "hunted");
  assert.equal(client.tone, "danger");
  assert.match(client.hudText, /Recover 2 cargo/);
  assert.equal(client.marker.kind, "cargo-search");

  recoverCargo(state, "cargo-sextant");
  recoverCargo(state, "cargo-bell");
  resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "cargo-under-hunt");
  assert.equal(resolution.complete, false);

  client = getBrinehookResolutionClientState(state);
  assert.equal(client.status, "cargo-under-hunt");
  assert.equal(client.tone, "warning");
  assert.equal(client.marker.kind, "sentinel");
  assert.match(client.primerText, /sentinel still owns/);

  state.player.x = state.frontier.tidewalkExpedition.sentinel.x;
  state.player.y = state.frontier.tidewalkExpedition.sentinel.y;
  state.signal = 100;
  assert.equal(triggerPulse(state), true);
  resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "escaped-with-cargo");
  assert.equal(resolution.complete, true);

  client = getBrinehookResolutionClientState(state);
  assert.equal(client.complete, true);
  assert.equal(client.tone, "success");
  assert.match(client.bottomLogText, /escapes with enough salvage evidence/);
}

{
  const state = readyForBrinehook("quay-safe-lantern-line");
  holdAction(state);

  let resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "safe-line-ahead");
  assert.equal(resolution.complete, false);

  let client = getBrinehookResolutionClientState(state);
  assert.equal(client.status, "safe-line-ahead");
  assert.equal(client.tone, "safe");
  assert.equal(client.marker.kind, "haven");
  assert.match(client.hudText, /lantern haven/);

  const expedition = getTidewalkExpedition(state);
  state.player.x = expedition.leadTarget.x;
  state.player.y = expedition.leadTarget.y;
  resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "haven-holding");

  client = getBrinehookResolutionClientState(state);
  assert.equal(client.status, "haven-holding");
  assert.equal(client.marker.kind, "cargo-search");
  assert.match(client.statusText, /Lantern haven/);

  recoverCargo(state, "cargo-sextant");
  state.player.x = expedition.leadTarget.x;
  state.player.y = expedition.leadTarget.y;
  resolution = getBrinehookResolutionState(state);
  assert.equal(resolution.status, "witness-secured");
  assert.equal(resolution.complete, true);

  client = getBrinehookResolutionClientState(state);
  assert.equal(client.complete, true);
  assert.equal(client.tone, "success");
  assert.match(client.primerText, /quay can vouch/);
}

console.log("brinehook resolution tests passed");
