import { runTidewalkContactFrame } from "./tidewalk-contact-client.js";
import { getTidewalkIdentitySpine, formatTidewalkIdentitySpine } from "./tidewalk-identity-spine.js";

function buildDossierProjection(contactProjection, spine) {
  if (!contactProjection?.shouldShowRouteChoice) {
    return null;
  }

  return {
    title: contactProjection.title,
    text: contactProjection.text,
    statusText: contactProjection.statusText,
    objectiveText: contactProjection.objectiveText,
    identityName: spine.identityName,
    identityText: formatTidewalkIdentitySpine(spine),
    suppressLegacyChoiceButtons: true,
    choices: contactProjection.choices.map((choice) => ({
      ...choice,
      disabled: true,
      actionLabel: choice.selected ? choice.actionLabel : choice.inRange ? choice.actionLabel : `Find ${choice.label} on Tidewalk Coast`
    }))
  };
}

export function getTidewalkPlayableCommitmentStage(state, input = {}) {
  const spine = getTidewalkIdentitySpine(state, input);
  const frame = runTidewalkContactFrame({ state, input, draw: false });
  const projection = buildDossierProjection(frame.arrivalProjection, spine);

  return {
    active: Boolean(frame.client.shouldRender || spine.active),
    complete: Boolean(spine.complete || frame.client.runtime.complete),
    shouldRenderContacts: Boolean(frame.shouldDraw),
    shouldInvalidateHud: Boolean(frame.shouldInvalidateHud),
    shouldSuppressLegacyRouteButtons: Boolean(projection?.suppressLegacyChoiceButtons),
    committedContact: frame.committedContact,
    objectiveText: frame.objectiveText || spine.objectiveText,
    statusText: frame.statusText || spine.statusText,
    bottomLogText: spine.bottomLogText,
    identityText: formatTidewalkIdentitySpine(spine),
    dossierProjection: projection,
    contactFrame: frame,
    spine
  };
}

export function stepTidewalkPlayableCommitmentStage(state, input = {}, { ctx = null, draw = true } = {}) {
  const spineBefore = getTidewalkIdentitySpine(state, input);
  const frame = runTidewalkContactFrame({ ctx, state, input, draw });
  const spineAfter = getTidewalkIdentitySpine(state, input);
  const projection = buildDossierProjection(frame.arrivalProjection, spineAfter);

  return {
    active: Boolean(frame.client.shouldRender || spineAfter.active),
    complete: Boolean(spineAfter.complete || frame.client.runtime.complete),
    identityChanged: spineBefore.identityName !== spineAfter.identityName,
    shouldRenderContacts: Boolean(frame.shouldDraw),
    shouldInvalidateHud: Boolean(frame.shouldInvalidateHud || spineBefore.identityName !== spineAfter.identityName),
    shouldSuppressLegacyRouteButtons: Boolean(projection?.suppressLegacyChoiceButtons),
    committedContact: frame.committedContact,
    objectiveText: frame.objectiveText || spineAfter.objectiveText,
    statusText: frame.statusText || spineAfter.statusText,
    bottomLogText: spineAfter.bottomLogText,
    identityText: formatTidewalkIdentitySpine(spineAfter),
    dossierProjection: projection,
    contactFrame: frame,
    spine: spineAfter
  };
}
