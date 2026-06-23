import assert from "node:assert/strict";
import {
  createTidewalkContactGameFrameAdapter,
  drawTidewalkContactClient,
  getTidewalkContactArrivalProjection,
  getTidewalkContactClientState,
  runTidewalkContactFrame,
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
    setLineDash(value = []) { calls.push(`setLineDash:${value.join(",")}`); },
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
  const projection = getTidewalkContactArrivalProjection(createState({ x: 1200, y: 600 }));
  assert.equal(projection.mode, "in-world");
  assert.equal(projection.shouldShowRouteChoice, true);
  assert.equal(projection.suppressLegacyChoiceButtons, true);
  assert.equal(projection.legacyButtonsEnabled, false);
  assert.equal(projection.choices.length, 2);
  assert.ok(projection.choices.every((choice) => choice.disabled));
  assert.ok(projection.choices.some((choice) => choice.actionLabel === "Meet Lantern tender in world"));
  assert.ok(projection.choices.some((choice) => choice.detail.includes("countermark")));
}

{
  const projection = getTidewalkContactArrivalProjection(createState());
  assert.equal(projection.choices.find((choice) => choice.id === "lantern-tender").actionLabel, "Hold E near Lantern tender");
}

{
  const state = createState({ x: 1570, y: 860 });
  const step = stepTidewalkContactClient(state, { analyze: true });
  assert.equal(step.committedContact.id, "black-keel-scout");
  assert.equal(step.invalidateArrival, true);
  assert.equal(step.consumedInput, true);
  assert.equal(step.client.dossier.mode, "resolved");
  assert.equal(step.arrivalProjection.mode, "resolved");
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
  assert.equal(field.pressure.focusContact.id, "black-keel-scout");
  assert.ok(ctx.calls.some((call) => call.includes("Countermark scout")));
  assert.ok(ctx.calls.some((call) => call === "fillText:READY"));
}

{
  const ctx = createContext();
  const state = createState({ x: 1570, y: 860 });
  const frame = runTidewalkContactFrame({ ctx, state, input: { analyze: false } });
  assert.equal(frame.shouldDraw, true);
  assert.equal(frame.shouldInvalidateArrival, false);
  assert.equal(frame.drawnField.actionableContact.id, "black-keel-scout");
  assert.equal(frame.drawnField.pressure.focusContact.id, "black-keel-scout");
  assert.equal(frame.statusText, "Countermark scout contact ready");
  assert.equal(frame.arrivalProjection.suppressLegacyChoiceButtons, true);
  assert.ok(ctx.calls.some((call) => call.includes("Countermark scout")));
}

{
  const ctx = createContext();
  const state = createState({ x: 1580, y: 260 });
  const frame = runTidewalkContactFrame({ ctx, state, input: { analyze: true } });
  assert.equal(frame.committedContact.id, "lantern-tender");
  assert.equal(frame.shouldDraw, false);
  assert.equal(frame.drawnField, null);
  assert.equal(frame.shouldInvalidateHud, true);
  assert.equal(frame.shouldInvalidateArrival, true);
  assert.equal(frame.dossier.mode, "resolved");
  assert.equal(frame.arrivalProjection.mode, "resolved");
  assert.equal(state.frontier.selectedRouteChoiceId, "quay-safe-lantern-line");
}

{
  const calls = [];
  const ctx = createContext();
  const state = createState({ x: 1570, y: 860 });
  const frameAdapter = createTidewalkContactGameFrameAdapter({
    ctx,
    state,
    input: { analyze: true },
    updateGameState(receivedState, receivedInput, dt) {
      calls.push(`update:${dt}:${receivedState === state}:${receivedInput.analyze}`);
    },
    drawGame(contactFrame) {
      calls.push(`draw:${contactFrame.committedContact.id}`);
    },
    updateHud(contactFrame) {
      calls.push(`hud:${contactFrame.shouldInvalidateArrival}`);
    },
    invalidateArrival(contactFrame) {
      calls.push(`invalidate:${contactFrame.committedContact.id}`);
    }
  });

  const frame = frameAdapter(0.25);
  assert.equal(frame.committedContact.id, "black-keel-scout");
  assert.equal(state.frontier.selectedRouteChoiceId, "black-keel-countermark");
  assert.deepEqual(calls, [
    "update:0.25:true:true",
    "invalidate:black-keel-scout",
    "draw:black-keel-scout",
    "hud:true"
  ]);
}

{
  assert.throws(() => runTidewalkContactFrame(), /requires a game state/);
  assert.throws(() => createTidewalkContactGameFrameAdapter(), /requires a game state/);
  assert.throws(
    () => createTidewalkContactGameFrameAdapter({ state: createState() }),
    /requires updateGameState/
  );
}

console.log("tidewalk contact client tests passed");
