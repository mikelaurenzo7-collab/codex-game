import { drawTidewalkContacts } from "./tidewalk-contact-canvas.js";
import { getTidewalkContactField, resolveTidewalkContactAtPlayer } from "./tidewalk-contact-field.js";

export function getTidewalkContactRuntime(state) {
  const field = getTidewalkContactField(state);
  return {
    ...field,
    canCommit: Boolean(field.active && field.actionableContact),
    hudLabel: field.complete && field.selectedContact
      ? `${field.selectedContact.label} chosen`
      : field.instruction
  };
}

export function drawTidewalkContactRuntime(ctx, state) {
  return drawTidewalkContacts(ctx, state);
}

export function commitTidewalkContactFromInput(state, input = {}) {
  const runtime = getTidewalkContactRuntime(state);
  const wantsCommit = Boolean(input.analyze || input.commit || input.interact);
  if (!runtime.canCommit || !wantsCommit) {
    return null;
  }

  return resolveTidewalkContactAtPlayer(state);
}
