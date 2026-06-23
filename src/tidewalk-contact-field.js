import { getTidewalkContactPlan, resolveTidewalkContactChoice } from "./tidewalk-contact.js";

function isPoint(value) {
  return value && Number.isFinite(value.x) && Number.isFinite(value.y);
}

function contactDistance(player, contact) {
  if (!isPoint(player) || !isPoint(contact?.target)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.hypot(player.x - contact.target.x, player.y - contact.target.y);
}

export function getTidewalkContactField(state) {
  const plan = getTidewalkContactPlan(state?.frontier || {});
  const player = state?.player;
  const isCoastalScene = state?.scene === "tidewalk";
  const contacts = plan.contacts.map((contact) => {
    const distance = contactDistance(player, contact);
    return {
      ...contact,
      target: { ...contact.target },
      distance,
      inRange: isCoastalScene && plan.active && distance <= contact.radius
    };
  });
  const closestContact = contacts.reduce(
    (closest, contact) => (!closest || contact.distance < closest.distance ? contact : closest),
    null
  );
  const actionableContact = contacts.find((contact) => contact.inRange) || null;

  return {
    active: isCoastalScene && plan.active,
    complete: plan.complete,
    prompt: plan.prompt,
    selectedContact: plan.selectedContact ? { ...plan.selectedContact, target: { ...plan.selectedContact.target } } : null,
    contacts,
    closestContact,
    actionableContact
  };
}

export function resolveTidewalkContactAtPlayer(state) {
  const field = getTidewalkContactField(state);
  if (!field.active || !field.actionableContact) {
    return null;
  }

  return resolveTidewalkContactChoice(state, field.actionableContact.id);
}
