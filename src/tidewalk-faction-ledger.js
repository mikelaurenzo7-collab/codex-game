import { getTidewalkContactOmenDeck } from "./tidewalk-contact-omens.js";

const LEDGER_RULES = {
  "lantern-tender": {
    trustDelta: 2,
    heatDelta: -1,
    truthDelta: 0,
    scar: "The quay remembers the archive protected witnesses before chasing marks.",
    debt: "Black-Keel spends the extra tide-cycle burning one clue trail."
  },
  "black-keel-scout": {
    trustDelta: -1,
    heatDelta: 2,
    truthDelta: 2,
    scar: "The archive is now visible to the salvage network it chose to stalk.",
    debt: "Tidelantern dockhands whisper that safety was traded for a fresh mark."
  }
};

function rowForOmen(omen) {
  const rule = LEDGER_RULES[omen.contactId] || LEDGER_RULES["lantern-tender"];
  return {
    contactId: omen.contactId,
    choiceId: omen.choiceId,
    label: omen.label,
    selected: omen.selected,
    trustDelta: rule.trustDelta,
    heatDelta: rule.heatDelta,
    truthDelta: rule.truthDelta,
    scar: rule.scar,
    debt: rule.debt,
    summary: `${omen.label}: trust ${rule.trustDelta >= 0 ? "+" : ""}${rule.trustDelta}, heat ${rule.heatDelta >= 0 ? "+" : ""}${rule.heatDelta}, truth ${rule.truthDelta >= 0 ? "+" : ""}${rule.truthDelta}`
  };
}

export function getTidewalkFactionLedger(state) {
  const deck = getTidewalkContactOmenDeck(state);
  const rows = deck.rows.map(rowForOmen);
  const selectedRow = rows.find((row) => row.selected) || null;
  const previewRow = selectedRow || (deck.focusOmen ? rowForOmen(deck.focusOmen) : rows[0] || null);

  return {
    active: deck.active,
    complete: deck.complete,
    title: selectedRow ? "Faction debt recorded" : deck.active ? "Faction debts previewed" : "Faction ledger dormant",
    selectedRow,
    previewRow,
    rows,
    net: selectedRow
      ? { trust: selectedRow.trustDelta, heat: selectedRow.heatDelta, truth: selectedRow.truthDelta }
      : null
  };
}

export function formatTidewalkFactionLedger(ledger = {}) {
  const row = ledger.selectedRow || ledger.previewRow;
  if (!row) {
    return ledger.title || "Faction ledger dormant";
  }

  return `${ledger.title}: ${row.summary}. ${ledger.complete ? row.scar : row.debt}`;
}
