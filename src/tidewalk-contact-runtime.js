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

function wantsContactCommit(input = {}) {
  return Boolean(input.analyze || input.commit || input.interact);
}

export function commitTidewalkContactFromInput(state, input = {}) {
  const runtime = getTidewalkContactRuntime(state);
  if (!runtime.canCommit || !wantsContactCommit(input)) {
    return null;
  }

  return resolveTidewalkContactAtPlayer(state);
}

export function stepTidewalkContactRuntime(state, input = {}) {
  const before = getTidewalkContactRuntime(state);
  const committedContact = commitTidewalkContactFromInput(state, input);
  const after = committedContact ? getTidewalkContactRuntime(state) : before;

  return {
    before,
    after,
    committedContact,
    consumedInput: Boolean(committedContact && wantsContactCommit(input)),
    shouldRefreshHud: Boolean(committedContact)
  };
}
