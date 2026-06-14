import {
  WORLD,
  collectedFragmentCount,
  createGameState,
  getEvidenceJournal,
  getActiveObjective,
  triggerPulse,
  updateGameState
} from "./game-state.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const signalFill = document.querySelector("#signalFill");
const fragmentReadout = document.querySelector("#fragmentReadout");
const statusReadout = document.querySelector("#statusReadout");
const objectiveReadout = document.querySelector("#objectiveReadout");
const journalCount = document.querySelector("#journalCount");
const journalList = document.querySelector("#journalList");
const restartButton = document.querySelector("#restartButton");

const input = {
  up: false,
  down: false,
  left: false,
  right: false
};

let state = createGameState();
let lastTime = performance.now();
let journalSnapshot = "";

const keyMap = new Map([
  ["ArrowUp", "up"],
  ["KeyW", "up"],
  ["ArrowDown", "down"],
  ["KeyS", "down"],
  ["ArrowLeft", "left"],
  ["KeyA", "left"],
  ["ArrowRight", "right"],
  ["KeyD", "right"]
]);

window.addEventListener("keydown", (event) => {
  const mapped = keyMap.get(event.code);
  if (mapped) {
    input[mapped] = true;
    event.preventDefault();
  }

  if (event.code === "Space") {
    triggerPulse(state);
    event.preventDefault();
  }

  if (event.code === "KeyR") {
    restart();
  }
});

window.addEventListener("keyup", (event) => {
  const mapped = keyMap.get(event.code);
  if (mapped) {
    input[mapped] = false;
    event.preventDefault();
  }
});

restartButton.addEventListener("click", restart);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(frame);

function restart() {
  state = createGameState();
  lastTime = performance.now();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function frame(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  updateGameState(state, input, dt);
  draw();
  updateHud();
  requestAnimationFrame(frame);
}

function worldToScreen(camera, point) {
  return {
    x: (point.x - camera.x) * camera.scale,
    y: (point.y - camera.y) * camera.scale
  };
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const camera = makeCamera(width, height);

  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);

  ctx.save();
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(-camera.x, -camera.y);

  drawWorldFloor();
  drawGate();
  drawRelays();
  drawFragments();
  drawRecoveredMarkers();
  drawEchoes();
  drawObstacles();
  drawPulses();
  drawPlayer();
  drawFog(camera, width, height);

  ctx.restore();
  drawObjectiveCue(camera, width, height);
  drawBottomLog(width, height);
  drawEndState(width, height);
}

function makeCamera(width, height) {
  const scale = Math.min(width / 960, height / 600);
  const viewportWidth = width / scale;
  const viewportHeight = height / scale;
  return {
    scale,
    x: clamp(state.player.x - viewportWidth / 2, 0, WORLD.width - viewportWidth),
    y: clamp(state.player.y - viewportHeight / 2, 0, WORLD.height - viewportHeight)
  };
}

function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#081419");
  gradient.addColorStop(0.55, "#0c1d23");
  gradient.addColorStop(1, "#171b1f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawWorldFloor() {
  ctx.fillStyle = "#12262b";
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.strokeStyle = "rgba(115, 180, 170, 0.08)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= WORLD.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD.height);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(225, 195, 108, 0.12)";
  ctx.lineWidth = 4;
  ctx.strokeRect(64, 64, WORLD.width - 128, WORLD.height - 128);
}

function drawObstacles() {
  for (const obstacle of state.obstacles) {
    ctx.fillStyle = "#26383b";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "rgba(121, 206, 194, 0.08)";
    ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
  }
}

function drawGate() {
  const gateColor = state.gate.unlocked ? "#e8c46d" : "#6e8e98";
  ctx.save();
  ctx.translate(state.gate.x, state.gate.y);
  ctx.strokeStyle = gateColor;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, state.gate.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = state.gate.unlocked ? "rgba(232,196,109,0.45)" : "rgba(110,142,152,0.25)";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(0, 0, state.gate.radius + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawRelays() {
  for (const relay of state.relays) {
    ctx.save();
    ctx.translate(relay.x, relay.y);
    ctx.strokeStyle = relay.depleted ? "rgba(134,143,142,0.45)" : "rgba(98,214,184,0.85)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, relay.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = relay.depleted ? "#506061" : "#62d6b8";
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
  }
}

function drawFragments() {
  for (const fragment of state.fragments) {
    if (fragment.collected) {
      continue;
    }

    const visible = fragment.revealedUntil > state.time;
    if (!visible) {
      drawHiddenGlitch(fragment);
      continue;
    }

    ctx.save();
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(state.time * 1.3);
    ctx.fillStyle = "#e8c46d";
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(23, 0);
    ctx.lineTo(0, 26);
    ctx.lineTo(-23, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawRecoveredMarkers() {
  const entries = getEvidenceJournal(state).filter((entry) => entry.collected);
  for (const entry of entries) {
    ctx.save();
    ctx.translate(entry.location.x, entry.location.y);
    ctx.strokeStyle = "rgba(232, 196, 109, 0.9)";
    ctx.fillStyle = "rgba(6, 16, 19, 0.68)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(98, 214, 184, 0.75)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.stroke();

    ctx.fillStyle = "#f3f0dc";
    ctx.font = "700 18px system-ui, sans-serif";
    ctx.fillText(entry.title, 46, 6);
    ctx.restore();
  }
}

function drawHiddenGlitch(fragment) {
  const flicker = Math.sin(state.time * 5 + fragment.x) > 0.88;
  if (!flicker) {
    return;
  }
  ctx.fillStyle = "rgba(232,196,109,0.18)";
  ctx.fillRect(fragment.x - 18, fragment.y - 2, 36, 4);
}

function drawEchoes() {
  for (const echo of state.echoes) {
    const stunned = echo.stunnedUntil > state.time;
    ctx.save();
    ctx.translate(echo.x, echo.y);
    ctx.strokeStyle = stunned ? "#62d6b8" : "#d96666";
    ctx.fillStyle = stunned ? "rgba(98,214,184,0.18)" : "rgba(217,102,102,0.24)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, echo.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = stunned ? "rgba(98,214,184,0.32)" : "rgba(217,102,102,0.24)";
    ctx.beginPath();
    ctx.arc(0, 0, echo.radius + 28 + Math.sin(state.time * 4) * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPulses() {
  for (const pulse of state.pulses) {
    const age = state.time - pulse.startedAt;
    const progress = age / 0.72;
    ctx.strokeStyle = `rgba(98, 214, 184, ${1 - progress})`;
    ctx.lineWidth = 8 * (1 - progress) + 2;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, WORLD.pulseRadius * progress, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.fillStyle = "#f3f0dc";
  ctx.strokeStyle = "#0b1416";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, state.player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(98, 214, 184, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, state.player.radius + 12 + Math.sin(state.time * 5) * 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawObjectiveCue(camera, width, height) {
  const objective = getActiveObjective(state);
  if (!objective) {
    return;
  }

  const playerScreen = worldToScreen(camera, state.player);
  const targetScreen = worldToScreen(camera, objective.target);
  const dx = targetScreen.x - playerScreen.x;
  const dy = targetScreen.y - playerScreen.y;
  const magnitude = Math.hypot(dx, dy);
  if (magnitude < 1) {
    return;
  }

  const angle = Math.atan2(dy, dx);
  const radius = Math.max(58, Math.min(132, Math.min(width, height) * 0.18));
  const x = clamp(playerScreen.x + Math.cos(angle) * radius, 34, width - 34);
  const y = clamp(playerScreen.y + Math.sin(angle) * radius, 76, height - 34);
  const color = objective.kind === "gate" ? "#e8c46d" : "#62d6b8";

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(6, 16, 19, 0.68)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-10, -13);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-10, 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFog(camera, width, height) {
  const visibleWidth = width / camera.scale;
  const visibleHeight = height / camera.scale;
  const gradient = ctx.createRadialGradient(
    state.player.x,
    state.player.y,
    120,
    state.player.x,
    state.player.y,
    520
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.5, "rgba(0,0,0,0.1)");
  gradient.addColorStop(1, "rgba(0,0,0,0.68)");
  ctx.fillStyle = gradient;
  ctx.fillRect(camera.x, camera.y, visibleWidth, visibleHeight);
}

function drawBottomLog(width, height) {
  const latest = state.clueLog.at(-1);
  if (!latest) {
    return;
  }

  ctx.fillStyle = "rgba(6, 16, 19, 0.72)";
  ctx.fillRect(24, height - 72, Math.min(width - 48, 760), 48);
  ctx.fillStyle = "#f3f0dc";
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText(latest, 44, height - 41);
}

function drawEndState(width, height) {
  if (state.status === "running") {
    return;
  }

  ctx.fillStyle = "rgba(6, 16, 19, 0.82)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = state.status === "complete" ? "#e8c46d" : "#d96666";
  ctx.font = "700 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.result, width / 2, height / 2 - 12);
  ctx.fillStyle = "#f3f0dc";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("Press R to re-enter the archive.", width / 2, height / 2 + 30);
  ctx.textAlign = "start";
}

function updateHud() {
  const objective = getActiveObjective(state);
  signalFill.style.width = `${Math.round(state.signal)}%`;
  fragmentReadout.textContent = `Fragments ${collectedFragmentCount(state)}/${state.fragments.length}`;
  objectiveReadout.textContent = objective ? `${objective.label} ${objective.distance}m` : "Thread resolved";
  updateJournal();

  if (state.status !== "running") {
    statusReadout.textContent = state.result;
  } else if (state.gate.unlocked) {
    statusReadout.textContent = "Gate unlocked";
  } else if (state.fragments.some((fragment) => fragment.revealedUntil > state.time && !fragment.collected)) {
    statusReadout.textContent = "Memory exposed";
  } else {
    statusReadout.textContent = "Sweep the archive";
  }
}

function updateJournal() {
  const entries = getEvidenceJournal(state);
  const signature = entries
    .map((entry) => `${entry.id}:${entry.collected}:${entry.collectedAt ?? "none"}`)
    .join("|");
  if (signature === journalSnapshot) {
    return;
  }

  journalSnapshot = signature;
  journalCount.textContent = `${entries.filter((entry) => entry.collected).length}/${entries.length}`;
  journalList.replaceChildren(
    ...entries.map((entry) => {
      const item = document.createElement("li");
      item.className = entry.collected ? "is-collected" : "is-hidden";

      const title = document.createElement("span");
      title.className = "journal-title";
      title.textContent = entry.title;

      const clue = document.createElement("span");
      clue.className = "journal-clue";
      clue.textContent = entry.collected ? entry.clue : "Signal not recovered";

      item.append(title, clue);
      return item;
    })
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
