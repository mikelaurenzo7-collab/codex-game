import {
  WORLD,
  createGameCheckpoint,
  collectedFragmentCount,
  createGameState,
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
  getActiveObjective,
  resolveFrontierEncounter,
  restoreGameCheckpoint,
  triggerPulse,
  updateGameState
} from "./game-state.js";
import {
  getTidewalkPlayableCommitmentStage,
  stepTidewalkPlayableCommitmentStage,
  shouldBlockLegacyTidewalkRouteClick
} from "./tidewalk-playable-commitment.js";
import { drawTidewalkContactClient } from "./tidewalk-contact-client.js";


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
const arrivalPanel = document.querySelector("#arrivalPanel");
const arrivalRoute = document.querySelector("#arrivalRoute");
const arrivalTitle = document.querySelector("#arrivalTitle");
const arrivalSummary = document.querySelector("#arrivalSummary");
const arrivalEncounterTitle = document.querySelector("#arrivalEncounterTitle");
const arrivalEncounterText = document.querySelector("#arrivalEncounterText");
const arrivalSettlementName = document.querySelector("#arrivalSettlementName");
const arrivalSettlementText = document.querySelector("#arrivalSettlementText");
const arrivalResourceTitle = document.querySelector("#arrivalResourceTitle");
const arrivalResourceText = document.querySelector("#arrivalResourceText");
const arrivalNextHook = document.querySelector("#arrivalNextHook");
const arrivalAction = document.querySelector("#arrivalAction");
const arrivalActionButton = document.querySelector("#arrivalActionButton");
const arrivalActionNote = document.querySelector("#arrivalActionNote");
const arrivalSurvey = document.querySelector("#arrivalSurvey");
const arrivalSurveyTitle = document.querySelector("#arrivalSurveyTitle");
const arrivalSurveyText = document.querySelector("#arrivalSurveyText");
const arrivalSurveyList = document.querySelector("#arrivalSurveyList");
const arrivalRouteChoice = document.querySelector("#arrivalRouteChoice");
const arrivalRouteChoiceTitle = document.querySelector("#arrivalRouteChoiceTitle");
const arrivalRouteChoiceText = document.querySelector("#arrivalRouteChoiceText");
const arrivalRouteChoiceList = document.querySelector("#arrivalRouteChoiceList");
const arrivalStorylet = document.querySelector("#arrivalStorylet");
const arrivalStoryletTitle = document.querySelector("#arrivalStoryletTitle");
const arrivalStoryletHeadline = document.querySelector("#arrivalStoryletHeadline");
const arrivalStoryletOpening = document.querySelector("#arrivalStoryletOpening");
const arrivalStoryletTwist = document.querySelector("#arrivalStoryletTwist");
const arrivalStoryletReward = document.querySelector("#arrivalStoryletReward");
const arrivalStoryletNextHook = document.querySelector("#arrivalStoryletNextHook");
const restartButton = document.querySelector("#restartButton");
const checkpointButton = document.querySelector("#checkpointButton");
const checkpointStatus = document.querySelector("#checkpointStatus");
const primerPanel = document.querySelector("#primerPanel");
const primerTitle = document.querySelector("#primerTitle");
const primerText = document.querySelector("#primerText");
const primerDismiss = document.querySelector("#primerDismiss");

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  analyze: false
};

const CHECKPOINT_KEY = "frontier-deep-green.checkpoint";
let checkpointMessage = "Fresh expedition";
let state = loadCheckpoint();
let lastTime = performance.now();
let journalSnapshot = "";
let atlasSnapshot = "";
let arrivalSnapshot = "";
let primerDismissed = false;

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

primerDismiss.addEventListener("click", () => {
  primerDismissed = true;
  primerPanel.classList.add("is-hidden");
});
arrivalActionButton.addEventListener("click", () => {
  const encounter = getFrontierEncounter(state);
  if (resolveFrontierEncounter(state, encounter.id)) {
    arrivalSnapshot = "";
    updateHud();
  }
});
arrivalRouteChoiceList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-choice-id]");
  if (!button) {
    return;
  }

  if (shouldBlockLegacyTidewalkRouteClick(state)) {
    return;
  }

  if (chooseFrontierRoute(state, button.dataset.choiceId)) {
    arrivalSnapshot = "";
    updateHud();
  }
});
restartButton.addEventListener("click", restart);
checkpointButton.addEventListener("click", saveCheckpoint);
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(frame);

function restart() {
  localStorage.removeItem(CHECKPOINT_KEY);
  state = createGameState();
  checkpointMessage = "Checkpoint cleared";
  lastTime = performance.now();
  journalSnapshot = "";
  atlasSnapshot = "";
  arrivalSnapshot = "";
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
  stepTidewalkPlayableCommitmentStage(state, input, { draw: false });
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
  const tidewalkSurvey = getTidewalkSurveyField(state);

  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);

  ctx.save();
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(-camera.x, -camera.y);

  if (state.scene === "tidewalk" && tidewalkSurvey.active && tidewalkSurvey.phase === "field") {
    drawTidewalkSurveyScene(tidewalkSurvey);
  } else if (state.scene === "tidewalk") {
    drawTidewalkScene();
    const stage = getTidewalkPlayableCommitmentStage(state);
    if (stage.active && stage.shouldRenderContacts) {
      drawTidewalkContactClient(ctx, state);
    }
  } else {
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
    drawFrontierTraverse();
    drawFrontierCoastalOperation();
    drawEchoes();
    drawObstacles();
  }
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
    const gateColor = route.traversed
      ? "#62d6b8"
      : route.charted
        ? "#e8c46d"
        : "rgba(98, 214, 184, 0.46)";
    const haloColor = route.traversed
      ? "rgba(98, 214, 184, 0.24)"
      : route.charted
        ? "rgba(232, 196, 109, 0.24)"
        : "rgba(98, 214, 184, 0.12)";

    ctx.save();
    ctx.translate(route.gate.x, route.gate.y);
    ctx.fillStyle = "rgba(6, 16, 19, 0.72)";
    ctx.strokeStyle = gateColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-10, -12);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = haloColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, route.traversed ? 34 : route.charted ? 28 : 20, 0, Math.PI * 2);
    ctx.stroke();

    if (route.charted || route.traversed) {
      ctx.fillStyle = "rgba(243, 240, 220, 0.82)";
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillText(route.destinationName, 24, 4);
    }

    if (route.traversed) {
      ctx.fillStyle = "rgba(98, 214, 184, 0.88)";
      ctx.font = "700 11px system-ui, sans-serif";
      ctx.fillText("Linked", 24, -12);
    }

    ctx.restore();
  }
}

function drawFrontierTraverse() {
  const traverse = getFrontierTraverse(state);
  if (!traverse.active || !traverse.route) {
    return;
  }

  const progress = traverse.progress / traverse.required;
  ctx.save();
  ctx.translate(traverse.route.gate.x, traverse.route.gate.y);

  if (traverse.complete) {
    ctx.strokeStyle = "rgba(98, 214, 184, 0.92)";
    ctx.lineWidth = 6;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, WORLD.frontierTraverseRadius + 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(98, 214, 184, 0.18)";
    ctx.beginPath();
    ctx.arc(0, 0, WORLD.frontierTraverseRadius - 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = traverse.inRange ? "rgba(98, 214, 184, 0.92)" : "rgba(98, 214, 184, 0.36)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      WORLD.frontierTraverseRadius,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * progress
    );
    ctx.stroke();
    ctx.strokeStyle = "rgba(232, 196, 109, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, WORLD.frontierTraverseRadius + 14, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(243, 240, 220, 0.82)";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillText(traverse.route.destinationName, 26, 22);
  ctx.restore();
}

function loadCheckpoint() {
  const serialized = localStorage.getItem(CHECKPOINT_KEY);
  if (!serialized) {
    return createGameState();
  }

  try {
    checkpointMessage = "Checkpoint resumed";
    return restoreGameCheckpoint(serialized);
  } catch (error) {
    console.warn("Discarding invalid game checkpoint", error);
    localStorage.removeItem(CHECKPOINT_KEY);
    checkpointMessage = "Invalid checkpoint cleared";
    return createGameState();
  }
}

function saveCheckpoint() {
  try {
    localStorage.setItem(CHECKPOINT_KEY, createGameCheckpoint(state));
    checkpointMessage = state.scene === "tidewalk" ? "Brinehook checkpoint saved" : "Archive checkpoint saved";
  } catch (error) {
    console.warn("Unable to save game checkpoint", error);
    checkpointMessage = "Checkpoint unavailable";
  }
  updateHud();
}

function drawTidewalkScene() {
  const expedition = getTidewalkExpedition(state);
  ctx.fillStyle = "#102a30";
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  const tide = ctx.createLinearGradient(0, 0, WORLD.width, WORLD.height);
  tide.addColorStop(0, "rgba(40, 112, 118, 0.18)");
  tide.addColorStop(0.55, "rgba(5, 18, 23, 0.68)");
  tide.addColorStop(1, "rgba(44, 92, 86, 0.2)");
  ctx.fillStyle = tide;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.strokeStyle = "rgba(232, 196, 109, 0.16)";
  ctx.lineWidth = 5;
  for (let y = 110; y < WORLD.height; y += 135) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(440, y - 70, 980, y + 75, WORLD.width, y - 20);
    ctx.stroke();
  }

  const isBrinehook = state.frontier?.tidewalkExpedition?.launched && !state.frontier?.tidewalkExpedition?.complete;
  if (isBrinehook) {
    for (const pier of BRINEHOOK_SCENE.piers) {
      ctx.fillStyle = "rgba(42, 38, 30, 0.72)";
      ctx.fillRect(pier.x, pier.y, pier.width, pier.height);
      ctx.strokeStyle = "rgba(80, 68, 50, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(pier.x, pier.y, pier.width, pier.height);
    }
  }

  if (expedition.choiceId === "quay-safe-lantern-line") {
    ctx.save();
    ctx.translate(expedition.leadTarget.x, expedition.leadTarget.y);
    ctx.fillStyle = "rgba(232, 196, 109, 0.15)";
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(232, 196, 109, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
    ctx.restore();
  }

  for (const hazard of expedition.hazards) {
    const suppressed = expedition.tideStilled;
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.fillStyle = suppressed ? "rgba(98, 214, 184, 0.08)" : "rgba(4, 8, 13, 0.62)";
    ctx.strokeStyle = suppressed ? "rgba(98, 214, 184, 0.46)" : "rgba(217, 102, 102, 0.48)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, hazard.radius + Math.sin(state.time * 3 + hazard.x) * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  for (const obstacle of expedition.obstacles) {
    ctx.fillStyle = "#334344";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "rgba(232, 196, 109, 0.09)";
    ctx.fillRect(obstacle.x + 6, obstacle.y + 6, obstacle.width - 12, obstacle.height - 12);
  }

  const progressState = state.frontier?.tidewalkExpedition;
  if (progressState && progressState.sentinel) {
    const sentinel = progressState.sentinel;
    ctx.save();
    ctx.translate(sentinel.x, sentinel.y);
    const stunned = sentinel.stunUntil > state.time;
    ctx.fillStyle = stunned ? "rgba(98, 214, 184, 0.3)" : "rgba(224, 76, 76, 0.85)";
    ctx.strokeStyle = stunned ? "rgba(98, 214, 184, 0.8)" : "rgba(255, 120, 120, 0.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 12);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (!stunned) {
      ctx.strokeStyle = "rgba(224, 76, 76, 0.15)";
      ctx.beginPath();
      ctx.arc(0, 0, 250, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (progressState && progressState.cargoItems) {
    for (const cargo of progressState.cargoItems) {
      if (!cargo.collected && cargo.revealed) {
        ctx.save();
        ctx.translate(cargo.x, cargo.y);
        ctx.fillStyle = "rgba(232, 196, 109, 0.8)";
        ctx.shadowColor = "rgba(232, 196, 109, 0.6)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.rect(-6, -6, 12, 12);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const progress = expedition.progress / expedition.required;
  ctx.save();
  ctx.translate(expedition.target.x, expedition.target.y);
  ctx.fillStyle = "rgba(6, 16, 19, 0.76)";
  ctx.strokeStyle = expedition.inRange ? "#e8c46d" : "rgba(232, 196, 109, 0.48)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, WORLD.coastalOperationRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.lineTo(0, 0);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f3f0dc";
  ctx.font = "700 14px system-ui, sans-serif";
  ctx.fillText(expedition.label, 28, -18);
  ctx.restore();
}

function drawTidewalkSurveyScene(tidewalkSurvey) {
  ctx.fillStyle = "#11292c";
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  const tide = ctx.createLinearGradient(0, 0, WORLD.width, WORLD.height);
  tide.addColorStop(0, "rgba(28, 108, 104, 0.16)");
  tide.addColorStop(0.55, "rgba(4, 17, 21, 0.7)");
  tide.addColorStop(1, "rgba(58, 95, 80, 0.2)");
  ctx.fillStyle = tide;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.strokeStyle = "rgba(98, 214, 184, 0.12)";
  ctx.lineWidth = 4;
  for (let y = 120; y < WORLD.height; y += 140) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(380, y - 90, 960, y + 72, WORLD.width, y - 24);
    ctx.stroke();
  }

  for (const hazard of tidewalkSurvey.hazards) {
    const suppressed = tidewalkSurvey.tideStilled;
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.fillStyle = suppressed ? "rgba(98, 214, 184, 0.08)" : "rgba(4, 8, 13, 0.62)";
    ctx.strokeStyle = suppressed ? "rgba(98, 214, 184, 0.46)" : "rgba(217, 102, 102, 0.48)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, hazard.radius + Math.sin(state.time * 3 + hazard.x) * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  for (const obstacle of tidewalkSurvey.obstacles) {
    ctx.fillStyle = "#334344";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "rgba(98, 214, 184, 0.1)";
    ctx.fillRect(obstacle.x + 6, obstacle.y + 6, obstacle.width - 12, obstacle.height - 12);
  }

  const activeSiteId = tidewalkSurvey.nextSite?.id || null;
  for (const site of tidewalkSurvey.sites) {
    if (!site.target) {
      continue;
    }

    const active = site.id === activeSiteId;
    const progress = active ? tidewalkSurvey.progress / tidewalkSurvey.required : 0;
    ctx.save();
    ctx.translate(site.target.x, site.target.y);

    if (site.completed) {
      ctx.strokeStyle = "rgba(98, 214, 184, 0.9)";
      ctx.lineWidth = 6;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, WORLD.tidewalkSurveyRadius - 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(98, 214, 184, 0.14)";
      ctx.beginPath();
      ctx.arc(0, 0, WORLD.tidewalkSurveyRadius - 22, 0, Math.PI * 2);
      ctx.fill();
    } else if (active) {
      ctx.fillStyle = "rgba(6, 16, 19, 0.76)";
      ctx.strokeStyle = tidewalkSurvey.inRange ? "#e8c46d" : "rgba(232, 196, 109, 0.48)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        WORLD.tidewalkSurveyRadius,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * progress
      );
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.strokeStyle = "rgba(243, 240, 220, 0.28)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, WORLD.tidewalkSurveyRadius - 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#f3f0dc";
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.fillText(site.label, 28, -18);
    ctx.fillStyle = site.completed ? "rgba(98, 214, 184, 0.86)" : active ? "#e8c46d" : "rgba(243, 240, 220, 0.7)";
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.fillText(site.completed ? "Surveyed" : active ? "Active ring" : "Pending", 28, 2);
    ctx.restore();
  }
}

function drawFrontierCoastalOperation() {
  const operation = getFrontierCoastalOperation(state);
  if (!operation.active) {
    return;
  }

  const progress = operation.progress / operation.required;
  ctx.save();
  ctx.translate(operation.gate.x, operation.gate.y);

  if (operation.complete) {
    ctx.strokeStyle = "rgba(232, 196, 109, 0.9)";
    ctx.lineWidth = 6;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, WORLD.coastalOperationRadius + 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(232, 196, 109, 0.14)";
    ctx.beginPath();
    ctx.arc(0, 0, WORLD.coastalOperationRadius - 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = operation.inRange ? "rgba(232, 196, 109, 0.92)" : "rgba(232, 196, 109, 0.38)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      WORLD.coastalOperationRadius,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * progress
    );
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(243, 240, 220, 0.86)";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillText(operation.mapLabel, 26, -14);
  ctx.restore();
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
  checkpointStatus.textContent = checkpointMessage;
  const stage = getTidewalkPlayableCommitmentStage(state);
  const objective = getActiveObjective(state);
  const synthesis = getEvidenceSynthesis(state);
  const analysis = getFieldAnalysis(state);
  const traverse = getFrontierTraverse(state);
  const arrival = getFrontierArrival(state);
  const encounter = getFrontierEncounter(state);
  const survey = getFrontierSurvey(state);
  const tidewalkSurvey = getTidewalkSurveyField(state);
  const routeChoice = getFrontierRouteChoice(state);
  const storylet = getBlackKeelStorylet(state);
  const coastalOperation = getFrontierCoastalOperation(state);
  const expedition = getTidewalkExpedition(state);
  signalFill.style.width = `${Math.round(state.signal)}%`;
  const tidePhase = state.frontier?.tide?.phase ? ` (${state.frontier.tide.phase.toUpperCase()} TIDE)` : "";
  fragmentReadout.textContent =
    state.scene === "tidewalk" && tidewalkSurvey.active && tidewalkSurvey.phase === "field"
      ? `Tidewalk Coast Survey ${tidewalkSurvey.completedCount}/${tidewalkSurvey.totalSiteCount}${tidePhase}`
      : state.scene === "tidewalk"
        ? `Brinehook Low Piers${tidePhase}`
        : `Fragments ${collectedFragmentCount(state)}/${state.fragments.length}`;
  objectiveReadout.textContent = stage.active
    ? stage.objectiveText
    : formatObjective(
        objective,
        analysis,
        traverse,
        encounter,
        survey,
        tidewalkSurvey,
        routeChoice,
        storylet,
        coastalOperation,
        expedition
      );
  updateJournal();
  updateAtlas();
  if (state.scene === "tidewalk") {
    arrivalPanel.classList.add("is-hidden");
    arrivalSnapshot = "tidewalk-hidden";
  } else {
    updateArrival(arrival, encounter, survey, tidewalkSurvey, routeChoice, storylet, coastalOperation);
  }
  updatePrimer(
    synthesis,
    analysis,
    traverse,
    encounter,
    survey,
    tidewalkSurvey,
    routeChoice,
    storylet,
    coastalOperation,
    expedition,
    stage
  );

  if (state.status !== "running") {
    statusReadout.textContent = state.result;
  } else if (stage.active) {
    statusReadout.textContent = stage.statusText;
  } else if (tidewalkSurvey.active && tidewalkSurvey.phase === "field" && tidewalkSurvey.inRange && input.analyze) {
    statusReadout.textContent = `${tidewalkSurvey.title} ${Math.round((tidewalkSurvey.progress / tidewalkSurvey.required) * 100)}%`;
  } else if (tidewalkSurvey.active && tidewalkSurvey.phase === "field") {
    statusReadout.textContent = tidewalkSurvey.tideStilled ? "Black tide suppressed" : "Tidewalk survey underway";
  } else if (tidewalkSurvey.active && tidewalkSurvey.inRange) {
    statusReadout.textContent = "Survey descent ready";
  } else if (tidewalkSurvey.active) {
    statusReadout.textContent = "Return to Coastline Lift";
  } else if (expedition.active && !expedition.complete && expedition.inRange && input.analyze) {
    statusReadout.textContent = `${expedition.title} ${Math.round((expedition.progress / expedition.required) * 100)}%`;
  } else if (expedition.active && !expedition.complete && expedition.phase === "field") {
    statusReadout.textContent = expedition.tideStilled ? "Black tide suppressed" : "Brinehook Low Piers";
  } else if (expedition.active && !expedition.complete) {
    statusReadout.textContent = "Tidewalk descent ready";
  } else if (expedition.active && expedition.complete) {
    statusReadout.textContent = expedition.completionTitle;
  } else if (state.gate.unlocked) {
    statusReadout.textContent = "Gate unlocked";
  } else if (coastalOperation.active && coastalOperation.complete) {
    statusReadout.textContent = coastalOperation.completionTitle;
  } else if (coastalOperation.active && coastalOperation.inRange && input.analyze) {
    statusReadout.textContent = `${coastalOperation.title} ${Math.round((coastalOperation.progress / coastalOperation.required) * 100)}%`;
  } else if (coastalOperation.active && coastalOperation.inRange) {
    statusReadout.textContent = `${coastalOperation.gateTitle} field op ready`;
  } else if (coastalOperation.active) {
    statusReadout.textContent = `Return to ${coastalOperation.gateTitle}`;
  } else if (storylet.active) {
    statusReadout.textContent = "Black-Keel fallout active";
  } else if (routeChoice.active && !routeChoice.selectedChoice) {
    statusReadout.textContent = "Choose Tidewalk route";
  } else if (survey.active && survey.complete) {
    statusReadout.textContent = "Coastal threat mapped";
  } else if (survey.active) {
    statusReadout.textContent = "Coastal survey ready";
  } else if (encounter.active && encounter.resolved) {
    statusReadout.textContent = "Docking compact secured";
  } else if (encounter.active) {
    statusReadout.textContent = "Arrival encounter ready";
  } else if (traverse.active && !traverse.complete && traverse.inRange && input.analyze) {
    statusReadout.textContent = `Traversing ${Math.round((traverse.progress / traverse.required) * 100)}%`;
  } else if (traverse.active && traverse.complete) {
    statusReadout.textContent = "Frontier link secured";
  } else if (traverse.active && traverse.inRange) {
    statusReadout.textContent = "Frontier gate ready";
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

function updateArrival(arrival, encounter, survey, tidewalkSurvey, routeChoice, storylet, coastalOperation) {
  if (!arrival.active) {
    arrivalPanel.classList.add("is-hidden");
    arrivalSnapshot = "hidden";
    return;
  }

  const signature = [
    arrival.routeId,
    arrival.destinationName,
    arrival.title,
    arrival.encounterTitle,
    arrival.encounterText,
    arrival.resourceTitle,
    arrival.resourceText,
    arrival.nextHook,
    encounter.id || "none",
    encounter.resolved,
    encounter.note || "none",
    survey.active,
    survey.complete,
    survey.sites.map((site) => `${site.id}:${site.completed}`).join(","),
    tidewalkSurvey.active,
    tidewalkSurvey.phase || "none",
    routeChoice.active,
    routeChoice.selectedChoice?.id || "none",
    storylet.active,
    storylet.id || "none",
    coastalOperation.active,
    coastalOperation.id || "none",
    coastalOperation.complete
  ].join("|");

  if (signature === arrivalSnapshot) {
    return;
  }

  arrivalSnapshot = signature;
  arrivalPanel.classList.remove("is-hidden");
  arrivalRoute.textContent = `${arrival.destinationName} - ${arrival.destinationBiome}`;
  arrivalTitle.textContent = arrival.title;
  arrivalSummary.textContent = arrival.summary;
  arrivalEncounterTitle.textContent = arrival.encounterTitle;
  arrivalEncounterText.textContent = arrival.encounterText;
  arrivalSettlementName.textContent = arrival.settlementName;
  arrivalSettlementText.textContent = arrival.settlementText;
  arrivalResourceTitle.textContent = arrival.resourceTitle;
  arrivalResourceText.textContent = arrival.resourceText;
  arrivalNextHook.textContent = arrival.nextHook;

  if (!encounter.active) {
    arrivalAction.classList.add("is-hidden");
    arrivalSurvey.classList.add("is-hidden");
    arrivalRouteChoice.classList.add("is-hidden");
    arrivalStorylet.classList.add("is-hidden");
    return;
  }

  arrivalAction.classList.remove("is-hidden");
  arrivalActionButton.disabled = encounter.resolved;
  arrivalActionButton.textContent = encounter.resolved ? "Docking rights secured" : encounter.actionLabel;
  arrivalActionNote.textContent = encounter.note;

  if (!survey.active) {
    arrivalSurvey.classList.add("is-hidden");
    arrivalRouteChoice.classList.add("is-hidden");
    arrivalStorylet.classList.add("is-hidden");
    return;
  }

  arrivalSurvey.classList.remove("is-hidden");
  arrivalSurveyTitle.textContent = `${survey.title} ${survey.completedCount}/${survey.totalSiteCount}`;
  arrivalSurveyText.textContent = survey.complete
    ? survey.resourceText
    : tidewalkSurvey.phase === "field"
      ? `On foot in Tidewalk Coast. Hold E inside the survey ring at ${tidewalkSurvey.nextSite.title}; Space stalls black tide long enough to work.`
      : "Return to the Coastline Lift and hold E to descend into Tidewalk Coast. Survey progress now resolves on foot instead of from dossier buttons.";
  arrivalSurveyList.replaceChildren(
    ...survey.sites.map((site) => {
      const item = document.createElement("li");
      item.className = "arrival-survey-item";

      const title = document.createElement("span");
      title.className = "arrival-block-title";
      title.textContent = site.title;

      const status = document.createElement("span");
      status.className = `arrival-survey-status ${site.completed ? "is-complete" : tidewalkSurvey.nextSite?.id === site.id ? "is-active" : "is-pending"}`;
      status.textContent = site.completed
        ? "Surveyed on foot"
        : tidewalkSurvey.nextSite?.id === site.id
          ? tidewalkSurvey.phase === "field"
            ? "Active in Tidewalk Coast"
            : "Awaiting descent"
          : "Pending";

      const detail = document.createElement("span");
      detail.className = "arrival-survey-detail";
      detail.textContent = site.completed ? site.result : site.briefing;

      item.append(title, status, detail);
      return item;
    })
  );

  if (!routeChoice.active) {
    arrivalRouteChoice.classList.add("is-hidden");
    arrivalStorylet.classList.add("is-hidden");
    return;
  }

  arrivalRouteChoice.classList.remove("is-hidden");
  const stage = getTidewalkPlayableCommitmentStage(state);
  const useProjection = stage.active && stage.dossierProjection;

  arrivalRouteChoiceTitle.textContent = useProjection
    ? stage.dossierProjection.title
    : routeChoice.selectedChoice
      ? `Selected: ${routeChoice.selectedChoice.label}`
      : "Choose a coastal line";
  arrivalRouteChoiceText.textContent = useProjection
    ? stage.dossierProjection.text
    : routeChoice.prompt;

  const choicesToRender = useProjection ? stage.dossierProjection.choices : routeChoice.choices;

  arrivalRouteChoiceList.replaceChildren(
    ...choicesToRender.map((choice) => {
      const item = document.createElement("li");
      item.className = "arrival-survey-item";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "arrival-action-button";
      button.dataset.choiceId = choice.choiceId || choice.id;
      button.disabled = useProjection ? choice.disabled : Boolean(routeChoice.selectedChoice);
      button.textContent = useProjection
        ? choice.actionLabel
        : routeChoice.selectedChoice
          ? choice.selected
            ? `${choice.label} selected`
            : choice.label
          : `Choose ${choice.label}`;

      const detail = document.createElement("span");
      detail.className = "arrival-choice-detail";
      detail.textContent = useProjection
        ? choice.detail
        : `Risk ${choice.risk}/5 | ${choice.reward} | ${choice.consequence}`;

      item.append(button, detail);
      return item;
    })
  );

  if (!storylet.active) {
    arrivalStorylet.classList.add("is-hidden");
    return;
  }

  arrivalStorylet.classList.remove("is-hidden");
  arrivalStoryletTitle.textContent = storylet.title;
  arrivalStoryletHeadline.textContent = storylet.headline;
  arrivalStoryletOpening.textContent = storylet.opening;
  arrivalStoryletTwist.textContent = storylet.twist;
  arrivalStoryletReward.textContent = `Reward: ${storylet.reward}`;
  arrivalStoryletNextHook.textContent = `Next hook: ${storylet.nextHook}`;
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
    `${frontier.visibleRouteCount}/${frontier.chartedRouteCount}/${frontier.launchedRouteCount}|` +
    frontier.routes.map((route) => `${route.id}:${route.charted}:${route.traversed}`).join(",") +
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
  routeCount.textContent = `${frontier.visibleRouteCount}/${frontier.totalRouteCount} routes · ${frontier.launchedRouteCount} linked`;

  routeList.replaceChildren(
    ...frontier.routes.map((route) => {
      const item = document.createElement("li");

      const top = document.createElement("div");
      top.className = "route-top";

      const title = document.createElement("span");
      title.className = "route-title";
      title.textContent = route.gateTitle;

      const status = document.createElement("span");
      if (route.traversed) {
        status.className = "route-status is-charted";
        status.textContent = "Linked";
      } else if (route.charted) {
        status.className = "route-status is-charted";
        status.textContent = "Charted";
      } else {
        status.className = "route-status is-rumored";
        status.textContent = "Rumored";
      }

      const destination = document.createElement("span");
      destination.className = "route-destination";
      destination.textContent = `${route.destinationName} · ${route.destinationBiome}`;

      const detail = document.createElement("span");
      detail.className = "route-detail";
      if (route.traversed) {
        detail.textContent = `Frontier link secured · ${route.destinationName} staged beyond archive edge.`;
      } else if (route.canTraverse) {
        detail.textContent = `Hold E at gate to launch · Hazard ${route.threat}/5 · ${route.stability} · ${route.settlementProspect}`;
      } else if (route.charted) {
        detail.textContent = `Hazard ${route.threat}/5 · ${route.stability} · ${route.settlementProspect}`;
      } else {
        detail.textContent = `Survey incomplete. Likely corridor toward ${route.destinationName}.`;
      }

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

function updatePrimer(
  synthesis,
  analysis,
  traverse,
  encounter,
  survey,
  tidewalkSurvey,
  routeChoice,
  storylet,
  coastalOperation,
  expedition,
  stage
) {
  if (primerDismissed) {
    primerPanel.classList.add("is-hidden");
    return;
  }

  primerPanel.classList.remove("is-hidden");

  if (state.status !== "running") {
    primerTitle.textContent = state.status === "complete" ? "Thread recovered" : "Signal lost";
    primerText.textContent =
      state.status === "complete"
        ? "You cleared the archive loop. Restart to rerun the slice or keep scanning the atlas for frontier prospects."
        : "Echo pressure or overuse drained your signal. Restart, pulse more deliberately, and use relays to recover.";
    return;
  }

  if (stage && stage.active && !stage.complete) {
    primerTitle.textContent = stage.dossierProjection?.title || "Choose a coastal contact";
    primerText.textContent = stage.objectiveText || "Find the contacts at the pier and hold E to commit.";
    return;
  }

  if (state.gate.unlocked) {
    primerTitle.textContent = "Extraction is open";
    primerText.textContent = "All fragments are recovered. Head for the extraction cairn to complete the archive thread.";
    return;
  }

  if (tidewalkSurvey.active && tidewalkSurvey.phase === "field") {
    primerTitle.textContent = tidewalkSurvey.title;
    primerText.textContent = tidewalkSurvey.inRange
      ? "Hold E inside the survey ring to log this warehouse. Space suppresses black tide while you work."
      : "Cross Tidewalk Coast and reach the next warehouse ring. Black tide drains signal until you pulse it back.";
    return;
  }

  if (tidewalkSurvey.active && tidewalkSurvey.phase === "launch") {
    primerTitle.textContent = "Descend to Tidewalk Coast";
    primerText.textContent = tidewalkSurvey.inRange
      ? "Hold E at the Coastline Lift to enter the warehouse survey route."
      : "Return to the Coastline Lift to continue the coastal survey on foot.";
    return;
  }

  if (expedition.active && expedition.complete) {
    primerTitle.textContent = expedition.completionTitle;
    primerText.textContent = expedition.completionText;
    return;
  }

  if (expedition.active && expedition.phase === "field") {
    primerTitle.textContent = expedition.title;
    primerText.textContent = expedition.inRange
      ? "Hold E to resolve the lead and return inland."
      : "Cross the low piers. Black tide drains signal; Space suppresses it briefly.";
    return;
  }

  if (expedition.active && expedition.phase === "launch") {
    primerTitle.textContent = "Descend to Tidewalk Coast";
    primerText.textContent = expedition.inRange
      ? "Hold E to enter the Brinehook Low Piers micro-scene."
      : "Return to the Coastline Lift to launch the resolved coastal lead.";
    return;
  }

  if (coastalOperation.active && coastalOperation.complete) {
    primerTitle.textContent = coastalOperation.completionTitle;
    primerText.textContent = coastalOperation.nextHook;
    return;
  }

  if (coastalOperation.active && coastalOperation.inRange) {
    primerTitle.textContent = coastalOperation.title;
    primerText.textContent = `Hold E at ${coastalOperation.gateTitle} to advance this frontier lead.`;
    return;
  }

  if (coastalOperation.active) {
    primerTitle.textContent = `Return to ${coastalOperation.gateTitle}`;
    primerText.textContent = coastalOperation.briefing;
    return;
  }

  if (storylet.active) {
    primerTitle.textContent = storylet.title;
    primerText.textContent = `Tidewalk Coast now has consequence. ${storylet.nextHook}`;
    return;
  }

  if (routeChoice.active && !routeChoice.selectedChoice) {
    primerTitle.textContent = "Choose the Tidewalk line";
    primerText.textContent = "The hostile salvage mark is confirmed. Use the arrival dossier to commit to the safer lantern line or the riskier countermark pursuit.";
    return;
  }

  if (survey.active && survey.complete) {
    primerTitle.textContent = "Coastal threat identified";
    primerText.textContent = "The warehouse survey exposed a hostile salvage mark. Choose a Tidewalk route so the coast produces real faction fallout instead of a stalled lead.";
    return;
  }

  if (survey.active && survey.nextSite) {
    primerTitle.textContent = "Continue the coastal survey";
    primerText.textContent = `Return to the Coastline Lift, descend into Tidewalk Coast, and survey ${survey.nextSite.title} in person.`;
    return;
  }

  if (encounter.active && encounter.resolved) {
    primerTitle.textContent = "Docking rights secured";
    primerText.textContent = "Tidelantern Quay now accepts archive salvage traffic. The coast hook points toward the drowned warehouses.";
    return;
  }

  if (encounter.active) {
    primerTitle.textContent = "First edge encounter";
    primerText.textContent = "Use the arrival panel to secure docking rights and turn the linked route into a settlement foothold.";
    return;
  }

  if (traverse.active && traverse.complete) {
    primerTitle.textContent = "Frontier link secured";
    primerText.textContent = `The ${traverse.route.destinationName} route is now staged. Use the atlas to identify the next frontier gate worth linking.`;
    return;
  }

  if (traverse.active && traverse.inRange) {
    primerTitle.textContent = `Launch ${traverse.route.destinationName}`;
    primerText.textContent = "Hold E at this charted gate to complete the off-map traversal link and mark the route as secured.";
    return;
  }

  if (analysis.active && analysis.inRange && !analysis.complete) {
    primerTitle.textContent = "Analyze the deduction";
    primerText.textContent = "Hold E inside the analysis ring to resolve the deduced site and expose the final memory safely.";
    return;
  }

  if (analysis.active && !analysis.complete) {
    primerTitle.textContent = "Close the gap";
    primerText.textContent = "The evidence points to a specific site. Move into the analysis ring, then hold E to resolve it.";
    return;
  }

  if (synthesis.phase === "deduced") {
    primerTitle.textContent = "The archive has a target";
    primerText.textContent = "Two clues now agree. Follow the objective marker to the deduced site and prepare to analyze it.";
    return;
  }

  if (synthesis.phase === "cross-check") {
    primerTitle.textContent = "Cross-check the evidence";
    primerText.textContent = "One fragment is not enough. Reveal and recover another memory so the archive can triangulate the missing truth.";
    return;
  }

  if (state.fragments.some((fragment) => fragment.revealedUntil > state.time && !fragment.collected)) {
    primerTitle.textContent = "Memory exposed";
    primerText.textContent = "A pulse just revealed a hidden fragment. Move onto the exposed signal before the reveal window closes.";
    return;
  }

  primerTitle.textContent = "Read the archive under pressure";
  primerText.textContent = "Sweep the archive, use Space to pulse for hidden memory, and conserve signal until the evidence begins to connect.";
}

function formatObjective(
  objective,
  analysis,
  traverse,
  encounter,
  survey,
  tidewalkSurvey,
  routeChoice,
  storylet,
  coastalOperation,
  expedition
) {
  if (tidewalkSurvey.active) {
    const progress = Math.round((tidewalkSurvey.progress / tidewalkSurvey.required) * 100);
    return tidewalkSurvey.inRange
      ? `${tidewalkSurvey.title} ${progress}%`
      : `${tidewalkSurvey.title} ${Math.round(distanceBetween(state.player, tidewalkSurvey.target))}m`;
  }

  if (expedition.active && !expedition.complete) {
    const progress = Math.round((expedition.progress / expedition.required) * 100);
    return expedition.inRange
      ? `${expedition.title} ${progress}%`
      : `${expedition.title} ${Math.round(distanceBetween(state.player, expedition.target))}m`;
  }

  if (expedition.active && expedition.complete) {
    return expedition.completionTitle;
  }

  if (coastalOperation.active) {
    if (coastalOperation.complete) {
      return coastalOperation.completionTitle;
    }

    if (coastalOperation.inRange) {
      return `${coastalOperation.title} ${Math.round((coastalOperation.progress / coastalOperation.required) * 100)}%`;
    }

    return `${coastalOperation.title} ${Math.round(distanceBetween(state.player, coastalOperation.gate))}m`;
  }

  if (storylet.active) {
    return storylet.selectedChoice.id === "black-keel-countermark"
      ? "Shadow Black-Keel cache lead"
      : "Question lantern tender witness";
  }

  if (routeChoice.active && !routeChoice.selectedChoice) {
    return "Choose Tidewalk route";
  }

  if (survey.active && survey.complete) {
    return "Commit Tidewalk route";
  }

  if (survey.active && survey.nextSite) {
    return `Survey ${survey.nextSite.title}`;
  }

  if (encounter.active && encounter.resolved) {
    return "Review coastal survey map";
  }

  if (encounter.active) {
    return encounter.actionLabel;
  }

  if (traverse.active && traverse.route) {
    if (traverse.complete) {
      return `Frontier link secured · ${traverse.route.destinationName}`;
    }

    if (traverse.inRange) {
      return `Traverse ${traverse.route.destinationName} ${Math.round((traverse.progress / traverse.required) * 100)}%`;
    }

    return `Traverse ${traverse.route.destinationName} ${Math.round(distanceBetween(state.player, traverse.route.gate))}m`;
  }

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

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
