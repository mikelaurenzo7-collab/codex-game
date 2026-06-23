import { getTidewalkContactHudBridge } from "./tidewalk-contact-hud.js";
import { formatTidewalkContactOmen, getTidewalkContactOmenDeck } from "./tidewalk-contact-omens.js";
import { getTidewalkContactPressure, getTidewalkContactPressureLog } from "./tidewalk-contact-pressure.js";

function chooseHeadline(pressure, omenDeck) {
  if (pressure.complete) {
    return `Line committed: ${pressure.focusContact?.label || "Tidewalk contact"}`;
  }

  if (pressure.active && pressure.band === "ready") {
    return `Commit window: ${pressure.focusContact.label}`;
  }

  if (pressure.active && omenDeck.focusOmen) {
    return `${omenDeck.focusOmen.title}: ${omenDeck.focusOmen.worldTag}`;
  }

  return omenDeck.title;
}

export function getTidewalkContactDirectorState(state, input = {}) {
  const hud = getTidewalkContactHudBridge(state, input);
  const pressure = getTidewalkContactPressure(state);
  const omenDeck = getTidewalkContactOmenDeck(state);
  const pressureLog = getTidewalkContactPressureLog(state);
  const omenLine = formatTidewalkContactOmen(omenDeck);

  return {
    active: pressure.active || hud.active,
    complete: pressure.complete || hud.complete,
    headline: chooseHeadline(pressure, omenDeck),
    objectiveText: hud.objectiveText || omenLine,
    statusText: hud.statusText || pressureLog || omenLine,
    bottomLogText: pressureLog || omenLine,
    shouldOverrideObjective: hud.shouldOverrideObjective,
    shouldOverrideStatus: hud.shouldOverrideStatus,
    shouldSuppressLegacyRouteButtons: hud.shouldHideLegacyRouteButtons,
    pressure,
    omenDeck,
    hud
  };
}

export function applyTidewalkContactDirector({ state, input = {}, objectiveReadout, statusReadout, logSink } = {}) {
  if (!state) {
    throw new TypeError("applyTidewalkContactDirector requires a game state");
  }

  const director = getTidewalkContactDirectorState(state, input);

  if (director.shouldOverrideObjective && objectiveReadout) {
    objectiveReadout.textContent = director.objectiveText;
  }

  if (director.shouldOverrideStatus && statusReadout) {
    statusReadout.textContent = director.statusText;
  }

  if (director.active && typeof logSink === "function") {
    logSink(director.bottomLogText, director);
  }

  return director;
}
