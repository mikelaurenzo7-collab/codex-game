import assert from "node:assert/strict";
import {
  WORLD,
  canPulse,
  collectedFragmentCount,
  createGameState,
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
  const echo = state.echoes[0];
  state.player.x = echo.x;
  state.player.y = echo.y;
  tick(state, 0.5);
  assert.ok(state.signal < 100, "echo contact should drain signal");
}

console.log("game-state tests passed");
