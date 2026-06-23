import {
  CONTACT_CHOICES,
  CONTACT_HOLD_SECONDS,
  CONTACT_RADIUS,
  createContactChoiceState,
  getContactChoiceStatus,
  moveContactChoicePlayer,
  updateContactChoiceState
} from "./tidewalk-contact-choice-state.js";

const canvas = document.querySelector("#contactCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.querySelector("#contactStatus");
const detailText = document.querySelector("#contactDetail");
const input = { up: false, down: false, left: false, right: false, analyze: false };
const state = createContactChoiceState();
let lastTime = performance.now();

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
});

window.addEventListener("keyup", (event) => {
  const mapped = keyMap.get(event.code);
  if (mapped) {
    input[mapped] = false;
    event.preventDefault();
  }
});

requestAnimationFrame(frame);

function frame(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  moveContactChoicePlayer(state, input, dt);
  updateContactChoiceState(state, input, dt);
  draw();
  updateHud();
  requestAnimationFrame(frame);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCoastalFloor();
  drawContacts();
  drawPlayer();
}

function drawCoastalFloor() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#081419");
  gradient.addColorStop(0.55, "#123036");
  gradient.addColorStop(1, "#1e1718");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(232, 196, 109, 0.08)";
  for (let x = 80; x < canvas.width; x += 140) {
    ctx.fillRect(x, 90, 8, 520);
  }

  ctx.strokeStyle = "rgba(98, 214, 184, 0.12)";
  ctx.lineWidth = 3;
  for (let y = 160; y < canvas.height; y += 110) {
    ctx.beginPath();
    ctx.moveTo(55, y + Math.sin(y) * 12);
    ctx.bezierCurveTo(330, y - 40, 820, y + 50, 1225, y - 18);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(6, 16, 19, 0.45)";
  ctx.fillRect(610, 185, 145, 390);
  ctx.fillRect(930, 330, 175, 250);
}

function drawContacts() {
  const status = getContactChoiceStatus(state);
  for (const choice of status.choices) {
    const progress = Math.min(1, choice.progress / CONTACT_HOLD_SECONDS);
    ctx.save();
    ctx.translate(choice.target.x, choice.target.y);
    ctx.fillStyle = choice.id === "quay-safe-lantern-line" ? "rgba(232, 196, 109, 0.16)" : "rgba(217, 102, 102, 0.16)";
    ctx.strokeStyle = choice.inRange ? "rgba(243, 240, 220, 0.95)" : "rgba(243, 240, 220, 0.35)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, CONTACT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = choice.id === "quay-safe-lantern-line" ? "#e8c46d" : "#d96666";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, CONTACT_RADIUS + 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.fillStyle = "#f3f0dc";
    ctx.font = "700 18px system-ui, sans-serif";
    ctx.fillText(choice.label, 106, -10);
    ctx.fillStyle = "rgba(243, 240, 220, 0.74)";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(choice.contactName, 106, 14);
    ctx.restore();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.fillStyle = "#f3f0dc";
  ctx.strokeStyle = "#071114";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(98, 214, 184, 0.78)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 31, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function updateHud() {
  const status = getContactChoiceStatus(state);
  if (status.selectedChoice) {
    statusText.textContent = `Committed: ${status.selectedChoice.label}`;
    detailText.textContent = `${status.selectedChoice.reward} ${status.selectedChoice.consequence}`;
    return;
  }

  const nearest = status.choices
    .slice()
    .sort((a, b) => Math.hypot(state.player.x - a.target.x, state.player.y - a.target.y) - Math.hypot(state.player.x - b.target.x, state.player.y - b.target.y))[0];
  statusText.textContent = nearest.inRange ? nearest.prompt : "Move to a coastal contact. Hold E in a decision ring to commit.";
  detailText.textContent = `Visual target: ${nearest.visualTone}`;
}
