export const WORLD = {
  width: 1920,
  height: 1080,
  playerRadius: 18,
  playerSpeed: 255,
  pulseRadius: 245,
  pulseCost: 24,
  pulseCooldown: 1.25,
  fragmentRevealSeconds: 7.5,
  echoStunSeconds: 2.6,
  echoDrainPerSecond: 26,
  signalRechargePerSecond: 4.5
};

const BLUEPRINT = {
  player: { x: 160, y: 880 },
  gate: { x: 1770, y: 170, radius: 54 },
  obstacles: [
    { x: 0, y: 0, width: 1920, height: 42 },
    { x: 0, y: 1038, width: 1920, height: 42 },
    { x: 0, y: 0, width: 42, height: 1080 },
    { x: 1878, y: 0, width: 42, height: 1080 },
    { x: 300, y: 160, width: 70, height: 620 },
    { x: 610, y: 430, width: 550, height: 72 },
    { x: 850, y: 120, width: 72, height: 250 },
    { x: 1260, y: 300, width: 70, height: 600 },
    { x: 1460, y: 730, width: 250, height: 70 },
    { x: 520, y: 760, width: 390, height: 62 }
  ],
  fragments: [
    { id: "chorus", x: 520, y: 190, clue: "A crew sang to mask the hull alarms." },
    { id: "cartographer", x: 1080, y: 760, clue: "The map was rewritten after the first descent." },
    { id: "bell", x: 1640, y: 420, clue: "The bell rings only when nobody is alive to hear it." }
  ],
  relays: [
    { id: "south-relay", x: 260, y: 710, radius: 46 },
    { id: "east-relay", x: 1510, y: 900, radius: 46 }
  ],
  echoes: [
    {
      id: "witness",
      x: 700,
      y: 650,
      radius: 26,
      path: [
        { x: 700, y: 650 },
        { x: 1110, y: 650 },
        { x: 1110, y: 920 },
        { x: 700, y: 920 }
      ],
      speed: 105
    },
    {
      id: "warden",
      x: 1450,
      y: 230,
      radius: 28,
      path: [
        { x: 1450, y: 230 },
        { x: 1710, y: 230 },
        { x: 1710, y: 610 },
        { x: 1450, y: 610 }
      ],
      speed: 95
    }
  ]
};

export function createGameState() {
  return {
    time: 0,
    status: "running",
    result: null,
    player: { ...BLUEPRINT.player, radius: WORLD.playerRadius },
    gate: { ...BLUEPRINT.gate, unlocked: false },
    obstacles: BLUEPRINT.obstacles.map((obstacle) => ({ ...obstacle })),
    fragments: BLUEPRINT.fragments.map((fragment) => ({
      ...fragment,
      revealedUntil: 0,
      collected: false
    })),
    relays: BLUEPRINT.relays.map((relay) => ({ ...relay, depleted: false })),
    echoes: BLUEPRINT.echoes.map((echo) => ({
      ...echo,
      targetIndex: 1,
      stunnedUntil: 0
    })),
    signal: 100,
    pulseCooldownUntil: 0,
    pulses: [],
    clueLog: []
  };
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function collectedFragmentCount(state) {
  return state.fragments.filter((fragment) => fragment.collected).length;
}

export function canPulse(state) {
  return state.status === "running" && state.signal >= WORLD.pulseCost && state.time >= state.pulseCooldownUntil;
}

export function triggerPulse(state) {
  if (!canPulse(state)) {
    return false;
  }

  state.signal = Math.max(0, state.signal - WORLD.pulseCost);
  state.pulseCooldownUntil = state.time + WORLD.pulseCooldown;
  state.pulses.push({ x: state.player.x, y: state.player.y, startedAt: state.time });

  for (const fragment of state.fragments) {
    if (!fragment.collected && distance(state.player, fragment) <= WORLD.pulseRadius) {
      fragment.revealedUntil = state.time + WORLD.fragmentRevealSeconds;
    }
  }

  for (const echo of state.echoes) {
    if (distance(state.player, echo) <= WORLD.pulseRadius) {
      echo.stunnedUntil = state.time + WORLD.echoStunSeconds;
    }
  }

  for (const relay of state.relays) {
    if (!relay.depleted && distance(state.player, relay) <= relay.radius + WORLD.pulseRadius * 0.35) {
      relay.depleted = true;
      state.signal = Math.min(100, state.signal + 38);
    }
  }

  return true;
}

export function updateGameState(state, input, deltaSeconds) {
  if (state.status !== "running") {
    return state;
  }

  const dt = Math.min(Math.max(deltaSeconds, 0), 0.05);
  state.time += dt;
  state.signal = Math.min(100, state.signal + WORLD.signalRechargePerSecond * dt);
  state.pulses = state.pulses.filter((pulse) => state.time - pulse.startedAt < 0.72);

  movePlayer(state, input, dt);
  moveEchoes(state, dt);
  resolveCollection(state);
  resolveEchoPressure(state, dt);
  resolveGate(state);

  return state;
}

function movePlayer(state, input, dt) {
  let dx = Number(Boolean(input.right)) - Number(Boolean(input.left));
  let dy = Number(Boolean(input.down)) - Number(Boolean(input.up));
  const magnitude = Math.hypot(dx, dy);
  if (magnitude > 0) {
    dx /= magnitude;
    dy /= magnitude;
  }

  const distanceToMove = WORLD.playerSpeed * dt;
  moveCircleWithCollision(state.player, dx * distanceToMove, 0, state.obstacles);
  moveCircleWithCollision(state.player, 0, dy * distanceToMove, state.obstacles);
}

function moveCircleWithCollision(circle, dx, dy, obstacles) {
  circle.x = clamp(circle.x + dx, circle.radius, WORLD.width - circle.radius);
  circle.y = clamp(circle.y + dy, circle.radius, WORLD.height - circle.radius);

  for (const obstacle of obstacles) {
    const nearestX = clamp(circle.x, obstacle.x, obstacle.x + obstacle.width);
    const nearestY = clamp(circle.y, obstacle.y, obstacle.y + obstacle.height);
    const overlapX = circle.x - nearestX;
    const overlapY = circle.y - nearestY;
    const overlapDistance = Math.hypot(overlapX, overlapY);

    if (overlapDistance > 0 && overlapDistance < circle.radius) {
      const push = circle.radius - overlapDistance;
      circle.x += (overlapX / overlapDistance) * push;
      circle.y += (overlapY / overlapDistance) * push;
    }
  }
}

function moveEchoes(state, dt) {
  for (const echo of state.echoes) {
    if (echo.stunnedUntil > state.time) {
      continue;
    }

    const target = echo.path[echo.targetIndex];
    const dx = target.x - echo.x;
    const dy = target.y - echo.y;
    const remaining = Math.hypot(dx, dy);

    if (remaining < 4) {
      echo.targetIndex = (echo.targetIndex + 1) % echo.path.length;
      continue;
    }

    const step = Math.min(remaining, echo.speed * dt);
    echo.x += (dx / remaining) * step;
    echo.y += (dy / remaining) * step;
  }
}

function resolveCollection(state) {
  for (const fragment of state.fragments) {
    const revealed = fragment.revealedUntil >= state.time;
    if (!fragment.collected && revealed && distance(state.player, fragment) <= state.player.radius + 28) {
      fragment.collected = true;
      state.clueLog.push(fragment.clue);
    }
  }
}

function resolveEchoPressure(state, dt) {
  for (const echo of state.echoes) {
    const stunned = echo.stunnedUntil > state.time;
    if (!stunned && distance(state.player, echo) <= state.player.radius + echo.radius + 10) {
      state.signal = Math.max(0, state.signal - WORLD.echoDrainPerSecond * dt);
    }
  }

  if (state.signal <= 0) {
    state.status = "failed";
    state.result = "Signal lost";
  }
}

function resolveGate(state) {
  state.gate.unlocked = collectedFragmentCount(state) === state.fragments.length;
  if (state.gate.unlocked && distance(state.player, state.gate) <= state.player.radius + state.gate.radius) {
    state.status = "complete";
    state.result = "Archive thread recovered";
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
