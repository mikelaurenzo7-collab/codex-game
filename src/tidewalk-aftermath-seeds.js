import { getTidewalkFactionLedger } from "./tidewalk-faction-ledger.js";
import { getTidewalkWorldPulse } from "./tidewalk-world-pulse.js";

const AFTERMATH = {
  "lantern-tender": [
    {
      id: "quay-witness-choir",
      title: "Quay Witness Choir",
      hook: "Three dockhands offer names if the archive keeps the witness line lit.",
      unlock: "trust-led investigation"
    },
    {
      id: "burned-countermark-gap",
      title: "Burned Countermark Gap",
      hook: "Black-Keel erased one mark; the absence itself becomes the next clue.",
      unlock: "negative-space clue hunt"
    }
  ],
  "black-keel-scout": [
    {
      id: "salvage-net-wakes",
      title: "Salvage Net Wakes",
      hook: "A skiff shadows the archive route back inland, forcing a hunted return.",
      unlock: "pursuit encounter"
    },
    {
      id: "fresh-mark-map",
      title: "Fresh Mark Map",
      hook: "The copied countermark points toward a route no lantern tender would bless.",
      unlock: "dangerous shortcut"
    }
  ]
};

export function getTidewalkAftermathSeeds(state) {
  const ledger = getTidewalkFactionLedger(state);
  const pulse = getTidewalkWorldPulse(state);
  const contactId = ledger.selectedRow?.contactId || ledger.previewRow?.contactId || "lantern-tender";
  const seeds = (AFTERMATH[contactId] || AFTERMATH["lantern-tender"]).map((seed, index) => ({
    ...seed,
    priority: ledger.complete ? index + 1 : index + 3,
    armed: Boolean(ledger.complete),
    mood: pulse.mood
  }));

  return {
    active: ledger.active || ledger.complete,
    complete: ledger.complete,
    contactId,
    mood: pulse.mood,
    seeds,
    primarySeed: seeds[0] || null
  };
}

export function formatTidewalkAftermathSeed(deck = {}) {
  if (!deck.active || !deck.primarySeed) {
    return "No Tidewalk aftermath armed.";
  }

  const state = deck.primarySeed.armed ? "Armed" : "Foreshadowed";
  return `${state}: ${deck.primarySeed.title} — ${deck.primarySeed.hook}`;
}
