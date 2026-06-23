import assert from "node:assert/strict";
import { drawTidewalkContactPressureAura } from "../src/tidewalk-contact-pressure-canvas.js";

function createContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push("save"); },
    restore() { calls.push("restore"); },
    translate(x, y) { calls.push(`translate:${x},${y}`); },
    beginPath() { calls.push("beginPath"); },
    arc(_x, _y, radius) { calls.push(`arc:${Math.round(radius)}`); },
    fill() { calls.push("fill"); },
    stroke() { calls.push("stroke"); },
    fillText(value) { calls.push(`fillText:${value}`); },
    setLineDash(value) { calls.push(`dash:${value.join(",")}`); },
    set fillStyle(value) { calls.push(`fillStyle:${value}`); },
    set strokeStyle(value) { calls.push(`strokeStyle:${value}`); },
    set lineWidth(value) { calls.push(`lineWidth:${value}`); },
    set font(value) { calls.push(`font:${value}`); }
  };
}

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 30,
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
  const pressure = drawTidewalkContactPressureAura(ctx, createState());
  assert.equal(pressure.active, true);
  assert.equal(pressure.band, "ready");
  assert.equal(pressure.focusContact.id, "lantern-tender");
  assert.ok(ctx.calls.includes("save"));
  assert.ok(ctx.calls.includes("restore"));
  assert.ok(ctx.calls.some((call) => call === "fillText:READY"));
  assert.ok(ctx.calls.some((call) => call.startsWith("dash:12,8")));
  assert.ok(ctx.calls.some((call) => call.startsWith("strokeStyle:rgba(232, 196, 109")));
  assert.ok(ctx.calls.some((call) => call === "lineWidth:5"));
}

{
  const ctx = createContext();
  const pressure = drawTidewalkContactPressureAura(ctx, createState({ x: 1570, y: 860 }));
  assert.equal(pressure.active, true);
  assert.equal(pressure.band, "ready");
  assert.equal(pressure.focusContact.id, "black-keel-scout");
  assert.ok(ctx.calls.some((call) => call.startsWith("dash:6,10")));
  assert.ok(ctx.calls.some((call) => call.startsWith("strokeStyle:rgba(217, 102, 102")));
}

{
  const ctx = createContext();
  const pressure = drawTidewalkContactPressureAura(ctx, createState({ scene: "archive" }));
  assert.equal(pressure.active, false);
  assert.equal(ctx.calls.length, 0);
}

{
  const ctx = createContext();
  const pressure = drawTidewalkContactPressureAura(ctx, createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(pressure.complete, true);
  assert.equal(ctx.calls.length, 0);
}

console.log("tidewalk contact pressure canvas tests passed");
