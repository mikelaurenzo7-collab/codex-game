import { getTidewalkContactPlan, resolveTidewalkContactChoice } from "./tidewalk-contact.js";

const CONTACT_VISUALS = {
  "lantern-tender": {
    tone: "safe",
    stroke: "rgba(232, 196, 109, 0.92)",
    fill: "rgba(232, 196, 109, 0.18)",
    glyph: "lantern",
    hierarchy: "warm north-pier safe-line contact"
  },
  "black-keel-scout": {
    tone: "threat",
    stroke: "rgba(9, 12, 17, 0.92)",
    fill: "rgba(217, 102, 102, 0.16)",
    glyph: "countermark",
    hierarchy: "cold underpier countermark contact"
  }
};

function isPoint(value) {
  return value && Number.isFinite(value.x) && Number.isFinite(value.y);
}

function contactDistance(player, contact) {
  if (!isPoint(player) || !isPoint(contact?.target)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.hypot(player.x - contact.target.x, player.y - contact.target.y);
}

function buildContactInstruction(contact) {
  if (!contact) {
    return "Move through Tidewalk Coast until a coastal contact comes into range.";
  }

  if (contact.inRange) {
    return `Hold E to commit through ${contact.label}.`;
  }

  return `Move toward ${contact.label}: ${Math.round(contact.distance)}m.`;
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
      visual: { ...(CONTACT_VISUALS[contact.id] || CONTACT_VISUALS["lantern-tender"]) },
      distance,
      inRange: isCoastalScene && plan.active && distance <= contact.radius
    };
  });
  const closestContact = contacts.reduce(
    (closest, contact) => (!closest || contact.distance < closest.distance ? contact : closest),
    null
  );
  const actionableContact = contacts.find((contact) => contact.inRange) || null;
  const focusContact = actionableContact || closestContact;

  return {
    active: isCoastalScene && plan.active,
    complete: plan.complete,
    prompt: plan.prompt,
    instruction: isCoastalScene && plan.active ? buildContactInstruction(focusContact) : plan.prompt,
    selectedContact: plan.selectedContact ? { ...plan.selectedContact, target: { ...plan.selectedContact.target } } : null,
    contacts,
    closestContact,
    actionableContact,
    focusContact,
    objectiveTarget: isCoastalScene && plan.active && focusContact ? { ...focusContact.target } : null
  };
}

export function resolveTidewalkContactAtPlayer(state) {
  const field = getTidewalkContactField(state);
  if (!field.active || !field.actionableContact) {
    return null;
  }

  return resolveTidewalkContactChoice(state, field.actionableContact.id);
}
