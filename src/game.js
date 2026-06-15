import {
  WORLD,
  collectedFragmentCount,
  createGameState,
  getEvidenceJournal,
  getEvidenceSynthesis,
  getFieldAnalysis,
  getFrontierNetwork,
  getWorldAtlas,
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
const synthesisTitle = document.querySelector("#synthesisTitle");
const synthesisText = document.querySelector("#synthesisText");
const atlasCount = document.querySelector("#atlasCount");
const regionName = document.querySelector("#regionName");
const regionDetail = document.querySelector("#regionDetail");
const regionRisk = document.querySelector("#regionRisk");
const routeCount = document.querySelector("#routeCount");
const routeList = document.querySelector("#routeList");
const landmarkList = document.querySelector("#landmarkList");
const restartButton = document.querySelector("#restartButton");

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  analyze: false
};

let state = createGameState();
let lastTime = performance.now();
let journalSnapshot = "";
let atlasSnapshot = "";

const keyMap = new Map([
  ["ArrowUp", "up"],
  ["KeyW", "up"],
  ["ArrowDown", "down"],
  ["KeyS", "down"],
  ["ArrowLeft", "left"],
  ["KeyA", "left"],
  ["ArrowRight", "right"],
  ["KeyD", "right"],
  ["KeyE", "analyze"]
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
  drawRegionContours();
  drawGate();
  drawRelays();
  drawSynthesisTarget();
  drawFieldAnalysis();
  drawFragments();
  drawRecoveredMarkers();
  drawAtlasLandmarks();
  drawFrontierGates();
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

function drawRegionContours() {
  const atlas = getWorldAtlas(state);
  for (const region of atlas.regions) {
    const opacity = region.visited ? 0.12 : 0.035;
    ctx.fillStyle = `rgba(98, 214, 184, ${opacity})`;
    ctx.fillRect(region.bounds.x, region.bounds.y, region.bounds.width, region.bounds.height);
    ctx.strokeStyle = region.visited ? "rgba(232, 196, 109, 0.22)" : "rgba(98, 214, 184, 0.08)";
    ctx.lineWidth = region.visited ? 3 : 1;
    ctx.strokeRect(region.bounds.x, region.bounds.y, region.bounds.width, region.bounds.height);
  }
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

function drawSynthesisTarget() {
  const synthesis = getEvidenceSynthesis(state);
  if (synthesis.phase !== "deduced" || !synthesis.target) {
    return;
  }

  ctx.save();
  ctx.translate(synthesis.target.x, synthesis.target.y);
  ctx.strokeStyle = "rgba(232, 196, 109, 0.72)";
  ctx.lineWidth = 5;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.arc(0, 0, 58 + Math.sin(state.time * 3) * 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(232, 196, 109, 0.16)";
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFieldAnalysis() {
  const analysis = getFieldAnalysis(state);
  if (!analysis.active || !analysis.target || analysis.complete) {
    return;
  }

  const progress = analysis.progress / analysis.required;
  ctx.save();
  ctx.translate(analysis.target.x, analysis.target.y);
  ctx.strokeStyle = analysis.inRange ? "rgba(232, 196, 109, 0.92)" : "rgba(232, 196, 109, 0.36)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, WORLD.fieldAnalysisRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();
  ctx.strokeStyle = "rgba(98, 214, 184, 0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, WORLD.fieldAnalysisRadius + 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
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

function drawAtlasLandmarks() {
  const atlas = getWorldAtlas(state);
  const discovered = atlas.landmarks.filter((landmark) => landmark.discovered);
  for (const landmark of discovered) {
    ctx.save();
    ctx.translate(landmark.location.x, landmark.location.y);
    ctx.strokeStyle = "rgba(98, 214, 184, 0.68)";
    ctx.fillStyle = "rgba(6, 16, 19, 0.62)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(-10, -10, 20, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(243, 240, 220, 0.82)";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText(landmark.title, 16, -14);
    ctx.restore();
  }
}

function drawFrontierGates() {
  const frontier = getFrontierNetwork(state);
  for (const route of frontier.routes) {
    ctx.save();
    ctx.translate(route.gate.x, route.gate.y);
    ctx.fillStyle = "rgba(6, 16, 19, 0.72)";
    ctx.strokeStyle = route.charted ? "#e8c46d" : "rgba(98, 214, 184, 0.46)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-10, -12);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = route.charted ? "rgba(232, 196, 109, 0.24)" : "rgba(98, 214, 184, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, route.charted ? 28 : 20, 0, Math.PI * 2);
    ctx.stroke();

    if (route.charted) {
      ctx.fillStyle = "rgba(243, 240, 220, 0.82)";
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillText(route.destinationName, 24, 4);
    }

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
  const color = objective.kind === "gate" || objective.kind === "deduced-fragment" ? "#e8c46d" : "#62d6b8";

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
  const synthesis = getEvidenceSynthesis(state);
  const analysis = getFieldAnalysis(state);
  signalFill.style.width = `${Math.round(state.signal)}%`;
  fragmentReadout.textContent = `Fragments ${collectedFragmentCount(state)}/${state.fragments.length}`;
  objectiveReadout.textContent = formatObjective(objective, analysis);
  updateJournal();
  updateAtlas();

  if (state.status !== "running") {
    statusReadout.textContent = state.result;
  } else if (state.gate.unlocked) {
    statusReadout.textContent = "Gate unlocked";
  } else if (analysis.active && !analysis.complete && analysis.inRange && input.analyze) {
    statusReadout.textContent = `Analyzing ${Math.round((analysis.progress / analysis.required) * 100)}%`;
  } else if (analysis.active && !analysis.complete && analysis.inRange) {
    statusReadout.textContent = "Analysis ready";
  } else if (analysis.active && !analysis.complete) {
    statusReadout.textContent = "Analysis required";
  } else if (synthesis.phase === "deduced") {
    statusReadout.textContent = "Deduction active";
  } else if (synthesis.phase === "cross-check") {
    statusReadout.textContent = "Evidence unstable";
  } else if (state.fragments.some((fragment) => fragment.revealedUntil > state.time && !fragment.collected)) {
    statusReadout.textContent = "Memory exposed";
  } else {
    statusReadout.textContent = "Sweep the archive";
  }
}

function updateAtlas() {
  const atlas = getWorldAtlas(state);
  const frontier = getFrontierNetwork(state);
  const discovered = atlas.landmarks.filter((landmark) => landmark.discovered);
  const siteEntries =
    discovered.filter((landmark) => landmark.regionId === atlas.currentRegion?.id).slice(-3).reverse() ||
    [];
  const signature =
    `${atlas.currentRegion?.id || "none"}|${atlas.discoveredRegionCount}/${atlas.totalRegionCount}|` +
    `${frontier.visibleRouteCount}/${frontier.chartedRouteCount}|` +
    frontier.routes.map((route) => `${route.id}:${route.charted}`).join(",") +
    "|" +
    discovered.map((landmark) => landmark.id).join(",");
  if (signature === atlasSnapshot) {
    return;
  }

  atlasSnapshot = signature;
  atlasCount.textContent = `${atlas.discoveredRegionCount}/${atlas.totalRegionCount} regions`;
  regionName.textContent = atlas.currentRegion?.name || "Uncharted";
  regionDetail.textContent = atlas.currentRegion
    ? `${atlas.currentRegion.biome} - ${atlas.currentRegion.detail}`
    : "No survey reading.";
  regionRisk.textContent = atlas.currentRegion
    ? `Hazard ${atlas.currentRegion.hazardLevel}/5 · Settlement ${atlas.currentRegion.settlementPotential}/5`
    : "No frontier metrics.";
  routeCount.textContent = `${frontier.visibleRouteCount}/${frontier.totalRouteCount} routes`;

  routeList.replaceChildren(
    ...frontier.routes.map((route) => {
      const item = document.createElement("li");

      const top = document.createElement("div");
      top.className = "route-top";

      const title = document.createElement("span");
      title.className = "route-title";
      title.textContent = route.gateTitle;

      const status = document.createElement("span");
      status.className = route.charted ? "route-status is-charted" : "route-status is-rumored";
      status.textContent = route.charted ? "Charted" : "Rumored";

      const destination = document.createElement("span");
      destination.className = "route-destination";
      destination.textContent = `${route.destinationName} · ${route.destinationBiome}`;

      const detail = document.createElement("span");
      detail.className = "route-detail";
      detail.textContent = route.charted
        ? `Hazard ${route.threat}/5 · ${route.stability} · ${route.settlementProspect}`
        : `Survey incomplete. Likely corridor toward ${route.destinationName}.`;

      top.append(title, status);
      item.append(top, destination, detail);
      return item;
    })
  );

  landmarkList.replaceChildren(
    ...(siteEntries.length > 0 ? siteEntries : discovered.slice(-3).reverse()).map((landmark) => {
      const item = document.createElement("li");
      const title = document.createElement("span");
      title.className = "landmark-title";
      title.textContent = landmark.title;

      const detail = document.createElement("span");
      detail.className = "landmark-detail";
      detail.textContent = landmark.detail;

      item.append(title, detail);
      return item;
    })
  );
}

function formatObjective(objective, analysis) {
  if (!objective) {
    return "Thread resolved";
  }

  if (analysis.active && !analysis.complete) {
    return `${objective.label} ${Math.round((analysis.progress / analysis.required) * 100)}%`;
  }

  return `${objective.label} ${objective.distance}m`;
}

function updateJournal() {
  const entries = getEvidenceJournal(state);
  const synthesis = getEvidenceSynthesis(state);
  const signature = entries
    .map((entry) => `${entry.id}:${entry.collected}:${entry.collectedAt ?? "none"}`)
    .join("|") + `|${synthesis.phase}:${synthesis.title}`;
  if (signature === journalSnapshot) {
    return;
  }

  journalSnapshot = signature;
  synthesisTitle.textContent = synthesis.title;
  synthesisText.textContent = synthesis.text;
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
