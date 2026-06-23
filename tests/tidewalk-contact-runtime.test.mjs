import assert from "node:assert/strict";
import {
  commitTidewalkContactFromInput,
  drawTidewalkContactRuntime,
  getTidewalkContactRuntime
} from "../src/tidewalk-contact-runtime.js";

function createState({ scene = "tidewalk", x = 1580, y = 260 } = {}) {
  return {
    scene,
    time: 16,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId: null
    }
  };
}

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
    fillText(value) { calls.push(`fillText:${value}`); },
    setLineDash() { calls.push("setLineDash"); },
    set fillStyle(value) { calls.push(`fillStyle:${value}`); },
    set strokeStyle(value) { calls.push(`strokeStyle:${value}`); },
    set lineWidth(value) { calls.push(`lineWidth:${value}`); },
    set font(value) { calls.push(`font:${value}`); }
  };
}

{
  const runtime = getTidewalkContactRuntime(createState());
  assert.equal(runtime.active, true);
  assert.equal(runtime.canCommit, true);
  assert.match(runtime.hudLabel, /Hold E/);
}

{
  const state = createState();
  assert.equal(commitTidewalkContactFromInput(state, { analyze: false }), null);
  assert.equal(state.frontier.selectedRouteChoiceId, null);
  const contact = commitTidewalkContactFromInput(state, { analyze: true });
  assert.equal(contact.id, "lantern-tender");
  assert.equal(state.frontier.selectedRouteChoiceId, "quay-safe-lantern-line");
  assert.match(getTidewalkContactRuntime(state).hudLabel, /chosen/);
}

{
  const state = createState({ x: 80, y: 80 });
  assert.equal(getTidewalkContactRuntime(state).canCommit, false);
  assert.equal(commitTidewalkContactFromInput(state, { interact: true }), null);
  assert.equal(state.frontier.selectedRouteChoiceId, null);
}

{
  const ctx = createContext();
  const field = drawTidewalkContactRuntime(ctx, createState({ x: 1570, y: 860 }));
  assert.equal(field.actionableContact.id, "black-keel-scout");
  assert.ok(ctx.calls.some((call) => call.includes("Countermark scout")));
}

console.log("tidewalk contact runtime tests passed");
