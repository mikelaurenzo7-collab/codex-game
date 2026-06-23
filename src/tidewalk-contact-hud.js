import { getTidewalkContactArrivalProjection, getTidewalkContactClientState } from "./tidewalk-contact-client.js";

export function getTidewalkContactHudBridge(state, input = {}) {
  const client = getTidewalkContactClientState(state, input);
  const arrivalProjection = getTidewalkContactArrivalProjection(state, input);
  const runtime = client.runtime;

  return {
    active: runtime.active,
    complete: runtime.complete,
    shouldOverrideObjective: runtime.active,
    shouldOverrideStatus: runtime.active || runtime.complete,
    objectiveText: runtime.active ? client.objectiveText : null,
    statusText: runtime.active || runtime.complete ? client.statusText : null,
    arrivalProjection,
    shouldHideLegacyRouteButtons: arrivalProjection.suppressLegacyChoiceButtons,
    selectedContactLabel: runtime.selectedContact?.label || null,
    actionableContactLabel: runtime.actionableContact?.label || null
  };
}

export function applyTidewalkContactHudBridge({ state, input = {}, objectiveReadout, statusReadout } = {}) {
  if (!state) {
    throw new TypeError("applyTidewalkContactHudBridge requires a game state");
  }

  const bridge = getTidewalkContactHudBridge(state, input);

  if (bridge.shouldOverrideObjective && objectiveReadout) {
    objectiveReadout.textContent = bridge.objectiveText;
  }

  if (bridge.shouldOverrideStatus && statusReadout) {
    statusReadout.textContent = bridge.statusText;
  }

  return bridge;
}
