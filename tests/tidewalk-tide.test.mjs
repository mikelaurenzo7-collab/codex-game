import assert from "node:assert/strict";
import {
  createGameState,
  updateGameState,
  getTidewalkSurveyField,
  createGameCheckpoint,
  restoreGameCheckpoint
} from "../src/game-state.js";

function tickSeconds(state, seconds) {
  const step = 0.05;
  const stepsCount = Math.round(seconds / step);
  for (let i = 0; i < stepsCount; i++) {
    updateGameState(state, {}, step);
  }
}

function setupActiveSurveyState() {
  const state = createGameState();
  state.frontier.traversedRouteIds = ["intake-coastline-lift"];
  state.frontier.lastTraverse = { routeId: "intake-coastline-lift" };
  state.frontier.resolvedEncounterIds = ["tidewalk-docking-rights"];
  state.frontier.tidewalkSurvey.launched = true;
  state.scene = "tidewalk";
  return state;
}

// Test initialization
{
  const state = createGameState();
  assert.equal(state.frontier.tide.phase, "low");
  assert.equal(state.frontier.tide.timer, 0);
}

// Test tide cycle transitions
{
  const state = setupActiveSurveyState();

  // Ticking 5 seconds
  tickSeconds(state, 5);
  assert.equal(state.frontier.tide.phase, "low");
  assert.equal(Math.round(state.frontier.tide.timer), 5);

  // Ticking another 11 seconds (total 16s) triggers phase transition to high
  tickSeconds(state, 11);
  assert.equal(state.frontier.tide.phase, "high");
  assert.equal(Math.round(state.frontier.tide.timer), 1); // 16 - 15 = 1s remainder

  // Ticking another 15 seconds (total 31s) triggers phase transition to surge
  tickSeconds(state, 15);
  assert.equal(state.frontier.tide.phase, "surge");
  assert.equal(Math.round(state.frontier.tide.timer), 1);
}

// Test hazard radius scaling based on tide phase
{
  const state = setupActiveSurveyState();

  // Default / Low Tide (radius = 0.6 * base)
  const surveyLow = getTidewalkSurveyField(state);
  const baseBrineMouthRadius = 118; // From TIDEWALK_SCENE.hazards
  const expectedLowRadius = baseBrineMouthRadius * 0.6;
  const actualLow = surveyLow.hazards.find((h) => h.id === "brine-mouth");
  assert.ok(actualLow, "brine-mouth hazard should exist");
  assert.equal(actualLow.radius, expectedLowRadius);

  // Transition to High Tide
  state.frontier.tide.phase = "high";
  const surveyHigh = getTidewalkSurveyField(state);
  const actualHigh = surveyHigh.hazards.find((h) => h.id === "brine-mouth");
  assert.equal(actualHigh.radius, baseBrineMouthRadius);

  // Transition to Surge Tide
  state.frontier.tide.phase = "surge";
  const surveySurge = getTidewalkSurveyField(state);
  const actualSurge = surveySurge.hazards.find((h) => h.id === "brine-mouth");
  assert.equal(actualSurge.radius, baseBrineMouthRadius * 1.5);
}

// Test checkpoint save and restore
{
  const state = createGameState();
  state.frontier.tide.phase = "surge";
  state.frontier.tide.timer = 12.5;

  const checkpoint = createGameCheckpoint(state);
  const restoredState = restoreGameCheckpoint(checkpoint);

  assert.equal(restoredState.frontier.tide.phase, "surge");
  assert.equal(restoredState.frontier.tide.timer, 12.5);
}

console.log("tidewalk tide tests passed");
