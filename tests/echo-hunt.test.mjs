import assert from "node:assert/strict";
import {
  createGameState,
  updateGameState,
  triggerPulse,
  GAME_SAVE_VERSION,
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

// Test echo hunting setup
{
  const state = createGameState();
  state.scene = "archive";

  // Position player
  state.player.x = 100;
  state.player.y = 100;

  // Position echo: we place it at distance 400.
  // Base pulseRadius is 280, so 400 is outside stun (280) but inside hunt (560).
  const echo = state.echoes[0];
  echo.x = 500;
  echo.y = 100;
  echo.stunnedUntil = 0;
  echo.speed = 100; // 100 pixels per second
  echo.huntTarget = null;

  // Trigger pulse
  const pulsed = triggerPulse(state);
  assert.equal(pulsed, true);

  // Echo is outside stun radius but within hunt radius
  assert.equal(echo.stunnedUntil <= state.time, true); // not stunned
  assert.deepEqual(echo.huntTarget, { x: 100, y: 100 });

  // Tick update loop to let it chase the target
  // Distance is 400. Speed is 100 * 1.5 = 150 pixels per second.
  // It should take about 400 / 150 = 2.67 seconds to reach target.
  tickSeconds(state, 1.5);
  // It should have moved towards x: 100.
  // In 1.5s, it moves 1.5 * 150 = 225 pixels.
  // New x should be roughly 500 - 225 = 275.
  assert.ok(echo.x < 300);
  assert.ok(echo.x > 250);
  assert.equal(echo.huntTarget !== null, true);

  // Tick enough to let it reach target (additional 1.5 seconds)
  tickSeconds(state, 1.5);
  // It should have reached the target and cleared huntTarget
  assert.equal(echo.huntTarget, null);
}

// Test echo gets stunned and then hunts after stun wears off
{
  const state = createGameState();
  state.scene = "archive";

  state.player.x = 100;
  state.player.y = 100;

  // Place echo inside stun radius (distance 150)
  const echo = state.echoes[0];
  echo.x = 250;
  echo.y = 100;
  echo.stunnedUntil = 0;
  echo.speed = 100;
  echo.huntTarget = null;

  // Trigger pulse
  triggerPulse(state);

  // Echo should be stunned and have a hunt target registered
  assert.ok(echo.stunnedUntil > state.time);
  assert.deepEqual(echo.huntTarget, { x: 100, y: 100 });

  // Tick briefly: echo is stunned so it shouldn't move
  tickSeconds(state, 1.0);
  assert.equal(echo.x, 250); // hasn't moved
  assert.deepEqual(echo.huntTarget, { x: 100, y: 100 });

  // Tick until stun wears off (stun is 2.6 seconds)
  tickSeconds(state, 2.0);
  // Stun is now worn off (total ticked 3.0s). Echo should have started hunting
  assert.ok(echo.x < 250);
}

// Test checkpoint saves the hunt target
{
  const state = createGameState();
  const echo = state.echoes[0];
  echo.huntTarget = { x: 340, y: 560 };

  const checkpoint = createGameCheckpoint(state);
  const restored = restoreGameCheckpoint(checkpoint);

  assert.deepEqual(restored.echoes[0].huntTarget, { x: 340, y: 560 });
}

console.log("echo hunt tests passed");
