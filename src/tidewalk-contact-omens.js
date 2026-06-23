import { getTidewalkContactField } from "./tidewalk-contact-field.js";

const OMENS = {
  "lantern-tender": {
    title: "Witness Line",
    promise: "Dockhands remember who chose safety over speed.",
    cost: "Black-Keel gains one tide-cycle to erase its next mark.",
    worldTag: "trust rises; pursuit cools",
    signal: "+settlement trust"
  },
  "black-keel-scout": {
    title: "Countermark Pursuit",
    promise: "The archive crew reaches the fresh mark before the tide strips it.",
    cost: "The salvage network learns the archive is hunting back.",
    worldTag: "truth accelerates; heat rises",
    signal: "+dangerous evidence"
  }
};

function getOmenForContact(contact, selectedContact) {
  const omen = OMENS[contact.id] || OMENS["lantern-tender"];
  return {
    contactId: contact.id,
    choiceId: contact.choiceId,
    label: contact.label,
    title: omen.title,
    promise: omen.promise,
    cost: omen.cost,
    worldTag: omen.worldTag,
    signal: omen.signal,
    selected: selectedContact?.id === contact.id,
    inRange: Boolean(contact.inRange),
    distance: Number.isFinite(contact.distance) ? Math.round(contact.distance) : null
  };
}

export function getTidewalkContactOmenDeck(state) {
  const field = getTidewalkContactField(state);
  const selectedContact = field.selectedContact;
  const rows = field.contacts.map((contact) => getOmenForContact(contact, selectedContact));

  return {
    active: field.active,
    complete: field.complete,
    title: field.complete ? "Tidewalk line chosen" : field.active ? "The coast is offering two futures" : "Tidewalk futures pending",
    focusOmen: field.focusContact ? getOmenForContact(field.focusContact, selectedContact) : null,
    selectedOmen: selectedContact ? getOmenForContact(selectedContact, selectedContact) : null,
    rows
  };
}

export function formatTidewalkContactOmen(deck = {}) {
  const omen = deck.selectedOmen || deck.focusOmen;
  if (!omen) {
    return deck.title || "Tidewalk futures pending";
  }

  const prefix = omen.selected ? "Chosen" : omen.inRange ? "Ready" : "Forecast";
  return `${prefix}: ${omen.title} — ${omen.promise} Cost: ${omen.cost}`;
}
