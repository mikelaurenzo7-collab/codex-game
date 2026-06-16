import { TIDEWALK_ROUTE_CHOICES, getTidewalkCoastalObjective } from "./tidewalk-coastal-objective.js";

const STORYLETS = {
  "quay-safe-lantern-line": {
    id: "lantern-line-afterglow",
    title: "Lantern Line Afterglow",
    factionPressure: 1,
    settlementTrust: 4,
    opening:
      "By dawn, Tidelantern Quay has strung a low lantern chain from the archive lift to Brinehook Warehouse.",
    twist:
      "The safe route calms the dock stewards, but Black-Keel runners use the delay to pull their freshest marks from the lower piers.",
    reward:
      "Salt-proof batteries become available at the quay before the next coastal push.",
    nextHook:
      "Interrogate a lantern tender who saw a black-painted skiff leave before the route was lit.",
    unlockedFlags: ["quay-battery-cache", "lantern-tender-witness"],
    riskTags: ["low-threat", "lost-time", "settlement-favor"]
  },
  "black-keel-countermark": {
    id: "countermark-pursuit",
    title: "Countermark Pursuit",
    factionPressure: 4,
    settlementTrust: 2,
    opening:
      "The countermark trail leads under the warehouse pilings, where wet black paint is still bleeding into the tide.",
    twist:
      "Black-Keel spotters now know someone from the archive can read their route language.",
    reward:
      "A hidden salvage cache can be reached before the crew strips it clean.",
    nextHook:
      "Choose whether to ambush the cache crew or shadow them back to the captain who ordered the marks.",
    unlockedFlags: ["black-keel-cache", "hostile-network-aware"],
    riskTags: ["high-threat", "faction-exposure", "direct-lead"]
  }
};

const LOCKED_STORYLET = {
  id: "tidewalk-storylet-locked",
  title: "No Coastal Consequence Yet",
  factionPressure: 0,
  settlementTrust: 0,
  opening: "Tidewalk Coast is still only a rumor until docking rights, warehouse survey, and a route choice are resolved.",
  twist: "No faction has reacted because the player has not committed to a coastal line of approach.",
  reward: "None yet.",
  nextHook: "Secure docking rights, finish the warehouse survey, then choose a Tidewalk route.",
  unlockedFlags: [],
  riskTags: ["locked"]
};

function getSelectedChoiceId(state) {
  return state?.selectedTidewalkRouteChoiceId ?? state?.frontier?.selectedTidewalkRouteChoiceId ?? null;
}

function getDiscoveredClues(state) {
  return new Set(state?.discoveredCoastalClues ?? state?.frontier?.discoveredCoastalClues ?? []);
}

function getChoice(choiceId) {
  return TIDEWALK_ROUTE_CHOICES.find((choice) => choice.id === choiceId) || null;
}

export function getBlackKeelStorylet(state) {
  const objective = getTidewalkCoastalObjective(state);
  const choiceId = getSelectedChoiceId(state);
  const selectedChoice = getChoice(choiceId);
  const storylet = STORYLETS[choiceId];
  const discoveredClues = getDiscoveredClues(state);

  if (!selectedChoice || !storylet || objective.phase !== "route-chosen") {
    return {
      ...LOCKED_STORYLET,
      objectivePhase: objective.phase,
      selectedChoice: null,
      ready: false
    };
  }

  const knowsBlackKeel = discoveredClues.has("black-keel-mark");
  const pressure = storylet.factionPressure + (knowsBlackKeel ? 1 : 0);

  return {
    ...storylet,
    objectivePhase: objective.phase,
    selectedChoice,
    ready: true,
    factionPressure: pressure,
    settlementTrust: storylet.settlementTrust,
    knowsBlackKeel,
    headline: `${storylet.title} · Pressure ${pressure}/5 · Trust ${storylet.settlementTrust}/5`,
    nextHook: knowsBlackKeel
      ? storylet.nextHook
      : "Recover the Black-Keel mark before this consequence can point to a named enemy."
  };
}

export function listBlackKeelStorylets() {
  return Object.values(STORYLETS).map((storylet) => ({
    id: storylet.id,
    title: storylet.title,
    factionPressure: storylet.factionPressure,
    settlementTrust: storylet.settlementTrust,
    riskTags: [...storylet.riskTags],
    unlockedFlags: [...storylet.unlockedFlags]
  }));
}
