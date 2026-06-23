import {
  drawTidewalkContactRuntime,
  getTidewalkContactRuntime,
  stepTidewalkContactRuntime
} from "./tidewalk-contact-runtime.js";

function buildContactStatus(runtime, input = {}) {
  if (runtime.complete && runtime.selectedContact) {
    return `${runtime.selectedContact.label} chosen`;
  }

  if (!runtime.active) {
    return runtime.hudLabel;
  }

  if (runtime.canCommit && input.analyze) {
    return `Committing through ${runtime.actionableContact.label}`;
  }

  if (runtime.canCommit) {
    return `${runtime.actionableContact.label} contact ready`;
  }

  return runtime.instruction;
}

function buildContactDossier(runtime) {
  if (runtime.complete && runtime.selectedContact) {
    return {
      title: `Selected: ${runtime.selectedContact.label}`,
      text: runtime.prompt,
      mode: "resolved"
    };
  }

  if (runtime.active) {
    return {
      title: "Choose a coastal contact in the world",
      text: runtime.instruction,
      mode: "in-world"
    };
  }

  return {
    title: "Coastal contact pending",
    text: runtime.prompt,
    mode: "pending"
  };
}

function buildContactChoiceRows(runtime) {
  return runtime.contacts.map((contact) => ({
    id: contact.id,
    choiceId: contact.choiceId,
    label: contact.label,
    title: contact.title,
    distance: Number.isFinite(contact.distance) ? Math.round(contact.distance) : null,
    inRange: Boolean(contact.inRange),
    selected: runtime.selectedContact?.id === contact.id,
    disabled: true,
    actionLabel: runtime.selectedContact?.id === contact.id
      ? `${contact.label} selected`
      : contact.inRange
        ? `Hold E near ${contact.label}`
        : `Meet ${contact.label} in world`,
    detail: contact.inRange
      ? contact.briefing
      : `${contact.visual.hierarchy}; ${contact.visualCue}`
  }));
}

export function getTidewalkContactClientState(state, input = {}) {
  const runtime = getTidewalkContactRuntime(state);

  return {
    runtime,
    shouldRender: runtime.active,
    canCommit: runtime.canCommit,
    statusText: buildContactStatus(runtime, input),
    objectiveText: runtime.active ? runtime.instruction : runtime.hudLabel,
    dossier: buildContactDossier(runtime)
  };
}

export function getTidewalkContactArrivalProjection(state, input = {}) {
  const client = getTidewalkContactClientState(state, input);
  const runtime = client.runtime;
  const mode = client.dossier.mode;

  return {
    mode,
    title: client.dossier.title,
    text: client.dossier.text,
    statusText: client.statusText,
    objectiveText: client.objectiveText,
    shouldShowRouteChoice: runtime.active || runtime.complete,
    suppressLegacyChoiceButtons: runtime.active && !runtime.complete,
    legacyButtonsEnabled: false,
    choices: buildContactChoiceRows(runtime)
  };
}

export function stepTidewalkContactClient(state, input = {}) {
  const step = stepTidewalkContactRuntime(state, input);

  return {
    ...step,
    client: getTidewalkContactClientState(state, input),
    arrivalProjection: getTidewalkContactArrivalProjection(state, input),
    invalidateArrival: step.shouldRefreshHud,
    consumedInput: step.consumedInput
  };
}

export function drawTidewalkContactClient(ctx, state) {
  return drawTidewalkContactRuntime(ctx, state);
}

export function runTidewalkContactFrame({ ctx = null, state, input = {}, draw = true } = {}) {
  if (!state) {
    throw new TypeError("runTidewalkContactFrame requires a game state");
  }

  const step = stepTidewalkContactClient(state, input);
  const client = step.client;
  const drawnField = draw && ctx && client.shouldRender ? drawTidewalkContactClient(ctx, state) : null;

  return {
    ...step,
    client,
    drawnField,
    shouldDraw: Boolean(client.shouldRender),
    shouldInvalidateHud: Boolean(step.invalidateArrival),
    shouldInvalidateArrival: Boolean(step.invalidateArrival),
    statusText: client.statusText,
    objectiveText: client.objectiveText,
    dossier: client.dossier,
    arrivalProjection: step.arrivalProjection
  };
}

export function createTidewalkContactGameFrameAdapter({
  state,
  input,
  ctx = null,
  updateGameState,
  drawGame,
  updateHud,
  invalidateArrival,
  drawContacts = true
} = {}) {
  if (!state) {
    throw new TypeError("createTidewalkContactGameFrameAdapter requires a game state");
  }
  if (typeof updateGameState !== "function") {
    throw new TypeError("createTidewalkContactGameFrameAdapter requires updateGameState");
  }
  if (typeof drawGame !== "function") {
    throw new TypeError("createTidewalkContactGameFrameAdapter requires drawGame");
  }
  if (typeof updateHud !== "function") {
    throw new TypeError("createTidewalkContactGameFrameAdapter requires updateHud");
  }

  return function runGameFrame(dt) {
    updateGameState(state, input, dt);
    const contactFrame = runTidewalkContactFrame({ ctx, state, input, draw: drawContacts });

    if (contactFrame.shouldInvalidateArrival && typeof invalidateArrival === "function") {
      invalidateArrival(contactFrame);
    }

    drawGame(contactFrame);
    updateHud(contactFrame);
    return contactFrame;
  };
}
