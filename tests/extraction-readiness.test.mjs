import assert from "node:assert/strict";
import {
  createGameState,
  getExtractionReadiness,
  updateGameState
} from "../src/game-state.js";

function collectAllFragments(state) {
  for (const fragment of state.fragments) {
    fragment.collected = true;
    fragment.collectedAt = state.time;
  }
}

function fireResonance(state) {
  state.resonanceBroadcast = true;
}

function recordAftermath(state, outcome = "witness-secured") {
  state.frontier.brinehookAftermath = {
    branch: outcome === "escaped-with-cargo" ? "black-keel-countermark" : "quay-safe-lantern-line",
    outcome,
    recoveredCargo: 2,
    resolvedAt: state.time
  };
}

{
  const state = createGameState();
  const r = getExtractionReadiness(state);
  assert.equal(r.fragmentsComplete, false);
  assert.equal(r.coastalClosed, false);
  assert.equal(r.resonanceFired, false);
  assert.equal(r.score, 0);
  assert.equal(r.fullThread, false);
  assert.equal(r.resultText, null, "no resultText before fragments");
  assert.equal(r.title, "Incomplete Thread");
}

{
  const state = createGameState();
  collectAllFragments(state);
  const r = getExtractionReadiness(state);
  assert.equal(r.fragmentsComplete, true);
  assert.equal(r.coastalClosed, false);
  assert.equal(r.resonanceFired, false);
  assert.equal(r.score, 1);
  assert.equal(r.fullThread, false);
  assert.equal(r.title, "Archive Thread");
  assert.equal(r.resultText, "Archive thread recovered");
}

{
  const state = createGameState();
  collectAllFragments(state);
  recordAftermath(state, "witness-secured");
  const r = getExtractionReadiness(state);
  assert.equal(r.score, 2);
  assert.equal(r.title, "Certified Thread");
  assert.match(r.resultText, /lantern witness/);
  assert.equal(r.coastalOutcome, "witness-secured");
}

{
  const state = createGameState();
  collectAllFragments(state);
  recordAftermath(state, "escaped-with-cargo");
  const r = getExtractionReadiness(state);
  assert.match(r.resultText, /Black-Keel cache/);
  assert.equal(r.coastalOutcome, "escaped-with-cargo");
}

{
  const state = createGameState();
  collectAllFragments(state);
  fireResonance(state);
  const r = getExtractionReadiness(state);
  assert.equal(r.score, 2);
  assert.equal(r.title, "Broadcast Thread");
  assert.match(r.resultText, /coastal record incomplete/);
}

{
  const state = createGameState();
  collectAllFragments(state);
  recordAftermath(state);
  fireResonance(state);
  const r = getExtractionReadiness(state);
  assert.equal(r.score, 3);
  assert.equal(r.fullThread, true);
  assert.equal(r.title, "Complete Thread");
  assert.match(r.resultText, /Complete thread recovered/);
  assert.match(r.resultText, /lantern witness/);
}

{
  const state = createGameState();
  collectAllFragments(state);
  recordAftermath(state, "escaped-with-cargo");
  fireResonance(state);
  const r = getExtractionReadiness(state);
  assert.equal(r.fullThread, true);
  assert.match(r.resultText, /Black-Keel cache certified/);
}

{
  const state = createGameState();
  collectAllFragments(state);

  state.player.x = state.gate.x;
  state.player.y = state.gate.y;
  updateGameState(state, {}, 0.05);

  assert.equal(state.status, "complete");
  assert.equal(state.result, "Archive thread recovered", "base extraction result");
}

{
  const state = createGameState();
  collectAllFragments(state);
  recordAftermath(state);
  fireResonance(state);

  state.player.x = state.gate.x;
  state.player.y = state.gate.y;
  updateGameState(state, {}, 0.05);

  assert.equal(state.status, "complete");
  assert.match(state.result, /Complete thread recovered/);
}

console.log("extraction readiness tests passed");
