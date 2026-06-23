import assert from "node:assert/strict";
import {
  createGameState,
  getBrinehookAftermath,
  getBrinehookPierExit,
  getTidewalkExpedition,
  updateGameState
} from "../src/game-state.js";

const LAUNCH_GATE = { x: 140, y: 1012 };
const LANTERN_TARGET = { x: 1600, y: 540 };
const KEEL_SENTINEL = { x: 1300, y: 540 };

function readyForExpedition(choiceId) {
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
  state.player.x = LAUNCH_GATE.x;
  state.player.y = LAUNCH_GATE.y;
  state.scene = "tidewalk";
  return state;
}

function launchExpedition(state) {
  for (let elapsed = 0; elapsed < 2.2; elapsed += 0.05) {
    updateGameState(state, { analyze: true }, 0.05);
  }
}

function completeLanternResolution(state) {
  const exp = state.frontier.tidewalkExpedition;
  const cargo = exp.cargoItems.find((c) => c.id === "cargo-sextant");
  assert.ok(cargo, "cargo-sextant must exist");
  cargo.revealed = true;
  cargo.collected = true;
  state.player.x = LANTERN_TARGET.x;
  state.player.y = LANTERN_TARGET.y;
}

function completeKeelResolution(state) {
  const exp = state.frontier.tidewalkExpedition;
  for (const id of ["cargo-sextant", "cargo-logbook"]) {
    const cargo = exp.cargoItems.find((c) => c.id === id);
    assert.ok(cargo, `${id} must exist`);
    cargo.revealed = true;
    cargo.collected = true;
  }
  exp.sentinel.stunUntil = state.time + 10;
  state.player.x = LAUNCH_GATE.x;
  state.player.y = LAUNCH_GATE.y;
}

{
  const state = createGameState();
  const aftermath = getBrinehookAftermath(state);
  assert.equal(aftermath.active, false, "no aftermath before pier crossing");
}

{
  const state = createGameState();
  const pierExit = getBrinehookPierExit(state);
  assert.equal(pierExit.active, false, "pier exit inactive in archive scene");
}

{
  const state = readyForExpedition("quay-safe-lantern-line");
  launchExpedition(state);
  const exp = getTidewalkExpedition(state);
  assert.equal(exp.phase, "field", "expedition in field phase");

  const pierExitMid = getBrinehookPierExit(state);
  assert.equal(pierExitMid.active, false, "pier exit inactive before resolution");

  completeLanternResolution(state);
  updateGameState(state, {}, 0.05);

  state.player.x = LAUNCH_GATE.x;
  state.player.y = LAUNCH_GATE.y;
  const pierExit = getBrinehookPierExit(state);
  assert.equal(pierExit.active, true, "pier exit active after lantern resolution");
  assert.equal(pierExit.inRange, true, "player in range at launch gate");
}

{
  const state = readyForExpedition("quay-safe-lantern-line");
  launchExpedition(state);
  completeLanternResolution(state);
  updateGameState(state, {}, 0.05);

  state.player.x = LAUNCH_GATE.x;
  state.player.y = LAUNCH_GATE.y;

  for (let elapsed = 0; elapsed < 2.0; elapsed += 0.05) {
    updateGameState(state, { analyze: true }, 0.05);
  }

  assert.equal(state.scene, "archive", "player returned to archive after pier exit");
  assert.ok(state.frontier.brinehookAftermath, "aftermath recorded");
  assert.equal(state.frontier.brinehookAftermath.outcome, "witness-secured");
  assert.equal(state.frontier.brinehookAftermath.branch, "quay-safe-lantern-line");
  assert.ok(state.frontier.brinehookAftermath.recoveredCargo >= 1);

  const aftermath = getBrinehookAftermath(state);
  assert.equal(aftermath.active, true);
  assert.equal(aftermath.outcome, "witness-secured");
  assert.equal(aftermath.factionPressure, 1);
  assert.equal(aftermath.settlementTrust, 5);
  assert.match(aftermath.resourceText, /lantern tender/);
  assert.match(aftermath.nextHook, /quay can vouch/);
}

{
  const state = readyForExpedition("black-keel-countermark");
  launchExpedition(state);
  completeKeelResolution(state);
  updateGameState(state, {}, 0.05);

  const pierExit = getBrinehookPierExit(state);
  assert.equal(pierExit.active, true, "pier exit active after black-keel resolution");

  for (let elapsed = 0; elapsed < 2.0; elapsed += 0.05) {
    updateGameState(state, { analyze: true }, 0.05);
  }

  assert.equal(state.scene, "archive", "player returned to archive");
  const aftermath = getBrinehookAftermath(state);
  assert.equal(aftermath.active, true);
  assert.equal(aftermath.outcome, "escaped-with-cargo");
  assert.equal(aftermath.factionPressure, 5);
  assert.equal(aftermath.settlementTrust, 2);
  assert.match(aftermath.resourceText, /Black-Keel/);
  assert.match(aftermath.nextHook, /captain/);
}

{
  const state = readyForExpedition("quay-safe-lantern-line");
  launchExpedition(state);
  completeLanternResolution(state);
  updateGameState(state, {}, 0.05);

  state.player.x = LAUNCH_GATE.x;
  state.player.y = LAUNCH_GATE.y;
  for (let elapsed = 0; elapsed < 2.0; elapsed += 0.05) {
    updateGameState(state, { analyze: true }, 0.05);
  }

  assert.equal(state.scene, "archive");
  const pierExitAgain = getBrinehookPierExit(state);
  assert.equal(pierExitAgain.active, false, "pier exit sealed after return");
}

console.log("brinehook aftermath tests passed");
