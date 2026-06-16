const DEFAULT_SIGNAL = 100;
const MIN_SIGNAL_TO_SURVEY = 18;
const SURVEY_SIGNAL_COST = 12;
const SALVAGE_MARK_SIGNAL_COST = 8;

const MICRO_OBJECTIVE = {
  id: "tidewalk-warehouse-survey",
  title: "Survey the Drowned Warehouse",
  location: "Tidewalk Coast / Tidelantern Quay",
  prerequisiteEncounterId: "tidewalk-docking-rights",
  siteName: "Brinehook Warehouse",
  hostileMarkName: "Black-Keel Salvage Mark",
  discoveryText:
    "A collapsed warehouse ledger proves someone has been tagging stable archive routes before the player arrives.",
  completionText:
    "The warehouse survey gives Tidelantern Quay enough proof to open a risky coastal choice instead of a single safe dock hook."
};

export const TIDEWALK_ROUTE_CHOICES = [
  {
    id: "quay-safe-lantern-line",
    label: "Lantern Line",
    risk: 2,
    reward: "Reliable batteries and a safer return path to the archive lift.",
    consequence: "The quay trusts the route but rival salvagers gain time to erase their next mark."
  },
  {
    id: "black-keel-countermark",
    label: "Countermark Trail",
    risk: 4,
    reward: "A direct lead toward the Black-Keel crew and their hidden salvage cache.",
    consequence: "The player becomes visible to a hostile salvage network before the coast is secure."
  }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hasDockingRights(state) {
  return Boolean(state?.resolvedEncounterIds?.includes(MICRO_OBJECTIVE.prerequisiteEncounterId));
}

function normalizeProgress(value) {
  return clamp(Number.isFinite(value) ? value : 0, 0, 1);
}

export function createTidewalkCoastalState(overrides = {}) {
  return {
    signal: DEFAULT_SIGNAL,
    resolvedEncounterIds: [],
    coastalSurveyProgress: 0,
    discoveredCoastalClues: [],
    selectedTidewalkRouteChoiceId: null,
    lastCoastalObjectiveEvent: null,
    ...overrides
  };
}

export function getTidewalkCoastalObjective(state) {
  const progress = normalizeProgress(state?.coastalSurveyProgress);
  const discoveredClues = new Set(state?.discoveredCoastalClues ?? []);
  const selectedChoice = TIDEWALK_ROUTE_CHOICES.find(
    (choice) => choice.id === state?.selectedTidewalkRouteChoiceId
  );

  if (!hasDockingRights(state)) {
    return {
      ...MICRO_OBJECTIVE,
      phase: "locked",
      progress,
      prompt: "Secure Tidelantern Quay docking rights before the coast can be surveyed.",
      canSurvey: false,
      canChooseRoute: false,
      routeChoices: []
    };
  }

  if (selectedChoice) {
    return {
      ...MICRO_OBJECTIVE,
      phase: "route-chosen",
      progress: 1,
      prompt: `${selectedChoice.label} selected: ${selectedChoice.consequence}`,
      canSurvey: false,
      canChooseRoute: false,
      selectedChoice,
      routeChoices: TIDEWALK_ROUTE_CHOICES
    };
  }

  if (progress >= 1) {
    return {
      ...MICRO_OBJECTIVE,
      phase: "route-choice",
      progress: 1,
      prompt: MICRO_OBJECTIVE.completionText,
      canSurvey: false,
      canChooseRoute: true,
      routeChoices: TIDEWALK_ROUTE_CHOICES,
      discoveredHostileMark: discoveredClues.has("black-keel-mark")
    };
  }

  const canSurvey = (state?.signal ?? 0) >= MIN_SIGNAL_TO_SURVEY;
  return {
    ...MICRO_OBJECTIVE,
    phase: progress > 0 ? "surveying" : "ready",
    progress,
    prompt: canSurvey
      ? "Hold the survey beam on Brinehook Warehouse to expose who marked the route."
      : "Recharge signal before pushing farther into the drowned warehouse.",
    canSurvey,
    canChooseRoute: false,
    routeChoices: [],
    discoveredHostileMark: discoveredClues.has("black-keel-mark")
  };
}

export function surveyTidewalkWarehouse(state, amount = 0.34) {
  const current = createTidewalkCoastalState(state);
  const objective = getTidewalkCoastalObjective(current);

  if (!objective.canSurvey) {
    return {
      ...current,
      lastCoastalObjectiveEvent: {
        type: "survey-blocked",
        reason: objective.phase === "locked" ? "docking-rights-required" : "signal-too-low"
      }
    };
  }

  const nextProgress = normalizeProgress(current.coastalSurveyProgress + Math.max(0, amount));
  const completed = nextProgress >= 1;
  const signalCost = completed ? SALVAGE_MARK_SIGNAL_COST : SURVEY_SIGNAL_COST;
  const discoveredCoastalClues = new Set(current.discoveredCoastalClues ?? []);

  if (completed) {
    discoveredCoastalClues.add("black-keel-mark");
    discoveredCoastalClues.add("warehouse-ledger");
  }

  return {
    ...current,
    signal: clamp((current.signal ?? DEFAULT_SIGNAL) - signalCost, 0, DEFAULT_SIGNAL),
    coastalSurveyProgress: nextProgress,
    discoveredCoastalClues: [...discoveredCoastalClues],
    lastCoastalObjectiveEvent: {
      type: completed ? "survey-complete" : "survey-progress",
      objectiveId: MICRO_OBJECTIVE.id,
      progress: nextProgress,
      text: completed ? MICRO_OBJECTIVE.discoveryText : "Saltwater ledger marks are becoming readable."
    }
  };
}

export function chooseTidewalkRoute(state, choiceId) {
  const current = createTidewalkCoastalState(state);
  const objective = getTidewalkCoastalObjective(current);
  const choice = TIDEWALK_ROUTE_CHOICES.find((candidate) => candidate.id === choiceId);

  if (!choice) {
    return {
      ...current,
      lastCoastalObjectiveEvent: {
        type: "route-choice-blocked",
        reason: "unknown-choice"
      }
    };
  }

  if (!objective.canChooseRoute) {
    return {
      ...current,
      lastCoastalObjectiveEvent: {
        type: "route-choice-blocked",
        reason: objective.phase === "locked" ? "docking-rights-required" : "survey-required"
      }
    };
  }

  return {
    ...current,
    selectedTidewalkRouteChoiceId: choice.id,
    lastCoastalObjectiveEvent: {
      type: "route-choice-selected",
      objectiveId: MICRO_OBJECTIVE.id,
      choiceId: choice.id,
      risk: choice.risk,
      reward: choice.reward,
      consequence: choice.consequence
    }
  };
}
