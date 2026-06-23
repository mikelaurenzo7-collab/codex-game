import assert from "node:assert/strict";
import {
  GAME_SAVE_VERSION,
  WORLD,
  canPulse,
  createGameCheckpoint,
  collectedFragmentCount,
  createGameState,
  distance,
  getActiveObjective,
  getEvidenceJournal,
  getEvidenceSynthesis,
  getFieldAnalysis,
  getFrontierArrival,
  getFrontierCoastalOperation,
  getFrontierEncounter,
  getFrontierNetwork,
  getFrontierRouteChoice,
  getFrontierSurvey,
  getTidewalkSurveyField,
  getTidewalkExpedition,
  getFrontierTraverse,
  getWorldAtlas,
  getBlackKeelStorylet,
  chooseFrontierRoute,
  resolveFrontierEncounter,
  resolveFrontierSurveySite,
  restoreGameCheckpoint,
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

function unlockTidewalkRouteChoice(state) {
  state.player.x = 140;
  state.player.y = 1012;
  tick(state, 0.1);

  const traverse = getFrontierTraverse(state);
  assert.equal(traverse.active, true);
  if (!traverse.complete) {
    tick(state, WORLD.frontierTraverseSeconds + 0.12, { analyze: true });
  }

  const encounter = getFrontierEncounter(state);
  assert.equal(encounter.active, true);
  if (!encounter.resolved) {
    assert.equal(resolveFrontierEncounter(state, encounter.id), true);
  }

  const launch = getTidewalkSurveyField(state);
  assert.equal(launch.active, true);
  assert.equal(launch.phase, "launch");
  assert.equal(launch.inRange, true);

  tick(state, WORLD.tidewalkSurveySeconds + 0.12, { analyze: true });
  assert.equal(state.scene, "tidewalk");

  const field = getTidewalkSurveyField(state);
  assert.equal(field.phase, "field");
  assert.equal(field.nextSite.id, "north-spool-house");

  state.player.x = field.hazards[0].x;
  state.player.y = field.hazards[0].y;
  const signalBeforeHazard = state.signal;
  tick(state, 0.5);
  assert.ok(state.signal < signalBeforeHazard, "survey hazards should drain signal");

  assert.equal(triggerPulse(state), true);
  const signalAfterPulse = state.signal;
  assert.equal(getTidewalkSurveyField(state).tideStilled, true);
  tick(state, 0.5);
  assert.ok(state.signal >= signalAfterPulse, "pulse should suppress survey hazard drain");

  state.signal = 100;
  moveTo(state, { x: 200, y: 100 }, "survey north west walk", 8);
  moveTo(state, { x: 1100, y: 100 }, "survey north mid walk", 8);
  moveTo(state, { x: 1300, y: 100 }, "survey north east walk", 4);
  moveTo(state, field.nextSite.target, "north spool house", 6);
  tick(state, WORLD.tidewalkSurveySeconds + 0.12, { analyze: true });

  const midpointSurvey = getFrontierSurvey(state);
  assert.equal(midpointSurvey.completedCount, 1);
  assert.equal(midpointSurvey.complete, false);
  assert.equal(midpointSurvey.nextSite.id, "lamp-black-warehouse");
  assert.match(midpointSurvey.resourceTitle, /North Spool House/);
  assert.match(state.clueLog.at(-1), /upper racks/);
  assert.equal(state.scene, "tidewalk");

  const secondField = getTidewalkSurveyField(state);
  assert.equal(secondField.nextSite.id, "lamp-black-warehouse");
  moveTo(state, { x: 1760, y: 260 }, "survey east bypass", 4);
  moveTo(state, { x: 1760, y: 860 }, "survey south pier", 6);
  moveTo(state, secondField.nextSite.target, "lampblack storehouse", 6);
  tick(state, WORLD.tidewalkSurveySeconds + 0.12, { analyze: true });
  assert.equal(state.scene, "archive");

  const routeChoice = getFrontierRouteChoice(state);
  assert.equal(routeChoice.active, true);
  assert.equal(routeChoice.selectedChoice, null);
}

{
  const state = createGameState();
  state.player.x = 777;
  state.player.y = 612;
  state.signal = 43;
  state.atlas.discoveredLandmarkIds.push("relay-fen");
  state.frontier.tidewalkExpedition.launched = true;
  state.scene = "tidewalk";

  const checkpoint = createGameCheckpoint(state);
  const restored = restoreGameCheckpoint(checkpoint);
  assert.notEqual(restored, state, "checkpoint restore should create a new object graph");
  assert.deepEqual(restored, state, "checkpoint should preserve the complete deterministic state");
  restored.player.x = 900;
  assert.equal(state.player.x, 777, "restored state should not alias the live state");

  assert.throws(() => restoreGameCheckpoint("not-json"), /valid JSON/);
  assert.throws(
    () => restoreGameCheckpoint(JSON.stringify({ version: 999, state })),
    /version is not supported/
  );
  assert.throws(
    () => restoreGameCheckpoint(JSON.stringify({ version: GAME_SAVE_VERSION, state: { scene: "archive" } })),
    /state is invalid/
  );
  const damagedState = JSON.parse(JSON.stringify(state));
  delete damagedState.echoes[0].path;
  assert.throws(
    () => restoreGameCheckpoint(JSON.stringify({ version: GAME_SAVE_VERSION, state: damagedState })),
    /world data is invalid/
  );
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

  const arrival = getFrontierArrival(state);
  assert.equal(arrival.active, false);

  const encounter = getFrontierEncounter(state);
  assert.equal(encounter.active, false);
  assert.equal(encounter.resolved, false);

  const coastalOperation = getFrontierCoastalOperation(state);
  assert.equal(coastalOperation.active, false);

  const survey = getFrontierSurvey(state);
  assert.equal(survey.active, false);

  const routeChoice = getFrontierRouteChoice(state);
  assert.equal(routeChoice.active, false);

  const storylet = getBlackKeelStorylet(state);
  assert.equal(storylet.active, false);

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
  assert.equal(state.frontier.lastTraverse.arrivalTitle, "Raised Dock Hamlet");
  assert.match(state.clueLog.at(-1), /Raised Dock Hamlet/);

  const arrival = getFrontierArrival(state);
  assert.equal(arrival.active, true);
  assert.equal(arrival.routeId, "intake-coastline-lift");
  assert.equal(arrival.destinationName, "Tidewalk Coast");
  assert.equal(arrival.title, "Raised Dock Hamlet");
  assert.equal(arrival.settlementName, "Tidelantern Quay");
  assert.match(arrival.nextHook, /warehouses/i);

  const encounter = getFrontierEncounter(state);
  assert.equal(encounter.active, true);
  assert.equal(encounter.id, "tidewalk-docking-rights");
  assert.equal(encounter.resolved, false);
  assert.match(encounter.pendingNote, /Tidelantern Quay/);
  assert.equal(resolveFrontierEncounter(state, "wrong-encounter"), false);
  assert.equal(resolveFrontierEncounter(state, encounter.id), true);
  assert.equal(resolveFrontierEncounter(state, encounter.id), false);

  const resolvedEncounter = getFrontierEncounter(state);
  assert.equal(resolvedEncounter.resolved, true);
  assert.match(resolvedEncounter.note, /salvage traffic/);
  assert.equal(state.frontier.lastEncounter.id, "tidewalk-docking-rights");
  assert.match(state.clueLog.at(-1), /Dock Steward Compact/);

  const survey = getFrontierSurvey(state);
  assert.equal(survey.active, true);
  assert.equal(survey.complete, false);
  assert.equal(survey.completedCount, 0);
  assert.equal(survey.totalSiteCount, 2);
  assert.equal(survey.nextSite.id, "north-spool-house");
  assert.match(survey.resourceText, /hold E to descend/i);
  assert.equal(resolveFrontierSurveySite(state, "wrong-site"), false);

  const tidewalkSurvey = getTidewalkSurveyField(state);
  assert.equal(tidewalkSurvey.active, true);
  assert.equal(tidewalkSurvey.phase, "launch");
  assert.equal(tidewalkSurvey.title, "Descend to Tidewalk Coast");
  assert.equal(tidewalkSurvey.nextSite.id, "north-spool-house");

  unlockTidewalkRouteChoice(state);

  const completedSurvey = getFrontierSurvey(state);
  assert.equal(completedSurvey.complete, true);
  assert.equal(completedSurvey.hostileSalvageMarked, true);
  assert.equal(completedSurvey.nextSite, null);
  assert.deepEqual(new Set(completedSurvey.discoveredClueIds), new Set(["warehouse-ledger", "black-keel-mark"]));
  assert.match(completedSurvey.resourceTitle, /Hostile Salvage Mark/);
  assert.match(completedSurvey.nextHook, /intercept, bargain, or shadow/i);
  assert.match(state.clueLog.at(-1), /Hostile Salvage Mark/);

  const routeChoice = getFrontierRouteChoice(state);
  assert.equal(routeChoice.active, true);
  assert.equal(routeChoice.selectedChoice, null);
  assert.equal(routeChoice.choices.length, 2);
  assert.match(routeChoice.prompt, /Choose whether Tidewalk Coast stabilizes/i);
  assert.equal(chooseFrontierRoute(state, "wrong-choice"), false);
  assert.equal(chooseFrontierRoute(state, "black-keel-countermark"), true);
  assert.equal(chooseFrontierRoute(state, "quay-safe-lantern-line"), false);
  assert.match(state.clueLog.at(-1), /hostile salvage network/i);

  const selectedRouteChoice = getFrontierRouteChoice(state);
  assert.equal(selectedRouteChoice.selectedChoice.id, "black-keel-countermark");

  const coastalOperation = getFrontierCoastalOperation(state);
  assert.equal(coastalOperation.active, true);
  assert.equal(coastalOperation.complete, false);
  assert.equal(coastalOperation.gateTitle, "Coastline Lift");
  assert.match(coastalOperation.briefing, /hold the countermark line steady/i);

  const storylet = getBlackKeelStorylet(state);
  assert.equal(storylet.active, true);
  assert.equal(storylet.id, "countermark-pursuit");
  assert.equal(storylet.selectedChoice.id, "black-keel-countermark");
  assert.equal(storylet.knowsBlackKeel, true);
  assert.equal(storylet.factionPressure, 5);
  assert.equal(storylet.settlementTrust, 2);
  assert.match(storylet.nextHook, /ambush the cache crew|shadow them/i);
  assert.ok(storylet.unlockedFlags.includes("black-keel-cache"));

  const resolvedArrival = getFrontierArrival(state);
  assert.equal(resolvedArrival.encounterTitle, "Dock Steward Compact");
  assert.match(resolvedArrival.encounterText, /tide map/);
  assert.match(resolvedArrival.resourceTitle, /Field op: Scout the Black-Keel cache route/);
  assert.match(resolvedArrival.resourceText, /Return to the Coastline Lift/i);
  assert.match(resolvedArrival.nextHook, /hold E/i);

  state.player.x = 140;
  state.player.y = 1012;
  tick(state, 0.1);

  const inRangeOperation = getFrontierCoastalOperation(state);
  assert.equal(inRangeOperation.inRange, true);
  tick(state, WORLD.coastalOperationSeconds + 0.12, { analyze: true });

  const completedOperation = getFrontierCoastalOperation(state);
  assert.equal(completedOperation.complete, true);
  assert.equal(state.frontier.lastCoastalOperation.id, "black-keel-cache-scout");
  assert.match(state.clueLog.at(-1), /underpier cache/i);

  const postOperationArrival = getFrontierArrival(state);
  assert.match(postOperationArrival.resourceTitle, /Cache route scoped/);
  assert.match(postOperationArrival.resourceText, /Black-Keel underpier cache/i);
  assert.match(postOperationArrival.nextHook, /ambush the cache crew|shadow them/i);

  const expedition = getTidewalkExpedition(state);
  assert.equal(expedition.active, true);
  assert.equal(expedition.phase, "launch");
  assert.deepEqual(expedition.leadTarget, { x: 1700, y: 540 });

  const frontier = getFrontierNetwork(state);
  assert.equal(frontier.launchedRouteCount, 1);
  assert.equal(frontier.routes.find((route) => route.id === "intake-coastline-lift").traversed, true);
}

{
  const state = createGameState();
  unlockTidewalkRouteChoice(state);

  assert.equal(chooseFrontierRoute(state, "quay-safe-lantern-line"), true);

  const storylet = getBlackKeelStorylet(state);
  assert.equal(storylet.active, true);
  assert.equal(storylet.id, "lantern-line-afterglow");
  assert.equal(storylet.selectedChoice.id, "quay-safe-lantern-line");
  assert.equal(storylet.factionPressure, 2);
  assert.equal(storylet.settlementTrust, 4);

  const coastalOperation = getFrontierCoastalOperation(state);
  assert.equal(coastalOperation.active, true);
  assert.equal(coastalOperation.complete, false);
  assert.equal(coastalOperation.gateTitle, "South Relay Camp");
  assert.equal(coastalOperation.mapLabel, "Lantern witness");
  assert.deepEqual(coastalOperation.gate, { x: 260, y: 710 });

  const objective = getActiveObjective(state);
  assert.equal(objective.kind, "coastal-operation");
  assert.equal(objective.label, "Sync the lantern witness line");
  assert.deepEqual(objective.target, { x: 260, y: 710 });

  const arrival = getFrontierArrival(state);
  assert.match(arrival.resourceTitle, /Field op: Sync the lantern witness line/);
  assert.match(arrival.resourceText, /witness timing back across the lantern chain/i);
  assert.match(arrival.nextHook, /South Relay Camp/i);

  state.signal = 30;
  state.player.x = 260;
  state.player.y = 710;
  tick(state, 0.1);

  const inRangeOperation = getFrontierCoastalOperation(state);
  assert.equal(inRangeOperation.inRange, true);
  tick(state, WORLD.coastalOperationSeconds + 0.12, { analyze: true });

  const completedOperation = getFrontierCoastalOperation(state);
  assert.equal(completedOperation.complete, true);
  assert.equal(state.frontier.lastCoastalOperation.id, "lantern-line-witness-sync");
  assert.ok(state.signal > 30, "lantern line should pay back signal support");
  assert.match(state.clueLog.at(-1), /Brinehook piers/i);

  const resolvedArrival = getFrontierArrival(state);
  assert.match(resolvedArrival.resourceTitle, /Witness heading logged/);
  assert.match(resolvedArrival.resourceText, /battery crate/i);
  assert.match(resolvedArrival.nextHook, /Brinehook heading/i);

  state.signal = 100;
  state.player.x = 140;
  state.player.y = 1012;
  tick(state, 0.1);

  const launch = getTidewalkExpedition(state);
  assert.equal(launch.active, true);
  assert.equal(launch.phase, "launch");
  assert.equal(launch.inRange, true);
  assert.deepEqual(launch.leadTarget, { x: 1600, y: 540 });
  assert.equal(getActiveObjective(state).kind, "tidewalk-expedition");

  tick(state, WORLD.tidewalkExpeditionSeconds + 0.12, { analyze: true });
  assert.equal(state.scene, "tidewalk");

  const fieldLead = getTidewalkExpedition(state);
  assert.equal(fieldLead.phase, "field");
  assert.equal(fieldLead.title, "Meet the Brinehook lantern tender");
  assert.deepEqual(fieldLead.target, { x: 1600, y: 540 });

  state.player.x = fieldLead.hazards[0].x;
  state.player.y = fieldLead.hazards[0].y;
  const signalBeforeHazard = state.signal;
  tick(state, 0.5);
  assert.ok(state.signal < signalBeforeHazard, "black tide should drain signal");

  assert.equal(triggerPulse(state), true);
  const signalAfterPulse = state.signal;
  assert.equal(getTidewalkExpedition(state).tideStilled, true);
  tick(state, 0.5);
  assert.ok(state.signal >= signalAfterPulse, "pulse should suppress tide drain during its stun window");

  state.signal = 100;
  moveTo(state, { x: 170, y: 950 }, "low-piers south walk", 8);
  moveTo(state, { x: 1350, y: 950 }, "low-piers east walk", 8);
  moveTo(state, { x: 1350, y: 540 }, "low-piers north walk", 8);
  moveTo(state, fieldLead.target, "lantern tender", 6);
  let analyzeElapsed = 0;
  while (analyzeElapsed < WORLD.tidewalkExpeditionSeconds + 0.12) {
    const dx = fieldLead.target.x - state.player.x;
    const dy = fieldLead.target.y - state.player.y;
    updateGameState(
      state,
      {
        analyze: true,
        left: dx < -8,
        right: dx > 8,
        up: dy < -8,
        down: dy > 8
      },
      1 / 60
    );
    analyzeElapsed += 1 / 60;
  }

  const completedExpedition = getTidewalkExpedition(state);
  assert.equal(completedExpedition.complete, true);
  assert.equal(state.scene, "archive");
  assert.match(state.clueLog.at(-1), /black-painted skiff/i);
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
