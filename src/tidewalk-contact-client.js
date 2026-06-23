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

export function stepTidewalkContactClient(state, input = {}) {
  const step = stepTidewalkContactRuntime(state, input);

  return {
    ...step,
    client: getTidewalkContactClientState(state, input),
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
    dossier: client.dossier
  };
}
