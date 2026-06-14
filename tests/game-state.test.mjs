import assert from "node:assert/strict";
import {
  WORLD,
  canPulse,
  collectedFragmentCount,
  createGameState,
  distance,
  getActiveObjective,
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

{
  const state = createGameState();
  assert.equal(state.status, "running");
  assert.equal(state.fragments.length, 3);
  assert.equal(collectedFragmentCount(state), 0);
  assert.equal(state.gate.unlocked, false);
  assert.equal(canPulse(state), true);
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
}

{
  const state = createGameState();
  for (const fragment of state.fragments) {
    fragment.collected = true;
  }

  tick(state, 0.1);
  assert.equal(state.gate.unlocked, true);

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
  collectFragmentAt(state, "bell");

  assert.equal(getActiveObjective(state).kind, "gate");

  for (const [waypoint, label] of route.slice(11)) {
    moveTo(state, waypoint, label);
  }

  tick(state, 0.2);
  assert.equal(state.status, "complete");
  assert.equal(state.result, "Archive thread recovered");
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
