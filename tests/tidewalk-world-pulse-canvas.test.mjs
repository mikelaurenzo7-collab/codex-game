import assert from "node:assert/strict";
import { drawTidewalkWorldPulseOverlay } from "../src/tidewalk-world-pulse-canvas.js";

function createContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push("save"); },
    restore() { calls.push("restore"); },
    fillRect() { calls.push("fillRect"); },
    beginPath() { calls.push("beginPath"); },
    moveTo() { calls.push("moveTo"); },
    bezierCurveTo() { calls.push("bezierCurveTo"); },
    stroke() { calls.push("stroke"); },
    fillText(value) { calls.push(`fillText:${value}`); },
    set fillStyle(value) { calls.push(`fillStyle:${value}`); },
    set strokeStyle(value) { calls.push(`strokeStyle:${value}`); },
    set lineWidth(value) { calls.push(`lineWidth:${value}`); },
    set font(value) { calls.push(`font:${value}`); }
  };
}

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 90,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const ctx = createContext();
  const pulse = drawTidewalkWorldPulseOverlay(ctx, createState(), { width: 960, height: 600 });
  assert.equal(pulse.active, true);
  assert.equal(pulse.tideColor, "lantern-gold");
  assert.ok(ctx.calls.includes("save"));
  assert.ok(ctx.calls.some((call) => call.includes("LANTERN WAKE")));
}

{
  const ctx = createContext();
  const pulse = drawTidewalkWorldPulseOverlay(ctx, createState({ x: 1570, y: 860 }), { width: 960, height: 600 });
  assert.equal(pulse.tideColor, "black-red");
  assert.ok(ctx.calls.some((call) => call.includes("BLACK TIDE")));
  assert.ok(ctx.calls.some((call) => call === "lineWidth:6"));
}

{
  const ctx = createContext();
  const pulse = drawTidewalkWorldPulseOverlay(ctx, createState({ scene: "archive" }));
  assert.equal(pulse.active, false);
  assert.equal(ctx.calls.length, 0);
}

console.log("tidewalk world pulse canvas tests passed");
