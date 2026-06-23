import { getTidewalkContactPressure, getTidewalkContactPressureLog } from "./tidewalk-contact-pressure.js";

export function getTidewalkContactPressureHud(state) {
  const pressure = getTidewalkContactPressure(state);
  const logLine = getTidewalkContactPressureLog(state);

  return {
    active: pressure.active,
    complete: pressure.complete,
    band: pressure.band,
    tension: pressure.tension,
    focusContactLabel: pressure.focusContact?.label || null,
    line: pressure.line,
    pulseHint: pressure.pulseHint,
    logLine,
    shouldOverrideStatus: pressure.active || pressure.complete,
    shouldAppendLog: Boolean(logLine)
  };
}

export function applyTidewalkContactPressureHud({ state, statusReadout, logReadout } = {}) {
  if (!state) {
    throw new TypeError("applyTidewalkContactPressureHud requires a game state");
  }

  const hud = getTidewalkContactPressureHud(state);

  if (hud.shouldOverrideStatus && statusReadout) {
    statusReadout.textContent = hud.line;
  }

  if (hud.shouldAppendLog && logReadout) {
    logReadout.textContent = hud.logLine;
  }

  return hud;
}
