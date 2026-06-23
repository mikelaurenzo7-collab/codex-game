export const TIDEWALK_CONTACTS = [
  {
    id: "lantern-tender",
    choiceId: "quay-safe-lantern-line",
    title: "Meet the lantern tender",
    label: "Lantern tender",
    target: { x: 1580, y: 260 },
    radius: 76,
    visualCue: "A low gold lantern chain catches on the tidewind above the north pier.",
    briefing:
      "The tender can stabilize a safe line back to Tidelantern Quay, but Black-Keel gains time to erase its next mark.",
    confirmation:
      "The lantern tender knots the safe line and sends a witness heading back inland."
  },
  {
    id: "black-keel-scout",
    choiceId: "black-keel-countermark",
    title: "Follow the Black-Keel countermark",
    label: "Countermark scout",
    target: { x: 1570, y: 860 },
    radius: 76,
    visualCue: "Fresh black paint bleeds beneath the lower pilings beside a half-sunk skiff.",
    briefing:
      "The scout can trace Black-Keel immediately, but taking the mark makes the archive crew visible to the salvage network.",
    confirmation:
      "The countermark is copied before the tide strips it away, opening the Black-Keel pursuit."
  }
];

export function getTidewalkContactPlan({ surveyedSiteIds = [], selectedChoiceId = null } = {}) {
  const completedSiteIds = Array.isArray(surveyedSiteIds) ? surveyedSiteIds : [];
  const surveyComplete = ["north-spool-house", "lamp-black-warehouse"].every((id) => completedSiteIds.includes(id));
  const selectedContact = TIDEWALK_CONTACTS.find((contact) => contact.choiceId === selectedChoiceId) || null;

  return {
    active: surveyComplete && !selectedContact,
    complete: Boolean(selectedContact),
    selectedContact,
    prompt: selectedContact
      ? `${selectedContact.label} resolved: ${selectedContact.confirmation}`
      : surveyComplete
        ? "At Brinehook Low Piers, choose who receives the recovered warehouse truth."
        : "Survey both drowned warehouses before the coast exposes competing contacts.",
    contacts: TIDEWALK_CONTACTS.map((contact) => ({ ...contact, target: { ...contact.target } }))
  };
}

export function resolveTidewalkContactChoice(state, contactId) {
  const frontier = state?.frontier;
  if (!frontier || !Array.isArray(frontier.surveyedSiteIds) || frontier.selectedRouteChoiceId) {
    return null;
  }

  const plan = getTidewalkContactPlan(frontier);
  if (!plan.active) {
    return null;
  }

  const contact = TIDEWALK_CONTACTS.find((candidate) => candidate.id === contactId);
  if (!contact) {
    return null;
  }

  frontier.selectedRouteChoiceId = contact.choiceId;
  frontier.lastRouteChoice = {
    contactId: contact.id,
    choiceId: contact.choiceId,
    label: contact.label,
    chosenAt: Number.isFinite(state.time) ? state.time : 0
  };
  state.clueLog ||= [];
  state.clueLog.push(`Tidewalk contact resolved: ${contact.label}`);
  state.clueLog.push(contact.confirmation);
  return contact;
}
