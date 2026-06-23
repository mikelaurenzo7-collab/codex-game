function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getTidePhase(location) {
  const match = normalizeText(location).match(/\b(LOW|HIGH|SURGE) TIDE\b/i);
  return match ? match[1].toLowerCase() : "unknown";
}

const TIDE_BRIEFS = {
  low: {
    label: "LOW TIDE",
    condition: "Channels exposed",
    instruction: "Use the open water to stage cargo runs before the next rise."
  },
  high: {
    label: "HIGH TIDE",
    condition: "Pressure normal",
    instruction: "Keep the objective in sight and pulse only when the route is clear."
  },
  surge: {
    label: "SURGE TIDE",
    condition: "Pressure escalating",
    instruction: "Break contact, still black tide with a pulse, then move on the next safe line."
  },
  unknown: {
    label: "TIDE READING",
    condition: "No phase lock",
    instruction: "Read the water, then commit to the clearest objective line."
  }
};

export function getBrinehookCommandBrief({ location, status, objective } = {}) {
  const locationText = normalizeText(location);
  const statusText = normalizeText(status);
  const objectiveText = normalizeText(objective);
  const active = /^Brinehook Low Piers\b/i.test(locationText);

  if (!active) {
    return {
      active: false,
      tone: "quiet",
      eyebrow: "COASTAL COMMAND",
      title: "Brinehook offline",
      condition: "Awaiting pier descent",
      objective: "",
      instruction: ""
    };
  }

  const tidePhase = getTidePhase(locationText);
  const tide = TIDE_BRIEFS[tidePhase];
  const suppressed = /suppressed|stilled/i.test(statusText);
  const holding = /%$/.test(statusText) || /ready|holding/i.test(statusText);
  const statusLabel = suppressed
    ? "BLACK TIDE STILLED"
    : holding
      ? "OBJECTIVE WINDOW OPEN"
      : tide.condition;

  return {
    active: true,
    tone: suppressed ? "clear" : tidePhase === "surge" ? "danger" : tidePhase === "low" ? "opportunity" : "pressure",
    eyebrow: `BRINEHOOK // ${tide.label}`,
    title: statusLabel,
    condition: statusText || tide.condition,
    objective: objectiveText || "Hold the pier line and preserve the recovered signal.",
    instruction: suppressed
      ? "The water is still. Reposition, recover what the pulse exposed, and commit before pressure returns."
      : tide.instruction
  };
}