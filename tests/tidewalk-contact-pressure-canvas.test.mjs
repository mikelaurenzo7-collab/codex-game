import assert from "node:assert/strict";
import { drawTidewalkContactPressureAura } from "../src/tidewalk-contact-pressure-canvas.js";

function createContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push("save"); },
    restore() { calls.push("restore"); },
    translate() { calls.push("translate"); },
    beginPath() { calls.push("beginPath"); },
    arc() { calls.push("arc"); },
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
  assert.ok(ctx.calls.includes("save"));
  assert.ok(ctx.calls.includes("restore"));
  assert.ok(ctx.calls.some((call) => call === "fillText:READY"));
  assert.ok(ctx.calls.some((call) => call.startsWith("dash:")));
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
