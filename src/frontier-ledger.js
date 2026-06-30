import {
  getBlackKeelStorylet,
  getBrinehookAftermath,
  getFrontierArrival,
  getFrontierCoastalOperation,
  getFrontierEncounter,
  getFrontierNetwork,
  getFrontierRouteChoice,
  getFrontierSurvey,
  getWorldAtlas
} from "./game-state.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getAnchorState(route, atlas) {
  const landmarksById = new Map(atlas.landmarks.map((landmark) => [landmark.id, landmark]));
  const surveyLandmarkIds = route.surveyLandmarkIds || [];
  const discoveredCount = surveyLandmarkIds.filter((id) => landmarksById.get(id)?.discovered).length;
  const missingAnchor = surveyLandmarkIds
    .map((id) => landmarksById.get(id))
    .find((landmark) => landmark && !landmark.discovered);

  return {
    discoveredCount,
    totalCount: surveyLandmarkIds.length,
    missingAnchorTitle: missingAnchor?.title || null
  };
}

function getTrustPressure(aftermath, storylet) {
  if (aftermath.active) {
    return {
      source: "resolved",
      trust: aftermath.settlementTrust,
      pressure: aftermath.factionPressure
    };
  }

  if (storylet.active) {
    return {
      source: "projected",
      trust: storylet.settlementTrust,
      pressure: storylet.factionPressure
    };
  }

  return null;
}

function getStage({ route, encounter, survey, routeChoice, coastalOperation, aftermath, isActiveArrival }) {
  if (!isActiveArrival) {
    if (route.traversed) {
      return "Linked";
    }
    return route.charted ? "Charted" : "Rumored";
  }

  if (aftermath.active) {
    return aftermath.factionPressure >= 4 ? "Pressured" : "Secured";
  }
  if (coastalOperation.active && coastalOperation.complete) {
    return "Aftermath";
  }
  if (routeChoice.active && routeChoice.selectedChoice) {
    return "Committed";
  }
  if (survey.active && survey.complete) {
    return "Decision";
  }
  if (encounter.active && encounter.resolved) {
    return "Foothold";
  }
  if (route.traversed) {
    return "Linked";
  }
  return route.charted ? "Charted" : "Rumored";
}

function getStageRank(stage) {
  switch (stage) {
    case "Secured":
      return 7;
    case "Foothold":
      return 6;
    case "Committed":
      return 5;
    case "Decision":
      return 4;
    case "Aftermath":
      return 4;
    case "Linked":
      return 3;
    case "Charted":
      return 2;
    case "Rumored":
      return 1;
    case "Pressured":
      return 0;
    default:
      return 0;
  }
}

function getViability({ route, encounter, trustPressure, isActiveArrival }) {
  let score = route.settlementPotential || 2;

  if (!route.charted) {
    score -= 1;
  }
  if (route.offMap && !route.traversed) {
    score -= 1;
  }
  if (route.threat >= 4) {
    score -= 1;
  }
  if (isActiveArrival && encounter.active && encounter.resolved) {
    score += 1;
  }
  if (trustPressure) {
    if (trustPressure.trust >= 4) {
      score += 1;
    } else if (trustPressure.trust <= 2) {
      score -= 1;
    }

    if (trustPressure.pressure >= 4) {
      score -= 2;
    }
  }

  return clamp(score, 1, 5);
}

function getMetricText({ route, anchorState, trustPressure }) {
  const parts = [];

  if (trustPressure) {
    const trustLabel = trustPressure.source === "resolved" ? "Trust" : "Projected trust";
    const pressureLabel = trustPressure.source === "resolved" ? "Pressure" : "Projected pressure";
    parts.push(`${trustLabel} ${trustPressure.trust}/5`);
    parts.push(`${pressureLabel} ${trustPressure.pressure}/5`);
  } else {
    parts.push(`Threat ${route.threat}/5`);
    parts.push(route.stability);
  }

  if (anchorState.totalCount > 0) {
    parts.push(`Survey anchors ${anchorState.discoveredCount}/${anchorState.totalCount}`);
  }

  return parts.join(" | ");
}

function getNextAction({
  route,
  name,
  encounter,
  survey,
  routeChoice,
  coastalOperation,
  aftermath,
  arrival,
  anchorState,
  isActiveArrival
}) {
  if (isActiveArrival && aftermath.active) {
    return aftermath.nextHook;
  }
  if (isActiveArrival && coastalOperation.active) {
    return coastalOperation.complete
      ? coastalOperation.nextHook
      : `Return to ${coastalOperation.gateTitle} and hold E to advance the ${name} lead.`;
  }
  if (isActiveArrival && routeChoice.active && !routeChoice.selectedChoice) {
    return "Meet a moving Tidewalk contact and hold E to decide which coast line survives.";
  }
  if (isActiveArrival && routeChoice.active && routeChoice.selectedChoice) {
    return arrival.nextHook;
  }
  if (isActiveArrival && survey.active && survey.complete) {
    return "The warehouses are mapped. Commit a Tidewalk contact so the coast stops stalling at evidence.";
  }
  if (isActiveArrival && survey.active) {
    return survey.nextHook;
  }
  if (isActiveArrival && encounter.active && !encounter.resolved) {
    return encounter.pendingNote;
  }
  if (route.canTraverse) {
    return `Hold E at ${route.gateTitle} to launch ${name}.`;
  }
  if (anchorState.missingAnchorTitle) {
    return `Recover ${anchorState.missingAnchorTitle} to harden the ${name} prospect.`;
  }
  return `Keep charting the ${route.destinationName} corridor before this build line is trusted.`;
}

function getTone(stage) {
  if (stage === "Secured") {
    return "secured";
  }
  if (stage === "Pressured") {
    return "pressured";
  }
  if (stage === "Rumored") {
    return "rumored";
  }
  return "charted";
}

function buildLedgerEntry({ route, arrival, encounter, survey, routeChoice, storylet, coastalOperation, aftermath, atlas }) {
  const isActiveArrival = arrival.active && arrival.routeId === route.id;
  const trustPressure = isActiveArrival ? getTrustPressure(aftermath, storylet) : null;
  const anchorState = getAnchorState(route, atlas);
  const stage = getStage({
    route,
    encounter,
    survey,
    routeChoice,
    coastalOperation,
    aftermath,
    isActiveArrival
  });
  const name = isActiveArrival ? arrival.settlementName : route.settlementProspect;
  const viability = getViability({ route, encounter, trustPressure, isActiveArrival });

  return {
    routeId: route.id,
    name,
    destinationName: route.destinationName,
    destinationBiome: route.destinationBiome,
    viability,
    stage,
    stageRank: getStageRank(stage),
    tone: getTone(stage),
    threat: route.threat,
    active: isActiveArrival,
    detailText: getMetricText({ route, anchorState, trustPressure }),
    nextAction: getNextAction({
      route,
      name,
      encounter,
      survey,
      routeChoice,
      coastalOperation,
      aftermath,
      arrival,
      anchorState,
      isActiveArrival
    })
  };
}

export function getFrontierLedger(state) {
  const atlas = getWorldAtlas(state);
  const frontier = getFrontierNetwork(state);
  const arrival = getFrontierArrival(state);
  const encounter = getFrontierEncounter(state);
  const survey = getFrontierSurvey(state);
  const routeChoice = getFrontierRouteChoice(state);
  const storylet = getBlackKeelStorylet(state);
  const coastalOperation = getFrontierCoastalOperation(state);
  const aftermath = getBrinehookAftermath(state);

  const entries = frontier.allVisibleRoutes
    .map((route) =>
      buildLedgerEntry({
        route,
        arrival,
        encounter,
        survey,
        routeChoice,
        storylet,
        coastalOperation,
        aftermath,
        atlas
      })
    )
    .sort((left, right) => {
      if (right.viability !== left.viability) {
        return right.viability - left.viability;
      }
      if (right.stageRank !== left.stageRank) {
        return right.stageRank - left.stageRank;
      }
      if (Number(right.active) !== Number(left.active)) {
        return Number(right.active) - Number(left.active);
      }
      return left.threat - right.threat;
    });

  if (entries.length === 0) {
    return {
      active: false,
      countText: "0 prospects",
      summary: "No settlement prospects are readable yet.",
      nextAction: "Survey landmarks to reveal the first frontier build lines.",
      lead: null,
      entries: []
    };
  }

  const lead = entries[0];
  const strongCount = entries.filter((entry) => entry.viability >= 4).length;

  return {
    active: true,
    countText: `${strongCount}/${entries.length} strong`,
    summary: `Lead prospect: ${lead.name} ${lead.viability}/5 | ${lead.stage}`,
    nextAction: lead.nextAction,
    lead,
    entries
  };
}

export function formatFrontierLedgerLead(ledger = {}) {
  if (!ledger.active || !ledger.lead) {
    return ledger.nextAction || "Survey landmarks to reveal the first frontier build lines.";
  }

  return `${ledger.summary}. ${ledger.nextAction}`;
}
