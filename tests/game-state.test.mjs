import assert from "node:assert/strict";
import {
  WORLD,
  canPulse,
  collectedFragmentCount,
  createGameState,
  distance,
  getActiveObjective,
  getEvidenceJournal,
  getEvidenceSynthesis,
  getFieldAnalysis,
  getFrontierNetwork,
  getFrontierTraverse,
  getWorldAtlas,
  triggerPulse,
  updateGameState
} from "../src/game-state.js";

function tick(state, seconds, input = {}) {
  const step = 1 / 60;
  let elapsed = 0;
  while (elapsed < seconds) {
    updateGameState(state, input, Math.min(step, seconds - elapsed));
    elapsed += step;
  }
}

function moveTo(state, waypoint, label, maxSeconds = 12) {
  const step = 1 / 60;
  let elapsed = 0;

  while (elapsed < maxSeconds && distance(state.player, waypoint) > 20 && state.status === "running") {
    const dx = waypoint.x - state.player.x;
    const dy = waypoint.y - state.player.y;
    updateGameState(
      state,
      {
        left: dx < -8,
        right: dx > 8,
        up: dy < -8,
        down: dy > 8
      },
      step
    );
    elapsed += step;
  }

  assert.notEqual(state.status, "failed", `route should survive ${label}`);
  if (state.status === "running") {
    assert.ok(distance(state.player, waypoint) <= 24, `route should reach ${label}`);
  }
}

function collectFragmentAt(state, fragmentId) {
  const fragment = state.fragments.find((candidate) => candidate.id === fragmentId);
  assert.ok(fragment, `expected fragment ${fragmentId}`);
  assert.equal(canPulse(state), true, `pulse should be available near ${fragmentId}`);
  assert.equal(triggerPulse(state), true);
  tick(state, 0.2);
  assert.equal(fragment.collected, true, `${fragmentId} should be collected`);
}

function analyzeDeducedFragmentAt(state, fragmentId) {
  const fragment = state.fragments.find((candidate) => candidate.id === fragmentId);
  assert.ok(fragment, `expected fragment ${fragmentId}`);

  const analysis = getFieldAnalysis(state);
  assert.equal(analysis.active, true, "deduced fragment should require field analysis");
  assert.equal(analysis.target.id, fragmentId);
  assert.equal(analysis.inRange, true, `player should be close enough to analyze ${fragmentId}`);

  tick(state, WORLD.fieldAnalysisSeconds + 0.12, { analyze: true });
  assert.equal(fragment.analysisResolved, true, `${fragmentId} analysis should resolve`);
  assert.equal(fragment.collected, true, `${fragmentId} should be collected after analysis`);
}

{
  const state = createGameState();
  assert.equal(state.status, "running");
  assert.equal(state.fragments.length, 3);
  assert.equal(collectedFragmentCount(state), 0);
  assert.equal(state.gate.unlocked, false);
  assert.equal(canPulse(state), true);

  const journal = getEvidenceJournal(state);
  assert.equal(journal.length, 3);
  assert.equal(journal[0].title, "Hull Chorus");
  assert.equal(journal.every((entry) => !entry.collected), true);

  const synthesis = getEvidenceSynthesis(state);
  assert.equal(synthesis.phase, "unresolved");
  assert.equal(synthesis.target, null);

  const analysis = getFieldAnalysis(state);
  assert.equal(analysis.active, false);

  const traverse = getFrontierTraverse(state);
  assert.equal(traverse.active, false);

  const atlas = getWorldAtlas(state);
  assert.equal(atlas.currentRegion.name, "South Intake");
  assert.equal(atlas.discoveredRegionCount, 1);
  assert.equal(atlas.totalRegionCount, 5);
  assert.equal(atlas.discoveredLandmarkCount, 1);
  assert.equal(atlas.landmarks.find((landmark) => landmark.id === "salvager-camp").discovered, true);

  const frontier = getFrontierNetwork(state);
  assert.equal(frontier.currentRegion.name, "South Intake");
  assert.equal(frontier.visibleRouteCount, 3);
  assert.equal(frontier.chartedRouteCount, 2);
  assert.equal(frontier.launchedRouteCount, 0);
  assert.equal(frontier.routes.find((route) => route.id === "intake-coastline-lift").charted, true);
  assert.equal(frontier.routes.find((route) => route.id === "intake-coastline-lift").traversed, false);
  assert.equal(frontier.routes.find((route) => route.id === "intake-sluice-causeway").charted, false);
}

{
  const state = createGameState();
  state.player.x = 1510;
  state.player.y = 900;
  tick(state, 0.1);

  const atlas = getWorldAtlas(state);
  assert.equal(atlas.currentRegion.name, "Relay Fen");
  assert.equal(atlas.regions.find((region) => region.id === "relay-fen").visited, true);
  assert.equal(atlas.landmarks.find((landmark) => landmark.id === "east-relay-basin").discovered, true);

  const frontier = getFrontierNetwork(state);
  assert.equal(frontier.currentRegion.name, "Relay Fen");
  assert.equal(frontier.visibleRouteCount, 6);
  assert.equal(frontier.routes.find((route) => route.id === "fen-deep-green-verge").destinationName, "Deep Green Verge");
  assert.equal(frontier.routes.find((route) => route.id === "fen-deep-green-verge").charted, true);
}

{
  const state = createGameState();
  state.player.x = 140;
  state.player.y = 1012;
  tick(state, 0.1);

  const traverse = getFrontierTraverse(state);
  assert.equal(traverse.active, true);
  assert.equal(traverse.route.id, "intake-coastline-lift");
  assert.equal(traverse.inRange, true);
  assert.equal(traverse.complete, false);

  tick(state, WORLD.frontierTraverseSeconds + 0.12, { analyze: true });

  const resolvedTraverse = getFrontierTraverse(state);
  assert.equal(resolvedTraverse.active, true);
  assert.equal(resolvedTraverse.complete, true);
  assert.equal(state.frontier.lastTraverse.routeId, "intake-coastline-lift");
  assert.equal(state.frontier.lastTraverse.destinationName, "Tidewalk Coast");
  assert.match(state.clueLog.at(-1), /Tidewalk Coast/);

  const frontier = getFrontierNetwork(state);
  assert.equal(frontier.launchedRouteCount, 1);
  assert.equal(frontier.routes.find((route) => route.id === "intake-coastline-lift").traversed, true);
}

{
  const state = createGameState();
  const objective = getActiveObjective(state);
  assert.equal(objective.kind, "hidden-fragment");
  assert.equal(objective.label, "Trace memory signal");
  assert.deepEqual(objective.target, { x: 520, y: 190 });
}

{
  const state = createGameState();
  state.fragments.find((fragment) => fragment.id === "chorus").collected = true;

  const synthesis = getEvidenceSynthesis(state);
  assert.equal(synthesis.phase, "cross-check");
  assert.equal(synthesis.title, "Unpaired Evidence");

  const objective = getActiveObjective(state);
  assert.equal(objective.kind, "hidden-fragment");
  assert.equal(objective.label, "Cross-check evidence");
}

{
  const state = createGameState();
  state.player.x = state.fragments[0].x - WORLD.pulseRadius + 12;
  state.player.y = state.fragments[0].y;
  const signalBefore = state.signal;

  assert.equal(triggerPulse(state), true);
  assert.ok(state.fragments[0].revealedUntil > state.time);
  assert.ok(state.signal < signalBefore);
  assert.equal(triggerPulse(state), false, "pulse cooldown should prevent immediate spam");
}

{
  const state = createGameState();
  state.fragments[2].revealedUntil = state.time + 1;
  const objective = getActiveObjective(state);
  assert.equal(objective.kind, "exposed-fragment");
  assert.equal(objective.label, "Recover exposed memory");
  assert.deepEqual(objective.target, { x: 1640, y: 420 });
}

{
  const state = createGameState();
  const fragment = state.fragments[1];
  state.player.x = fragment.x;
  state.player.y = fragment.y;
  assert.equal(triggerPulse(state), true);
  tick(state, 0.1);
  assert.equal(fragment.collected, true);
  assert.equal(collectedFragmentCount(state), 1);
  assert.equal(state.clueLog.length, 1);

  const journal = getEvidenceJournal(state);
  const entry = journal.find((candidate) => candidate.id === fragment.id);
  assert.equal(entry.collected, true);
  assert.equal(entry.clue, fragment.clue);
  assert.equal(typeof entry.collectedAt, "number");
  assert.deepEqual(entry.location, { x: fragment.x, y: fragment.y });
}

{
  const state = createGameState();
  state.fragments.find((fragment) => fragment.id === "chorus").collected = true;
  state.fragments.find((fragment) => fragment.id === "cartographer").collected = true;

  const synthesis = getEvidenceSynthesis(state);
  assert.equal(synthesis.phase, "deduced");
  assert.equal(synthesis.title, "Eastern Knell");
  assert.deepEqual(synthesis.target, { id: "bell", x: 1640, y: 420 });

  const objective = getActiveObjective(state);
  assert.equal(objective.kind, "deduced-fragment");
  assert.equal(objective.label, "Analyze deduction");
  assert.deepEqual(objective.target, { x: 1640, y: 420 });

  const analysis = getFieldAnalysis(state);
  assert.equal(analysis.active, true);
  assert.equal(analysis.complete, false);
  assert.equal(analysis.target.id, "bell");
}

{
  const state = createGameState();
  state.fragments.find((fragment) => fragment.id === "chorus").collected = true;
  state.fragments.find((fragment) => fragment.id === "cartographer").collected = true;
  const bell = state.fragments.find((fragment) => fragment.id === "bell");
  state.player.x = bell.x;
  state.player.y = bell.y;

  assert.equal(triggerPulse(state), true);
  tick(state, 0.2);
  assert.equal(bell.revealedUntil, 0, "deduced target should not reveal from pulse before analysis");
  assert.equal(bell.collected, false);

  const analysisBefore = getFieldAnalysis(state);
  assert.equal(analysisBefore.inRange, true);
  tick(state, WORLD.fieldAnalysisSeconds + 0.12, { analyze: true });
  assert.equal(bell.analysisResolved, true);
  assert.equal(bell.collected, true);
  assert.equal(getActiveObjective(state).kind, "gate");
}

{
  const state = createGameState();
  for (const fragment of state.fragments) {
    fragment.collected = true;
  }

  tick(state, 0.1);
  assert.equal(state.gate.unlocked, true);
  assert.equal(getEvidenceSynthesis(state).phase, "complete");

  state.player.x = state.gate.x;
  state.player.y = state.gate.y;
  tick(state, 0.1);
  assert.equal(state.status, "complete");
}

{
  const state = createGameState();
  const route = [
    [{ x: 260, y: 880 }, "lower archive bend"],
    [{ x: 430, y: 880 }, "wall bypass"],
    [{ x: 430, y: 190 }, "chorus approach"],
    [{ x: 520, y: 190 }, "chorus"],
    [{ x: 520, y: 560 }, "central lower channel"],
    [{ x: 1080, y: 560 }, "cartographer approach"],
    [{ x: 1080, y: 760 }, "cartographer"],
    [{ x: 1180, y: 760 }, "east wall approach"],
    [{ x: 1180, y: 260 }, "upper east bypass"],
    [{ x: 1640, y: 260 }, "bell approach"],
    [{ x: 1640, y: 420 }, "bell"],
    [{ x: 1640, y: 260 }, "gate return"],
    [{ x: 1770, y: 170 }, "extraction gate"]
  ];

  for (const [waypoint, label] of route.slice(0, 4)) {
    moveTo(state, waypoint, label);
  }
  collectFragmentAt(state, "chorus");

  for (const [waypoint, label] of route.slice(4, 7)) {
    moveTo(state, waypoint, label);
  }
  collectFragmentAt(state, "cartographer");

  for (const [waypoint, label] of route.slice(7, 11)) {
    moveTo(state, waypoint, label);
  }
  analyzeDeducedFragmentAt(state, "bell");

  assert.equal(getActiveObjective(state).kind, "gate");

  for (const [waypoint, label] of route.slice(11)) {
    moveTo(state, waypoint, label);
  }

  tick(state, 0.2);
  assert.equal(state.status, "complete");
  assert.equal(state.result, "Archive thread recovered");

  const atlas = getWorldAtlas(state);
  assert.ok(atlas.discoveredRegionCount >= 4, "route should survey most archive regions");
  assert.equal(atlas.landmarks.find((landmark) => landmark.id === "dead-bell-spire").discovered, true);
  assert.equal(atlas.landmarks.find((landmark) => landmark.id === "extraction-cairn").discovered, true);

  const frontier = getFrontierNetwork(state);
  assert.equal(frontier.visibleRouteCount, 7);
  assert.ok(frontier.chartedRouteCount >= 7, "full archive survey should chart every route it actually surveys");
  assert.equal(frontier.routes.find((route) => route.id === "bell-cairn-marches").charted, true);
}

{
  const state = createGameState();
  const echo = state.echoes[0];
  state.player.x = echo.x;
  state.player.y = echo.y;
  tick(state, 0.5);
  assert.ok(state.signal < 100, "echo contact should drain signal");
}

console.log("game-state tests passed");
