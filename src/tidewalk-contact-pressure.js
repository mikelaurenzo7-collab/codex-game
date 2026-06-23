import { getTidewalkContactField } from "./tidewalk-contact-field.js";

const PRESSURE_LINES = {
  "lantern-tender": {
    far: "A gold lantern blinks once above the north pier, patient but not passive.",
    near: "The lantern tender lifts the chain: safe passage is close enough to trust.",
    ready: "The lantern tender steadies the line. Hold E to make the safe choice real.",
    committed: "The gold line is knotted. Tidewalk now remembers who was protected."
  },
  "black-keel-scout": {
    far: "Black paint flashes under the lower pilings, then vanishes with the chop.",
    near: "The countermark scout waits half-hidden beside the skiff, daring a closer look.",
    ready: "The countermark is wet and fresh. Hold E to take the dangerous truth.",
    committed: "The countermark is copied. Black-Keel knows the archive looked back."
  }
};

function getBand(contact) {
  if (!contact || !Number.isFinite(contact.distance)) {
    return "far";
  }
  if (contact.inRange) {
    return "ready";
  }
  return contact.distance <= contact.radius * 2.8 ? "near" : "far";
}

function getLine(contact, band) {
  const lines = PRESSURE_LINES[contact?.id] || PRESSURE_LINES["lantern-tender"];
  return lines[band] || lines.far;
}

function getCompetingContact(field) {
  if (!field?.focusContact) {
    return null;
  }
  return field.contacts.find((contact) => contact.id !== field.focusContact.id) || null;
}

export function getTidewalkContactPressure(state) {
  const field = getTidewalkContactField(state);

  if (field.complete && field.selectedContact) {
    return {
      active: false,
      complete: true,
      band: "committed",
      focusContact: field.selectedContact,
      competingContact: null,
      line: getLine(field.selectedContact, "committed"),
      tension: 0,
      pulseHint: null
    };
  }

  if (!field.active || !field.focusContact) {
    return {
      active: false,
      complete: field.complete,
      band: "silent",
      focusContact: null,
      competingContact: null,
      line: field.prompt,
      tension: 0,
      pulseHint: null
    };
  }

  const band = getBand(field.focusContact);
  const competingContact = getCompetingContact(field);
  const competingDistance = Number.isFinite(competingContact?.distance) ? competingContact.distance : field.focusContact.distance;
  const advantage = Math.max(0, competingDistance - field.focusContact.distance);
  const tension = Math.min(1, Math.max(0, 1 - field.focusContact.distance / 900 + advantage / 1200));

  return {
    active: true,
    complete: false,
    band,
    focusContact: field.focusContact,
    competingContact,
    line: getLine(field.focusContact, band),
    tension,
    pulseHint: band === "ready"
      ? `${field.focusContact.label} is ready. The other line will not wait forever.`
      : competingContact
        ? `${competingContact.label} remains visible across the tide.`
        : null
  };
}

export function getTidewalkContactPressureLog(state) {
  const pressure = getTidewalkContactPressure(state);
  if (!pressure.active && !pressure.complete) {
    return null;
  }

  return [pressure.line, pressure.pulseHint].filter(Boolean).join(" ");
}
