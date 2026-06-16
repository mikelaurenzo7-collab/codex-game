import assert from "node:assert/strict";
import {
  chooseTidewalkRoute,
  createTidewalkCoastalState,
  getTidewalkCoastalObjective,
  surveyTidewalkWarehouse,
  TIDEWALK_ROUTE_CHOICES
} from "../src/tidewalk-coastal-objective.js";

function withDockingRights(overrides = {}) {
  return createTidewalkCoastalState({
    resolvedEncounterIds: ["tidewalk-docking-rights"],
    ...overrides
  });
}

{
  const state = createTidewalkCoastalState();
  const objective = getTidewalkCoastalObjective(state);

  assert.equal(objective.phase, "locked");
  assert.equal(objective.canSurvey, false);
  assert.equal(objective.canChooseRoute, false);
  assert.match(objective.prompt, /docking rights/i);
}

{
  const state = withDockingRights();
  const objective = getTidewalkCoastalObjective(state);

  assert.equal(objective.phase, "ready");
  assert.equal(objective.canSurvey, true);
  assert.equal(objective.progress, 0);
}

{
  const firstPass = surveyTidewalkWarehouse(withDockingRights(), 0.45);
  const objective = getTidewalkCoastalObjective(firstPass);

  assert.equal(firstPass.lastCoastalObjectiveEvent.type, "survey-progress");
  assert.equal(objective.phase, "surveying");
  assert.equal(objective.progress, 0.45);
  assert.equal(firstPass.signal, 88);
}

{
  const completed = surveyTidewalkWarehouse(withDockingRights({ coastalSurveyProgress: 0.8 }), 0.5);
  const objective = getTidewalkCoastalObjective(completed);

  assert.equal(completed.lastCoastalObjectiveEvent.type, "survey-complete");
  assert.equal(objective.phase, "route-choice");
  assert.equal(objective.canChooseRoute, true);
  assert.equal(objective.discoveredHostileMark, true);
  assert.deepEqual(new Set(completed.discoveredCoastalClues), new Set(["black-keel-mark", "warehouse-ledger"]));
  assert.equal(objective.routeChoices.length, 2);
}

{
  const chosen = chooseTidewalkRoute(
    withDockingRights({
      coastalSurveyProgress: 1,
      discoveredCoastalClues: ["black-keel-mark", "warehouse-ledger"]
    }),
    "black-keel-countermark"
  );
  const objective = getTidewalkCoastalObjective(chosen);

  assert.equal(chosen.lastCoastalObjectiveEvent.type, "route-choice-selected");
  assert.equal(chosen.lastCoastalObjectiveEvent.risk, 4);
  assert.equal(objective.phase, "route-chosen");
  assert.equal(objective.selectedChoice.id, "black-keel-countermark");
}

{
  const blocked = chooseTidewalkRoute(withDockingRights(), TIDEWALK_ROUTE_CHOICES[0].id);

  assert.equal(blocked.lastCoastalObjectiveEvent.type, "route-choice-blocked");
  assert.equal(blocked.lastCoastalObjectiveEvent.reason, "survey-required");
}

console.log("tidewalk coastal objective tests passed");
