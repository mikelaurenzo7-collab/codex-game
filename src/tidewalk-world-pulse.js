import { getTidewalkFactionLedger } from "./tidewalk-faction-ledger.js";

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function getTidewalkWorldPulse(state) {
  const ledger = getTidewalkFactionLedger(state);
  const row = ledger.selectedRow || ledger.previewRow;
  const heat = row ? clamp01((row.heatDelta + 2) / 4) : 0;
  const trust = row ? clamp01((row.trustDelta + 2) / 4) : 0.5;
  const truth = row ? clamp01(row.truthDelta / 2) : 0;
  const mood = ledger.complete
    ? row?.contactId === "black-keel-scout"
      ? "hunted"
      : "witnessed"
    : heat > trust
      ? "threatening"
      : "watchful";

  return {
    active: ledger.active || ledger.complete,
    complete: ledger.complete,
    mood,
    heat,
    trust,
    truth,
    tideColor: mood === "hunted" || mood === "threatening" ? "black-red" : "lantern-gold",
    hazardPosture: heat > 0.65 ? "surging" : trust > 0.65 ? "held-back" : "restless",
    routePressure: truth > 0.75 ? "truth-race" : heat > 0.65 ? "pursuit-risk" : "safe-return",
    ledger
  };
}

export function formatTidewalkWorldPulse(pulse = {}) {
  if (!pulse.active) {
    return "Tidewalk is quiet.";
  }

  return `Tidewalk ${pulse.mood}: tide ${pulse.tideColor}, hazards ${pulse.hazardPosture}, route ${pulse.routePressure}.`;
}
