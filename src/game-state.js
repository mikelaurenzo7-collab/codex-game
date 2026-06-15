export const WORLD = {
  width: 1920,
  height: 1080,
  playerRadius: 18,
  playerSpeed: 255,
  pulseRadius: 245,
  pulseCost: 24,
  pulseCooldown: 1.25,
  fragmentRevealSeconds: 7.5,
  fieldAnalysisRadius: 72,
  fieldAnalysisSeconds: 1.8,
  fieldAnalysisDrainPerSecond: 8,
  frontierTraverseRadius: 74,
  frontierTraverseSeconds: 1.6,
  frontierTraverseDrainPerSecond: 10,
  echoStunSeconds: 2.6,
  echoDrainPerSecond: 26,
  signalRechargePerSecond: 4.5
};

const BLUEPRINT = {
  player: { x: 160, y: 880 },
  gate: { x: 1770, y: 170, radius: 54 },
  obstacles: [
    { x: 0, y: 0, width: 1920, height: 42 },
    { x: 0, y: 1038, width: 1920, height: 42 },
    { x: 0, y: 0, width: 42, height: 1080 },
    { x: 1878, y: 0, width: 42, height: 1080 },
    { x: 300, y: 160, width: 70, height: 620 },
    { x: 610, y: 430, width: 550, height: 72 },
    { x: 850, y: 120, width: 72, height: 250 },
    { x: 1260, y: 300, width: 70, height: 600 },
    { x: 1460, y: 730, width: 250, height: 70 },
    { x: 520, y: 760, width: 390, height: 62 }
  ],
  fragments: [
    {
      id: "chorus",
      title: "Hull Chorus",
      x: 520,
      y: 190,
      clue: "A crew sang to mask the hull alarms."
    },
    {
      id: "cartographer",
      title: "Rewritten Map",
      x: 1080,
      y: 760,
      clue: "The map was rewritten after the first descent."
    },
    {
      id: "bell",
      title: "Dead Bell",
      x: 1640,
      y: 420,
      clue: "The bell rings only when nobody is alive to hear it."
    }
  ],
  relays: [
    { id: "south-relay", x: 260, y: 710, radius: 46 },
    { id: "east-relay", x: 1510, y: 900, radius: 46 }
  ],
  echoes: [
    {
      id: "witness",
      x: 700,
      y: 650,
      radius: 26,
      path: [
        { x: 700, y: 650 },
        { x: 1110, y: 650 },
        { x: 1110, y: 920 },
        { x: 700, y: 920 }
      ],
      speed: 105
    },
    {
      id: "warden",
      x: 1450,
      y: 230,
      radius: 28,
      path: [
        { x: 1450, y: 230 },
        { x: 1710, y: 230 },
        { x: 1710, y: 610 },
        { x: 1450, y: 610 }
      ],
      speed: 95
    }
  ]
};

const REGIONS = [
  {
    id: "south-intake",
    name: "South Intake",
    biome: "Drowned Archive",
    x: 42,
    y: 620,
    width: 650,
    height: 416,
    detail: "A flooded maintenance approach where salvagers first cut into the buried archive.",
    hazardLevel: 2,
    hazard: "Sump bursts and unstable catwalks",
    settlementPotential: 3,
    settlementProspect: "A raised scavenger quay could anchor supply traffic."
  },
  {
    id: "northwest-hull",
    name: "Northwest Hull",
    biome: "Sung Metal",
    x: 370,
    y: 42,
    width: 430,
    height: 388,
    detail: "Old pressure walls carry harmonic scoring from the crew that tried to hide the breach.",
    hazardLevel: 3,
    hazard: "Echo resonance and falling hull plates",
    settlementPotential: 2,
    settlementProspect: "Only a narrow lookout settlement would hold here."
  },
  {
    id: "central-sluice",
    name: "Central Sluice",
    biome: "Cartographer's Wake",
    x: 610,
    y: 430,
    width: 650,
    height: 390,
    detail: "A drowned switchyard of false routes, survey tables, and rerouted archive channels.",
    hazardLevel: 3,
    hazard: "Flood surges through broken valve halls",
    settlementPotential: 4,
    settlementProspect: "A lockyard hub could connect every surviving corridor."
  },
  {
    id: "eastern-bell",
    name: "Eastern Bellreach",
    biome: "Silent Masonry",
    x: 1330,
    y: 42,
    width: 548,
    height: 688,
    detail: "A high ruin around the dead bell, built to answer signals that should not return.",
    hazardLevel: 4,
    hazard: "Bell-fed revenants and wind-carved drops",
    settlementPotential: 3,
    settlementProspect: "A fortified watch bastion could tax the eastern approaches."
  },
  {
    id: "relay-fen",
    name: "Relay Fen",
    biome: "Mossglass Floodplain",
    x: 910,
    y: 730,
    width: 760,
    height: 308,
    detail: "A wetland of humming relays and green-black water that points toward the wider frontier.",
    hazardLevel: 4,
    hazard: "Reed choke, sinkwater, and relay leeches",
    settlementPotential: 5,
    settlementProspect: "A lantern-post colony could command the fen crossings."
  }
];

const LANDMARKS = [
  {
    id: "salvager-camp",
    title: "Salvager Camp",
    regionId: "south-intake",
    x: 160,
    y: 880,
    radius: 95,
    type: "camp",
    detail: "Canvas, batteries, and a half-finished regional map mark the player's first foothold."
  },
  {
    id: "south-relay-camp",
    title: "South Relay Camp",
    regionId: "south-intake",
    x: 260,
    y: 710,
    radius: 110,
    type: "relay",
    detail: "A relay strung through broken pipework, still able to refill a careful surveyor's signal."
  },
  {
    id: "hull-chorus-site",
    title: "Hull Chorus Site",
    regionId: "northwest-hull",
    x: 520,
    y: 190,
    radius: 120,
    type: "memory",
    detail: "The northwest wall vibrates with a buried work song and the first missing memory."
  },
  {
    id: "rewritten-table",
    title: "Rewritten Cartography Table",
    regionId: "central-sluice",
    x: 1080,
    y: 760,
    radius: 125,
    type: "survey",
    detail: "A survey table has been carved over so many times that the false routes are now deeper than the true ones."
  },
  {
    id: "dead-bell-spire",
    title: "Dead Bell Spire",
    regionId: "eastern-bell",
    x: 1640,
    y: 420,
    radius: 135,
    type: "mystery",
    detail: "A tower that listens more than it rings, now suitable for field analysis after enough evidence is recovered."
  },
  {
    id: "extraction-cairn",
    title: "Extraction Cairn",
    regionId: "eastern-bell",
    x: 1770,
    y: 170,
    radius: 115,
    type: "gate",
    detail: "The archive exit can only read a complete recovered thread."
  },
  {
    id: "east-relay-basin",
    title: "East Relay Basin",
    regionId: "relay-fen",
    x: 1510,
    y: 900,
    radius: 120,
    type: "relay",
    detail: "Mossglass water around the relay hints at the larger green frontier beyond the archive."
  }
];

const FRONTIER_ROUTES = [
  {
    id: "intake-hull-catwalk",
    fromRegionId: "south-intake",
    toRegionId: "northwest-hull",
    gateTitle: "Hull Breach Catwalk",
    gate: { x: 430, y: 250 },
    threat: 2,
    stability: "frayed",
    hazard: "Loose plates and echo resonance make every crossing noisy.",
    settlementProspect: "Cable-Roof Lookout",
    surveyLandmarkIds: ["salvager-camp", "hull-chorus-site"]
  },
  {
    id: "intake-sluice-causeway",
    fromRegionId: "south-intake",
    toRegionId: "central-sluice",
    gateTitle: "Sump Causeway",
    gate: { x: 620, y: 560 },
    threat: 3,
    stability: "serviceable",
    hazard: "Machinery wakes and surgewater can cut the path without warning.",
    settlementProspect: "Drainwatch Scaffold",
    surveyLandmarkIds: ["south-relay-camp", "rewritten-table"]
  },
  {
    id: "sluice-bell-viaduct",
    fromRegionId: "central-sluice",
    toRegionId: "eastern-bell",
    gateTitle: "Bell Viaduct",
    gate: { x: 1320, y: 260 },
    threat: 4,
    stability: "precarious",
    hazard: "The upper span pulls the warden through a narrow kill corridor.",
    settlementProspect: "Spanwatch Tollhouse",
    surveyLandmarkIds: ["rewritten-table", "dead-bell-spire"]
  },
  {
    id: "sluice-fen-spillway",
    fromRegionId: "central-sluice",
    toRegionId: "relay-fen",
    gateTitle: "Fen Spillway",
    gate: { x: 1160, y: 820 },
    threat: 3,
    stability: "marsh-soft",
    hazard: "Silt blooms hide drop-offs and signal-draining growth.",
    settlementProspect: "Mudglass Ferry Post",
    surveyLandmarkIds: ["rewritten-table", "east-relay-basin"]
  },
  {
    id: "bell-fen-marshline",
    fromRegionId: "eastern-bell",
    toRegionId: "relay-fen",
    gateTitle: "Bell Marshline",
    gate: { x: 1510, y: 730 },
    threat: 4,
    stability: "seasonal",
    hazard: "Reed stairs collapse under bell shock and wet stone.",
    settlementProspect: "Lantern Reed Hamlet",
    surveyLandmarkIds: ["dead-bell-spire", "east-relay-basin"]
  },
  {
    id: "intake-coastline-lift",
    fromRegionId: "south-intake",
    toRegionId: null,
    destinationName: "Tidewalk Coast",
    destinationBiome: "Salt Lantern Marsh",
    gateTitle: "Coastline Lift",
    gate: { x: 140, y: 1012 },
    threat: 3,
    stability: "sealed",
    hazard: "Rust lifts and storm tides turn the descent into a salvage gamble.",
    settlementProspect: "Raised Dock Hamlet",
    surveyLandmarkIds: ["salvager-camp"]
  },
  {
    id: "fen-deep-green-verge",
    fromRegionId: "relay-fen",
    toRegionId: null,
    destinationName: "Deep Green Verge",
    destinationBiome: "Rootbound Wilds",
    gateTitle: "Fen Outflow Sluice",
    gate: { x: 1685, y: 980 },
    threat: 5,
    stability: "wild",
    hazard: "Predatory growth and drowned root canyons reclaim any slow traveler.",
    settlementProspect: "Fenward Ranger Enclave",
    surveyLandmarkIds: ["east-relay-basin"]
  },
  {
    id: "bell-cairn-marches",
    fromRegionId: "eastern-bell",
    toRegionId: null,
    destinationName: "Bell March",
    destinationBiome: "Wind-Carved Cairns",
    gateTitle: "Cairn March Steps",
    gate: { x: 1828, y: 138 },
    threat: 4,
    stability: "contested",
    hazard: "Bell-fed revenants sweep the pass whenever the weather turns thin.",
    settlementProspect: "Stoneward Bastion",
    surveyLandmarkIds: ["extraction-cairn", "dead-bell-spire"]
  }
];

const DEDUCTION_RULES = new Map([
  [
    "cartographer+chorus",
    {
      missingId: "bell",
      title: "Eastern Knell",
      text: "The song and rewritten route converge on the eastern bell as the archive's last witness."
    }
  ],
  [
    "bell+chorus",
    {
      missingId: "cartographer",
      title: "False Route",
      text: "The masked alarms and dead bell leave one suspect gap: the map between them was altered."
    }
  ],
  [
    "bell+cartographer",
    {
      missingId: "chorus",
      title: "Buried Chorus",
      text: "The falsified map and silent bell imply the first breach was hidden in the northwest hull song."
    }
  ]
]);

export function createGameState() {
  const state = {
    time: 0,
    status: "running",
    result: null,
    player: { ...BLUEPRINT.player, radius: WORLD.playerRadius },
    gate: { ...BLUEPRINT.gate, unlocked: false },
    obstacles: BLUEPRINT.obstacles.map((obstacle) => ({ ...obstacle })),
    fragments: BLUEPRINT.fragments.map((fragment) => ({
      ...fragment,
      revealedUntil: 0,
      collected: false,
      collectedAt: null,
      analysisProgress: 0,
      analysisResolved: false
    })),
    relays: BLUEPRINT.relays.map((relay) => ({ ...relay, depleted: false })),
    echoes: BLUEPRINT.echoes.map((echo) => ({
      ...echo,
      targetIndex: 1,
      stunnedUntil: 0
    })),
    signal: 100,
    pulseCooldownUntil: 0,
    pulses: [],
    clueLog: [],
    atlas: {
      visitedRegionIds: [],
      discoveredLandmarkIds: [],
      discoveredRouteIds: [],
      chartedRouteIds: []
    },
    frontier: {
      traversedRouteIds: [],
      routeProgress: {},
      lastTraverse: null
    }
  };
  resolveWorldSurvey(state);
  return state;
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function collectedFragmentCount(state) {
  return state.fragments.filter((fragment) => fragment.collected).length;
}

export function getActiveObjective(state) {
  if (state.status !== "running") {
    return null;
  }

  const openFragments = state.fragments.filter((fragment) => !fragment.collected);
  if (openFragments.length === 0) {
    return buildObjective("gate", "Reach extraction", state.gate, state);
  }

  const revealedFragments = openFragments.filter((fragment) => fragment.revealedUntil > state.time);
  const targetPool = revealedFragments.length > 0 ? revealedFragments : openFragments;
  const synthesis = getEvidenceSynthesis(state);
  const synthesisTarget =
    synthesis.target && openFragments.find((fragment) => fragment.id === synthesis.target.id);
  const target =
    revealedFragments.length > 0
      ? findNearest(state.player, targetPool)
      : synthesisTarget || findNearest(state.player, targetPool);

  if (revealedFragments.length > 0) {
    return buildObjective("exposed-fragment", "Recover exposed memory", target, state);
  }

  if (synthesis.phase === "deduced") {
    const analysis = getFieldAnalysis(state);
    const label = analysis.complete ? "Recover resolved memory" : "Analyze deduction";
    return buildObjective("deduced-fragment", label, target, state);
  }

  if (synthesis.phase === "cross-check") {
    return buildObjective("hidden-fragment", "Cross-check evidence", target, state);
  }

  return buildObjective("hidden-fragment", "Trace memory signal", target, state);
}

export function getEvidenceSynthesis(state) {
  const collected = state.fragments.filter((fragment) => fragment.collected);
  const openFragments = state.fragments.filter((fragment) => !fragment.collected);

  if (collected.length === 0) {
    return {
      phase: "unresolved",
      title: "No Pattern",
      text: "Recover memory fragments to compare the archive's contradictions.",
      target: null
    };
  }

  if (openFragments.length === 0) {
    return {
      phase: "complete",
      title: "Thread Assembled",
      text: "The chorus, map, and bell now agree. The extraction gate can read the recovered thread.",
      target: { id: "gate", x: state.gate.x, y: state.gate.y }
    };
  }

  if (collected.length === 1) {
    const target = findNearest(state.player, openFragments);
    return {
      phase: "cross-check",
      title: "Unpaired Evidence",
      text: `${collected[0].title} needs corroboration before the archive route can be trusted.`,
      target: { id: target.id, x: target.x, y: target.y }
    };
  }

  const key = collected
    .map((fragment) => fragment.id)
    .sort()
    .join("+");
  const rule = DEDUCTION_RULES.get(key);
  const target = openFragments.find((fragment) => fragment.id === rule?.missingId) || openFragments[0];

  return {
    phase: "deduced",
    title: rule?.title || "Triangulated Memory",
    text: rule?.text || "The recovered evidence points to the remaining contradiction.",
    target: { id: target.id, x: target.x, y: target.y }
  };
}

export function getFieldAnalysis(state) {
  const synthesis = getEvidenceSynthesis(state);
  if (synthesis.phase !== "deduced" || !synthesis.target) {
    return {
      active: false,
      complete: false,
      inRange: false,
      progress: 0,
      required: WORLD.fieldAnalysisSeconds,
      target: null
    };
  }

  const target = state.fragments.find((fragment) => fragment.id === synthesis.target.id);
  if (!target || target.collected) {
    return {
      active: false,
      complete: false,
      inRange: false,
      progress: 0,
      required: WORLD.fieldAnalysisSeconds,
      target: null
    };
  }

  return {
    active: true,
    complete: target.analysisResolved,
    inRange: distance(state.player, target) <= WORLD.fieldAnalysisRadius,
    progress: target.analysisProgress,
    required: WORLD.fieldAnalysisSeconds,
    target: { id: target.id, title: target.title, x: target.x, y: target.y }
  };
}

export function getWorldAtlas(state) {
  const visitedRegionIds = state.atlas?.visitedRegionIds || [];
  const discoveredLandmarkIds = state.atlas?.discoveredLandmarkIds || [];
  const currentRegion = findRegionAt(state.player);

  return {
    currentRegion: currentRegion
      ? {
          id: currentRegion.id,
          name: currentRegion.name,
          biome: currentRegion.biome,
          detail: currentRegion.detail,
          hazardLevel: currentRegion.hazardLevel,
          hazard: currentRegion.hazard,
          settlementPotential: currentRegion.settlementPotential,
          settlementProspect: currentRegion.settlementProspect
        }
      : null,
    discoveredRegionCount: visitedRegionIds.length,
    totalRegionCount: REGIONS.length,
    discoveredLandmarkCount: discoveredLandmarkIds.length,
    totalLandmarkCount: LANDMARKS.length,
    regions: REGIONS.map((region) => ({
      id: region.id,
      name: region.name,
      biome: region.biome,
      detail: region.detail,
      hazardLevel: region.hazardLevel,
      hazard: region.hazard,
      settlementPotential: region.settlementPotential,
      settlementProspect: region.settlementProspect,
      visited: visitedRegionIds.includes(region.id),
      bounds: { x: region.x, y: region.y, width: region.width, height: region.height }
    })),
    landmarks: LANDMARKS.map((landmark) => ({
      id: landmark.id,
      title: landmark.title,
      regionId: landmark.regionId,
      type: landmark.type,
      detail: landmark.detail,
      discovered: discoveredLandmarkIds.includes(landmark.id),
      location: { x: landmark.x, y: landmark.y }
    }))
  };
}

export function getFrontierNetwork(state) {
  const atlas = getWorldAtlas(state);
  const discoveredRouteIds = state.atlas?.discoveredRouteIds || [];
  const chartedRouteIds = state.atlas?.chartedRouteIds || [];
  const traversedRouteIds = state.frontier?.traversedRouteIds || [];
  const currentRegionId = atlas.currentRegion?.id;

  const visibleRoutes = FRONTIER_ROUTES.filter((route) => discoveredRouteIds.includes(route.id));
  const currentRoutes = visibleRoutes.filter(
    (route) => route.fromRegionId === currentRegionId || route.toRegionId === currentRegionId
  );

  return {
    currentRegion: atlas.currentRegion,
    visibleRouteCount: visibleRoutes.length,
    chartedRouteCount: chartedRouteIds.length,
    launchedRouteCount: traversedRouteIds.length,
    totalRouteCount: FRONTIER_ROUTES.length,
    routes: currentRoutes.map((route) =>
      buildRouteSummary(route, chartedRouteIds.includes(route.id), traversedRouteIds.includes(route.id))
    ),
    allVisibleRoutes: visibleRoutes.map((route) =>
      buildRouteSummary(route, chartedRouteIds.includes(route.id), traversedRouteIds.includes(route.id))
    )
  };
}

export function getFrontierTraverse(state) {
  const chartedRouteIds = state.atlas?.chartedRouteIds || [];
  const traversedRouteIds = state.frontier?.traversedRouteIds || [];
  const traversableRoutes = FRONTIER_ROUTES.filter(
    (route) => route.toRegionId === null && chartedRouteIds.includes(route.id)
  );
  const route = findNearestRoute(state.player, traversableRoutes);

  if (!route || distance(state.player, route.gate) > WORLD.frontierTraverseRadius + 42) {
    return inactiveFrontierTraverse();
  }

  return {
    active: true,
    complete: traversedRouteIds.includes(route.id),
    inRange: distance(state.player, route.gate) <= WORLD.frontierTraverseRadius,
    progress: state.frontier?.routeProgress?.[route.id] || 0,
    required: WORLD.frontierTraverseSeconds,
    route: {
      id: route.id,
      gateTitle: route.gateTitle,
      destinationName: route.destinationName,
      destinationBiome: route.destinationBiome,
      gate: { x: route.gate.x, y: route.gate.y }
    }
  };
}

export function getEvidenceJournal(state) {
  return state.fragments.map((fragment) => ({
    id: fragment.id,
    title: fragment.title,
    clue: fragment.clue,
    collected: fragment.collected,
    collectedAt: fragment.collectedAt,
    location: { x: fragment.x, y: fragment.y }
  }));
}

export function canPulse(state) {
  return state.status === "running" && state.signal >= WORLD.pulseCost && state.time >= state.pulseCooldownUntil;
}

export function triggerPulse(state) {
  if (!canPulse(state)) {
    return false;
  }

  state.signal = Math.max(0, state.signal - WORLD.pulseCost);
  state.pulseCooldownUntil = state.time + WORLD.pulseCooldown;
  state.pulses.push({ x: state.player.x, y: state.player.y, startedAt: state.time });

  for (const fragment of state.fragments) {
    if (!fragment.collected && canPulseRevealFragment(state, fragment) && distance(state.player, fragment) <= WORLD.pulseRadius) {
      fragment.revealedUntil = state.time + WORLD.fragmentRevealSeconds;
    }
  }

  for (const echo of state.echoes) {
    if (distance(state.player, echo) <= WORLD.pulseRadius) {
      echo.stunnedUntil = state.time + WORLD.echoStunSeconds;
    }
  }

  for (const relay of state.relays) {
    if (!relay.depleted && distance(state.player, relay) <= relay.radius + WORLD.pulseRadius * 0.35) {
      relay.depleted = true;
      state.signal = Math.min(100, state.signal + 38);
    }
  }

  return true;
}

export function updateGameState(state, input, deltaSeconds) {
  if (state.status !== "running") {
    return state;
  }

  const dt = Math.min(Math.max(deltaSeconds, 0), 0.05);
  state.time += dt;
  state.signal = Math.min(100, state.signal + WORLD.signalRechargePerSecond * dt);
  state.pulses = state.pulses.filter((pulse) => state.time - pulse.startedAt < 0.72);

  movePlayer(state, input, dt);
  moveEchoes(state, dt);
  resolveWorldSurvey(state);
  resolveFieldAnalysis(state, input, dt);
  resolveFrontierTraverse(state, input, dt);
  resolveCollection(state);
  resolveEchoPressure(state, dt);
  resolveGate(state);

  return state;
}

function movePlayer(state, input, dt) {
  let dx = Number(Boolean(input.right)) - Number(Boolean(input.left));
  let dy = Number(Boolean(input.down)) - Number(Boolean(input.up));
  const magnitude = Math.hypot(dx, dy);
  if (magnitude > 0) {
    dx /= magnitude;
    dy /= magnitude;
  }

  const distanceToMove = WORLD.playerSpeed * dt;
  moveCircleWithCollision(state.player, dx * distanceToMove, 0, state.obstacles);
  moveCircleWithCollision(state.player, 0, dy * distanceToMove, state.obstacles);
}

function moveCircleWithCollision(circle, dx, dy, obstacles) {
  circle.x = clamp(circle.x + dx, circle.radius, WORLD.width - circle.radius);
  circle.y = clamp(circle.y + dy, circle.radius, WORLD.height - circle.radius);

  for (const obstacle of obstacles) {
    const nearestX = clamp(circle.x, obstacle.x, obstacle.x + obstacle.width);
    const nearestY = clamp(circle.y, obstacle.y, obstacle.y + obstacle.height);
    const overlapX = circle.x - nearestX;
    const overlapY = circle.y - nearestY;
    const overlapDistance = Math.hypot(overlapX, overlapY);

    if (overlapDistance > 0 && overlapDistance < circle.radius) {
      const push = circle.radius - overlapDistance;
      circle.x += (overlapX / overlapDistance) * push;
      circle.y += (overlapY / overlapDistance) * push;
    }
  }
}

function moveEchoes(state, dt) {
  for (const echo of state.echoes) {
    if (echo.stunnedUntil > state.time) {
      continue;
    }

    const target = echo.path[echo.targetIndex];
    const dx = target.x - echo.x;
    const dy = target.y - echo.y;
    const remaining = Math.hypot(dx, dy);

    if (remaining < 4) {
      echo.targetIndex = (echo.targetIndex + 1) % echo.path.length;
      continue;
    }

    const step = Math.min(remaining, echo.speed * dt);
    echo.x += (dx / remaining) * step;
    echo.y += (dy / remaining) * step;
  }
}

function resolveWorldSurvey(state) {
  const currentRegion = findRegionAt(state.player);
  if (currentRegion) {
    remember(state.atlas.visitedRegionIds, currentRegion.id);
  }

  for (const landmark of LANDMARKS) {
    if (distance(state.player, landmark) <= landmark.radius) {
      remember(state.atlas.discoveredLandmarkIds, landmark.id);
    }
  }

  resolveFrontierSurvey(state);
}

function resolveFrontierSurvey(state) {
  const visitedRegionIds = state.atlas.visitedRegionIds;
  const discoveredLandmarkIds = state.atlas.discoveredLandmarkIds;

  for (const route of FRONTIER_ROUTES) {
    const visible =
      visitedRegionIds.includes(route.fromRegionId) ||
      (route.toRegionId !== null && visitedRegionIds.includes(route.toRegionId));

    if (!visible) {
      continue;
    }

    remember(state.atlas.discoveredRouteIds, route.id);

    const charted =
      route.surveyLandmarkIds.some((id) => discoveredLandmarkIds.includes(id)) ||
      (route.toRegionId !== null &&
        visitedRegionIds.includes(route.fromRegionId) &&
        visitedRegionIds.includes(route.toRegionId));

    if (charted) {
      remember(state.atlas.chartedRouteIds, route.id);
    }
  }
}

function resolveFieldAnalysis(state, input, dt) {
  const analysis = getFieldAnalysis(state);
  if (!analysis.active || !analysis.target) {
    return;
  }

  const target = state.fragments.find((fragment) => fragment.id === analysis.target.id);
  if (!target || target.analysisResolved) {
    return;
  }

  const holdingAnalysis = Boolean(input.analyze);
  const canAnalyze = holdingAnalysis && analysis.inRange && state.signal > 0;

  if (!canAnalyze) {
    target.analysisProgress = Math.max(0, target.analysisProgress - dt * 0.7);
    return;
  }

  state.signal = Math.max(0, state.signal - WORLD.fieldAnalysisDrainPerSecond * dt);
  target.analysisProgress = Math.min(WORLD.fieldAnalysisSeconds, target.analysisProgress + dt);

  if (target.analysisProgress >= WORLD.fieldAnalysisSeconds) {
    target.analysisResolved = true;
    target.revealedUntil = Math.max(target.revealedUntil, state.time + WORLD.fragmentRevealSeconds);
  }
}

function resolveFrontierTraverse(state, input, dt) {
  const traverse = getFrontierTraverse(state);
  if (!traverse.active || !traverse.route || traverse.complete) {
    return;
  }

  const currentProgress = state.frontier.routeProgress[traverse.route.id] || 0;
  const holdingTraverse = Boolean(input.analyze);
  const canTraverse = holdingTraverse && traverse.inRange && state.signal > 0;

  if (!canTraverse) {
    state.frontier.routeProgress[traverse.route.id] = Math.max(0, currentProgress - dt * 0.65);
    return;
  }

  state.signal = Math.max(0, state.signal - WORLD.frontierTraverseDrainPerSecond * dt);
  const nextProgress = Math.min(WORLD.frontierTraverseSeconds, currentProgress + dt);
  state.frontier.routeProgress[traverse.route.id] = nextProgress;

  if (nextProgress >= WORLD.frontierTraverseSeconds) {
    remember(state.frontier.traversedRouteIds, traverse.route.id);
    state.frontier.lastTraverse = {
      routeId: traverse.route.id,
      gateTitle: traverse.route.gateTitle,
      destinationName: traverse.route.destinationName,
      destinationBiome: traverse.route.destinationBiome,
      traversedAt: state.time
    };
    state.clueLog.push(`Frontier link secured: ${traverse.route.destinationName}`);
  }
}

function resolveCollection(state) {
  for (const fragment of state.fragments) {
    const revealed = fragment.revealedUntil > state.time;
    if (!fragment.collected && revealed && distance(state.player, fragment) <= state.player.radius + 28) {
      fragment.collected = true;
      fragment.collectedAt = state.time;
      state.clueLog.push(fragment.clue);
    }
  }
}

function resolveEchoPressure(state, dt) {
  for (const echo of state.echoes) {
    const stunned = echo.stunnedUntil > state.time;
    if (!stunned && distance(state.player, echo) <= state.player.radius + echo.radius + 10) {
      state.signal = Math.max(0, state.signal - WORLD.echoDrainPerSecond * dt);
    }
  }

  if (state.signal <= 0) {
    state.status = "failed";
    state.result = "Signal lost";
  }
}

function resolveGate(state) {
  state.gate.unlocked = collectedFragmentCount(state) === state.fragments.length;
  if (state.gate.unlocked && distance(state.player, state.gate) <= state.player.radius + state.gate.radius) {
    state.status = "complete";
    state.result = "Archive thread recovered";
  }
}

function findRegionAt(point) {
  const containingRegion = REGIONS.find(
    (region) =>
      point.x >= region.x &&
      point.x <= region.x + region.width &&
      point.y >= region.y &&
      point.y <= region.y + region.height
  );

  if (containingRegion) {
    return containingRegion;
  }

  return REGIONS.reduce((nearest, region) => {
    const center = { x: region.x + region.width / 2, y: region.y + region.height / 2 };
    if (!nearest || distance(point, center) < distance(point, nearest.center)) {
      return { region, center };
    }
    return nearest;
  }, null)?.region;
}

function buildRouteSummary(route, charted, traversed) {
  const destinationRegion = route.toRegionId ? REGIONS.find((region) => region.id === route.toRegionId) : null;
  return {
    id: route.id,
    gateTitle: route.gateTitle,
    charted,
    traversed,
    canTraverse: charted && route.toRegionId === null,
    destinationName: destinationRegion?.name || route.destinationName,
    destinationBiome: destinationRegion?.biome || route.destinationBiome,
    destinationRegionId: destinationRegion?.id || null,
    offMap: route.toRegionId === null,
    threat: route.threat,
    stability: route.stability,
    hazard: route.hazard,
    settlementProspect: route.settlementProspect,
    gate: { x: route.gate.x, y: route.gate.y }
  };
}

function remember(ids, id) {
  if (!ids.includes(id)) {
    ids.push(id);
  }
}

function canPulseRevealFragment(state, fragment) {
  if (fragment.analysisResolved) {
    return true;
  }

  const synthesis = getEvidenceSynthesis(state);
  return synthesis.phase !== "deduced" || synthesis.target?.id !== fragment.id;
}

function findNearest(origin, candidates) {
  return candidates.reduce((nearest, candidate) => {
    if (!nearest || distance(origin, candidate) < distance(origin, nearest)) {
      return candidate;
    }
    return nearest;
  }, null);
}

function findNearestRoute(origin, routes) {
  return routes.reduce((nearest, route) => {
    if (!nearest || distance(origin, route.gate) < distance(origin, nearest.gate)) {
      return route;
    }
    return nearest;
  }, null);
}

function inactiveFrontierTraverse() {
  return {
    active: false,
    complete: false,
    inRange: false,
    progress: 0,
    required: WORLD.frontierTraverseSeconds,
    route: null
  };
}

function buildObjective(kind, label, target, state) {
  return {
    kind,
    label,
    target: { x: target.x, y: target.y },
    distance: Math.round(distance(state.player, target))
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
