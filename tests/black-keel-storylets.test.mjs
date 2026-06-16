import assert from "node:assert/strict";
import { chooseTidewalkRoute, createTidewalkCoastalState, surveyTidewalkWarehouse } from "../src/tidewalk-coastal-objective.js";
import { getBlackKeelStorylet, listBlackKeelStorylets } from "../src/black-keel-storylets.js";

function surveyedState(overrides = {}) {
  return createTidewalkCoastalState({
    resolvedEncounterIds: ["tidewalk-docking-rights"],
    coastalSurveyProgress: 1,
    discoveredCoastalClues: ["black-keel-mark", "warehouse-ledger"],
    ...overrides
  });
}

{
  const locked = getBlackKeelStorylet(createTidewalkCoastalState());

  assert.equal(locked.ready, false);
  assert.equal(locked.objectivePhase, "locked");
  assert.equal(locked.title, "No Coastal Consequence Yet");
  assert.deepEqual(locked.unlockedFlags, []);
}

{
  const readyButUnchosen = getBlackKeelStorylet(surveyedState());

  assert.equal(readyButUnchosen.ready, false);
  assert.equal(readyButUnchosen.objectivePhase, "route-choice");
  assert.match(readyButUnchosen.nextHook, /choose a Tidewalk route/i);
}

{
  const chosenSafe = chooseTidewalkRoute(surveyedState(), "quay-safe-lantern-line");
  const storylet = getBlackKeelStorylet(chosenSafe);

  assert.equal(storylet.ready, true);
  assert.equal(storylet.selectedChoice.id, "quay-safe-lantern-line");
  assert.equal(storylet.title, "Lantern Line Afterglow");
  assert.equal(storylet.factionPressure, 2);
  assert.equal(storylet.settlementTrust, 4);
  assert.ok(storylet.unlockedFlags.includes("quay-battery-cache"));
  assert.match(storylet.headline, /Pressure 2\/5/);
}

{
  const chosenAggressive = chooseTidewalkRoute(surveyedState(), "black-keel-countermark");
  const storylet = getBlackKeelStorylet(chosenAggressive);

  assert.equal(storylet.ready, true);
  assert.equal(storylet.selectedChoice.id, "black-keel-countermark");
  assert.equal(storylet.title, "Countermark Pursuit");
  assert.equal(storylet.factionPressure, 5);
  assert.equal(storylet.settlementTrust, 2);
  assert.ok(storylet.riskTags.includes("faction-exposure"));
  assert.match(storylet.nextHook, /ambush the cache crew|shadow them/i);
}

{
  const partiallyRevealed = chooseTidewalkRoute(
    surveyedState({ discoveredCoastalClues: ["warehouse-ledger"] }),
    "black-keel-countermark"
  );
  const storylet = getBlackKeelStorylet(partiallyRevealed);

  assert.equal(storylet.ready, true);
  assert.equal(storylet.knowsBlackKeel, false);
  assert.equal(storylet.factionPressure, 4);
  assert.match(storylet.nextHook, /Recover the Black-Keel mark/i);
}

{
  const progressed = surveyTidewalkWarehouse(
    createTidewalkCoastalState({ resolvedEncounterIds: ["tidewalk-docking-rights"] }),
    1
  );
  const chosen = chooseTidewalkRoute(progressed, "black-keel-countermark");
  const storylet = getBlackKeelStorylet(chosen);

  assert.equal(storylet.ready, true);
  assert.equal(storylet.knowsBlackKeel, true);
}

{
  const summaries = listBlackKeelStorylets();

  assert.equal(summaries.length, 2);
  assert.deepEqual(
    summaries.map((summary) => summary.id),
    ["lantern-line-afterglow", "countermark-pursuit"]
  );
}

console.log("black-keel storylet tests passed");
