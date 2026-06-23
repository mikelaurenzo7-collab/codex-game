import assert from "node:assert/strict";
import { drawTidewalkContacts } from "../src/tidewalk-contact-canvas.js";

function createContext() {
  const calls = [];
  return {
    calls,
    save() { calls.push("save"); },
    restore() { calls.push("restore"); },
    translate() { calls.push("translate"); },
    scale() { calls.push("scale"); },
    beginPath() { calls.push("beginPath"); },
    arc() { calls.push("arc"); },
    fill() { calls.push("fill"); },
    stroke() { calls.push("stroke"); },
    fillRect() { calls.push("fillRect"); },
    moveTo() { calls.push("moveTo"); },
    lineTo() { calls.push("lineTo"); },
    fillText() { calls.push("fillText"); },
    setLineDash() { calls.push("setLineDash"); },
    set fillStyle(value) { calls.push(`fillStyle:${value}`); },
    set strokeStyle(value) { calls.push(`strokeStyle:${value}`); },
    set lineWidth(value) { calls.push(`lineWidth:${value}`); },
    set font(value) { calls.push(`font:${value}`); }
  };
}

function createState({ scene = "tidewalk", x = 1580, y = 260 } = {}) {
  return {
    scene,
    time: 12,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId: null
    }
  };
}

{
  const ctx = createContext();
  const field = drawTidewalkContacts(ctx, createState());
  assert.equal(field.active, true);
  assert.equal(field.actionableContact.id, "lantern-tender");
  assert.equal(ctx.calls.filter((call) => call === "save").length, 2);
  assert.equal(ctx.calls.filter((call) => call === "restore").length, 2);
  assert.ok(ctx.calls.some((call) => call.includes("Hold E to commit")));
}

{
  const ctx = createContext();
  const field = drawTidewalkContacts(ctx, createState({ scene: "archive" }));
  assert.equal(field.active, false);
  assert.equal(ctx.calls.length, 0);
}

console.log("tidewalk contact canvas tests passed");
