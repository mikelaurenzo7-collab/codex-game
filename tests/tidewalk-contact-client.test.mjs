import assert from "node:assert/strict";
import {
  drawTidewalkContactClient,
  getTidewalkContactClientState,
  stepTidewalkContactClient
} from "../src/tidewalk-contact-client.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 20,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
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
  const client = getTidewalkContactClientState(createState());
  assert.equal(client.shouldRender, true);
  assert.equal(client.canCommit, true);
  assert.equal(client.statusText, "Lantern tender contact ready");
  assert.equal(client.dossier.mode, "in-world");
  assert.match(client.dossier.text, /Hold E/);
}

{
  const client = getTidewalkContactClientState(createState(), { analyze: true });
  assert.equal(client.statusText, "Committing through Lantern tender");
}

{
  const state = createState({ x: 1570, y: 860 });
  const step = stepTidewalkContactClient(state, { analyze: true });
  assert.equal(step.committedContact.id, "black-keel-scout");
  assert.equal(step.invalidateArrival, true);
  assert.equal(step.consumedInput, true);
  assert.equal(step.client.dossier.mode, "resolved");
  assert.match(step.client.statusText, /chosen/);
  assert.equal(state.frontier.selectedRouteChoiceId, "black-keel-countermark");
}

{
  const state = createState({ scene: "archive" });
  const client = getTidewalkContactClientState(state);
  assert.equal(client.shouldRender, false);
  assert.equal(client.dossier.mode, "pending");
}

{
  const ctx = createContext();
  const field = drawTidewalkContactClient(ctx, createState({ x: 1570, y: 860 }));
  assert.equal(field.actionableContact.id, "black-keel-scout");
  assert.ok(ctx.calls.some((call) => call.includes("Countermark scout")));
}

console.log("tidewalk contact client tests passed");
