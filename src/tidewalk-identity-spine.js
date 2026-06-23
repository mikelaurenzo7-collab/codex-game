import { getTidewalkAftermathSeeds, formatTidewalkAftermathSeed } from "./tidewalk-aftermath-seeds.js";
import { getTidewalkContactDirectorState } from "./tidewalk-contact-director.js";
import { formatTidewalkFactionLedger, getTidewalkFactionLedger } from "./tidewalk-faction-ledger.js";
import { formatTidewalkWorldPulse, getTidewalkWorldPulse } from "./tidewalk-world-pulse.js";

function getIdentityName({ ledger, pulse }) {
  const contactId = ledger.selectedRow?.contactId || ledger.previewRow?.contactId;
  if (contactId === "black-keel-scout") {
    return pulse.complete ? "Hunted Archive" : "Countermarked Coast";
  }
  if (contactId === "lantern-tender") {
    return pulse.complete ? "Witness-Bound Archive" : "Lantern-Watched Coast";
  }
  return "Unclaimed Tidewalk";
}

export function getTidewalkIdentitySpine(state, input = {}) {
  const director = getTidewalkContactDirectorState(state, input);
  const ledger = getTidewalkFactionLedger(state);
  const pulse = getTidewalkWorldPulse(state);
  const aftermath = getTidewalkAftermathSeeds(state);
  const identityName = getIdentityName({ ledger, pulse });

  return {
    active: director.active || pulse.active || aftermath.active,
    complete: director.complete || pulse.complete || aftermath.complete,
    identityName,
    headline: director.headline,
    objectiveText: director.objectiveText,
    statusText: director.statusText,
    bottomLogText: [director.bottomLogText, formatTidewalkFactionLedger(ledger), formatTidewalkWorldPulse(pulse), formatTidewalkAftermathSeed(aftermath)]
      .filter(Boolean)
      .join("\n"),
    palette: pulse.tideColor,
    hazardPosture: pulse.hazardPosture,
    routePressure: pulse.routePressure,
    primaryAftermath: aftermath.primarySeed,
    director,
    ledger,
    pulse,
    aftermath
  };
}

export function formatTidewalkIdentitySpine(spine = {}) {
  if (!spine.active) {
    return "Tidewalk identity dormant.";
  }

  return `${spine.identityName}: ${spine.headline}. ${spine.routePressure}/${spine.hazardPosture}.`;
}
