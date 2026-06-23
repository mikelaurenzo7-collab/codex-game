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
  tidewalkSurveyRadius: 76,
  tidewalkSurveySeconds: 1.85,
  tidewalkSurveyDrainPerSecond: 10,
  coastalOperationRadius: 76,
  coastalOperationSeconds: 1.9,
  coastalOperationDrainPerSecond: 11,
  tidewalkExpeditionSeconds: 1.5,
  tidewalkExpeditionDrainPerSecond: 9,
  tideHazardDrainPerSecond: 18,
  echoStunSeconds: 2.6,
  echoDrainPerSecond: 26,
  signalRechargePerSecond: 4.5
};

export const GAME_SAVE_VERSION = 3;

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

const FRONTIER_ARRIVALS = {
  "intake-coastline-lift": {
    title: "Raised Dock Hamlet",
    summary:
      "Beyond the archive lift, the coast opens into a lantern-strung salvage hamlet balanced over black tidewater and broken piers.",
    encounterTitle: "First Arrival Encounter",
    encounterText:
      "Dock stewards demand proof that the archive route is stable before they trade batteries or sound the deeper marsh bells.",
    settlementName: "Tidelantern Quay",
    settlementText:
      "A practical fishing and salvage post built on pylons, eager for archive metal and desperate for reliable inland signal routes.",
    resourceTitle: "Immediate Resource",
    resourceText:
      "Salt-proof cable, brine lantern oil, and one serviceable tide map that marks two drowned warehouses further downshore.",
    nextHook:
      "Negotiate docking rights, then survey the drowned warehouses to learn who has been stripping the coast ahead of the hamlet."
  },
  "fen-deep-green-verge": {
    title: "Fenward Ranger Enclave",
    summary:
      "The relay fen gives way to rootbound wilds where ranger posts cling to giant mangrove ribs above luminous green water.",
    encounterTitle: "First Arrival Encounter",
    encounterText:
      "A ranger outrider mistakes the archive signal for a hostile lure and forces a tense standoff at spear range before letting you speak.",
    settlementName: "Vergewatch Platforms",
    settlementText:
      "A sparse defensive enclave of scouts and reedwrights that survives by reading predator movement and burning back growth at dusk.",
    resourceTitle: "Immediate Resource",
    resourceText:
      "Spore-charms, reed resin, and a partial migration sketch showing where the root canyons open into safer high ground.",
    nextHook:
      "Earn the enclave's trust by tracing the false signal source drawing predators toward Vergewatch after dark."
  },
  "bell-cairn-marches": {
    title: "Stoneward Bastion",
    summary:
      "Past the cairn steps, the bell marches widen into wind-cut terraces guarded by signal fires and stacked grave-stone redoubts.",
    encounterTitle: "First Arrival Encounter",
    encounterText:
      "A watch captain halts the crossing and insists the bell route is cursed unless the archive witness can prove the marches are not already lost.",
    settlementName: "Stoneward Gatehouse",
    settlementText:
      "A hard frontier bastion built from collapsed cairns, where wardens ration rope, water, and high-ground shelter to proven travelers only.",
    resourceTitle: "Immediate Resource",
    resourceText:
      "Wind charts, cairn rope, and a sealed ledger describing vanished patrols on the upper terraces after the last bell storm.",
    nextHook:
      "Climb with a patrol to the upper terraces and determine whether the vanished wardens were taken by revenants or something using the bell as cover."
  }
};

const FRONTIER_EDGE_ENCOUNTERS = {
  "intake-coastline-lift": {
    id: "tidewalk-docking-rights",
    actionLabel: "Secure docking rights",
    pendingNote: "Ask Tidelantern Quay to open limited docking and confirm the archive route is stable.",
    resolvedTitle: "Dock Steward Compact",
    resolvedText: "The stewards open limited docking and hand over a tide map marking two drowned warehouses.",
    resolvedNote: "Consequence: the hamlet now accepts the route and allows salvage traffic.",
    resolvedHook: "Active hook: survey the drowned warehouses along the coast."
  }
};

const FRONTIER_SURVEY_OPERATIONS = {
  "intake-coastline-lift": {
    title: "Drowned Warehouse Survey",
    summary:
      "Two tide-marked warehouses sit downshore from Tidelantern Quay. The stewards want proof of what remains useful and who reached them first.",
    completionTitle: "Hostile Salvage Mark",
    completionText:
      "Comparing both warehouse logs reveals a painted salvage mark used by an unknown crew stripping the coast ahead of the hamlet.",
    sites: [
      {
        id: "north-spool-house",
        title: "North Spool House",
        briefing:
          "Survey the cable store built over the old winch trench and check whether the lifted crates were opened by stormwater or tools.",
        result:
          "Recovered salt-proof cable manifests and fresh pry scars, which proves someone competent stripped the upper racks before the tide returned."
      },
      {
        id: "lamp-black-warehouse",
        title: "Lampblack Storehouse",
        briefing:
          "Inspect the lantern-oil warehouse on the outer pilings and compare the missing stock against the stewards' last intact tide ledger.",
        result:
          "Recovered a lamp ledger and a black tar salvage mark, showing the same crew is taking fuel, mapping routes, and moving deeper along the coast."
      }
    ]
  }
};

export const TIDEWALK_ROUTE_CHOICES = [
  {
    id: "quay-safe-lantern-line",
    label: "Lantern Line",
    risk: 2,
    reward: "Reliable batteries and a safer return path to the archive lift.",
    consequence: "The quay trusts the route, but rival salvagers gain time to erase their next mark."
  },
  {
    id: "black-keel-countermark",
    label: "Countermark Trail",
    risk: 4,
    reward: "A direct lead toward the Black-Keel crew and their hidden salvage cache.",
    consequence: "The player becomes visible to a hostile salvage network before the coast is secure."
  }
];

const BLACK_KEEL_STORYLETS = {
  "quay-safe-lantern-line": {
    id: "lantern-line-afterglow",
    title: "Lantern Line Afterglow",
    factionPressure: 1,
    settlementTrust: 4,
    opening:
      "By dawn, Tidelantern Quay has strung a low lantern chain from the archive lift to Brinehook Warehouse.",
    twist:
      "The safer route steadies the dock stewards, but Black-Keel runners use the delay to lift their freshest marks from the lower piers.",
    reward:
      "Salt-proof batteries and a lantern escort are now available to any archive crew returning inland.",
    nextHook:
      "Question the lantern tender who saw a black-painted skiff leave before the route was lit.",
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
      "Black-Keel spotters now know someone from the archive can read their route language and follow it on purpose.",
    reward:
      "A hidden salvage cache can be reached before the crew strips it clean.",
    nextHook:
      "Choose whether to ambush the cache crew or shadow them back to the captain who ordered the marks.",
    unlockedFlags: ["black-keel-cache", "hostile-network-aware"],
    riskTags: ["high-threat", "faction-exposure", "direct-lead"]
  }
};

const FRONTIER_COASTAL_OPERATIONS = {
  "quay-safe-lantern-line": {
    id: "lantern-line-witness-sync",
    routeId: "intake-coastline-lift",
    landmarkId: "south-relay-camp",
    gateTitle: "South Relay Camp",
    mapLabel: "Lantern witness",
    title: "Sync the lantern witness line",
    briefing:
      "Return to South Relay Camp and hold the relay steady while Tidelantern Quay walks the tender's witness timing back across the lantern chain.",
    completionTitle: "Witness heading logged",
    completionText:
      "The witness timing resolves into a skiff heading toward the lower Brinehook piers, and the relay rack yields a fresh battery crate for inland runs.",
    nextHook:
      "Next hook: carry the Brinehook heading back down the lantern line once Tidewalk Coast opens into a true field scene.",
    signalReward: 24
  },
  "black-keel-countermark": {
    id: "black-keel-cache-scout",
    routeId: "intake-coastline-lift",
    gateTitle: "Coastline Lift",
    mapLabel: "Black-Keel lead",
    title: "Scout the Black-Keel cache route",
    briefing:
      "Return to the Coastline Lift and hold the countermark line steady before the tide scrubs the paint away.",
    completionTitle: "Cache route scoped",
    completionText:
      "The countermark under the lift braces leads to a Black-Keel underpier cache hidden below Brinehook Warehouse.",
    nextHook:
      "Next hook: ambush the cache crew at the underpier or shadow them back to the captain who ordered the marks."
  }
};

const TIDEWALK_SCENE = {
  entry: { x: 170, y: 850 },
  launchGate: { x: 140, y: 1012 },
  obstacles: [
    { x: 0, y: 0, width: 1920, height: 42 },
    { x: 0, y: 1038, width: 1920, height: 42 },
    { x: 0, y: 0, width: 42, height: 1080 },
    { x: 1878, y: 0, width: 42, height: 1080 },
    { x: 360, y: 150, width: 90, height: 650 },
    { x: 670, y: 430, width: 470, height: 76 },
    { x: 1160, y: 170, width: 72, height: 610 },
    { x: 1420, y: 520, width: 300, height: 68 },
    { x: 720, y: 820, width: 480, height: 72 }
  ],
  hazards: [
    { id: "brine-mouth", x: 585, y: 770, radius: 118 },
    { id: "undertow-cut", x: 990, y: 300, radius: 105 },
    { id: "blackwater-sump", x: 1390, y: 850, radius: 125 }
  ],
  leads: {
    "quay-safe-lantern-line": {
      title: "Meet the Brinehook lantern tender",
      label: "Lantern tender",
      target: { x: 1580, y: 260 },
      completionTitle: "Tender witness secured",
      completionText: "The tender names a black-painted skiff and marks the low-tide channel back to Tidelantern Quay."
    },
    "black-keel-countermark": {
      title: "Reach the Black-Keel underpier cache",
      label: "Underpier cache",
      target: { x: 1570, y: 860 },
      completionTitle: "Black-Keel cache breached",
      completionText: "The cache is stripped, but a wet captain's tally points toward the next Black-Keel staging pier."
    }
  }
};

const TIDEWALK_SURVEY_SCENE = {
  entry: { ...TIDEWALK_SCENE.entry },
  launchGate: { ...TIDEWALK_SCENE.launchGate },
  sites: {
    "north-spool-house": {
      label: "Winch trench racks",
      target: { x: 1580, y: 260 }
    },
    "lamp-black-warehouse": {
      label: "Outer pilings fuel cage",
      target: { x: 1570, y: 860 }
    }
  }
};

export function createGameState() {
  const state = {
    time: 0,
    scene: "archive",
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
      stunnedUntil: 0,
      huntTarget: null
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
      resolvedEncounterIds: [],
      resolvedCoastalOperationIds: [],
      surveyedSiteIds: [],
      discoveredCoastalClueIds: [],
      selectedRouteChoiceId: null,
      tide: {
        phase: "low",
        timer: 0
      },
      routeProgress: {},
      tidewalkSurvey: {
        launched: false,
        progress: 0,
        tideStilledUntil: 0
      },
      coastalOperationProgress: {},
      tidewalkExpedition: {
        launched: false,
        complete: false,
        progress: 0,
        tideStilledUntil: 0
      },
      lastTraverse: null,
      lastEncounter: null,
      lastSurvey: null,
      lastRouteChoice: null,
      lastCoastalOperation: null
    }
  };
  resolveWorldSurvey(state);
  return state;
}

export function createGameCheckpoint(state) {
  validateCheckpointState(state);
  return JSON.stringify({
    version: GAME_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state
  });
}

export function restoreGameCheckpoint(serialized) {
  if (typeof serialized !== "string" || serialized.length === 0 || serialized.length > 100_000) {
    throw new Error("Checkpoint data is missing or too large");
  }

  let checkpoint;
  try {
    checkpoint = JSON.parse(serialized);
  } catch {
    throw new Error("Checkpoint data is not valid JSON");
  }

  if (!isRecord(checkpoint) || checkpoint.version !== GAME_SAVE_VERSION) {
    throw new Error("Checkpoint version is not supported");
  }

  validateCheckpointState(checkpoint.state);
  return checkpoint.state;
}

function validateCheckpointState(state) {
  const validStatus = ["running", "complete", "failed"];
  if (
    !isRecord(state) ||
    !["archive", "tidewalk"].includes(state.scene) ||
    !validStatus.includes(state.status) ||
    !isFiniteNumber(state.time) ||
    !isFiniteNumber(state.signal) ||
    !isFiniteNumber(state.pulseCooldownUntil) ||
    !isPoint(state.player) ||
    !isPoint(state.gate)
  ) {
    throw new Error("Checkpoint state is invalid");
  }

  const expectedFragmentIds = BLUEPRINT.fragments.map(({ id }) => id);
  const expectedRelayIds = BLUEPRINT.relays.map(({ id }) => id);
  const expectedEchoIds = BLUEPRINT.echoes.map(({ id }) => id);
  if (
    !hasExactEntityIds(state.fragments, expectedFragmentIds) ||
    !hasExactEntityIds(state.relays, expectedRelayIds) ||
    !hasExactEntityIds(state.echoes, expectedEchoIds) ||
    !state.fragments.every(
      (fragment) =>
        isPoint(fragment) &&
        typeof fragment.collected === "boolean" &&
        typeof fragment.analysisResolved === "boolean" &&
        isFiniteNumber(fragment.revealedUntil) &&
        isFiniteNumber(fragment.analysisProgress)
    ) ||
    !state.relays.every((relay) => isPoint(relay) && typeof relay.depleted === "boolean") ||
    !state.echoes.every(
      (echo) =>
        isPoint(echo) &&
        Array.isArray(echo.path) &&
        echo.path.every(isPoint) &&
        Number.isInteger(echo.targetIndex) &&
        isFiniteNumber(echo.stunnedUntil) &&
        (echo.huntTarget === null || isPoint(echo.huntTarget))
    ) ||
    !Array.isArray(state.obstacles) ||
    !state.obstacles.every(isRectangle) ||
    !Array.isArray(state.pulses) ||
    !state.pulses.every((pulse) => isPoint(pulse) && isFiniteNumber(pulse.startedAt)) ||
    !isStringArray(state.clueLog)
  ) {
    throw new Error("Checkpoint world data is invalid");
  }

  if (
    !isRecord(state.atlas) ||
    !isStringArray(state.atlas.visitedRegionIds) ||
    !isStringArray(state.atlas.discoveredLandmarkIds) ||
    !isStringArray(state.atlas.discoveredRouteIds) ||
    !isStringArray(state.atlas.chartedRouteIds)
  ) {
    throw new Error("Checkpoint atlas data is invalid");
  }

  const frontier = state.frontier;
  if (
    !isRecord(frontier) ||
    !isStringArray(frontier.traversedRouteIds) ||
    !isStringArray(frontier.resolvedEncounterIds) ||
    !isStringArray(frontier.resolvedCoastalOperationIds) ||
    !isStringArray(frontier.surveyedSiteIds) ||
    !isStringArray(frontier.discoveredCoastalClueIds) ||
    !isRecord(frontier.tide) ||
    !["low", "high", "surge"].includes(frontier.tide.phase) ||
    !isFiniteNumber(frontier.tide.timer) ||
    !isNumberRecord(frontier.routeProgress) ||
    !isRecord(frontier.tidewalkSurvey) ||
    typeof frontier.tidewalkSurvey.launched !== "boolean" ||
    !isFiniteNumber(frontier.tidewalkSurvey.progress) ||
    !isFiniteNumber(frontier.tidewalkSurvey.tideStilledUntil) ||
    !isNumberRecord(frontier.coastalOperationProgress) ||
    !isRecord(frontier.tidewalkExpedition) ||
    typeof frontier.tidewalkExpedition.launched !== "boolean" ||
    typeof frontier.tidewalkExpedition.complete !== "boolean" ||
    !isFiniteNumber(frontier.tidewalkExpedition.progress) ||
    !isFiniteNumber(frontier.tidewalkExpedition.tideStilledUntil)
  ) {
    throw new Error("Checkpoint frontier data is invalid");
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isPoint(value) {
  return isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y);
}

function isRectangle(value) {
  return isPoint(value) && isFiniteNumber(value.width) && isFiniteNumber(value.height);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasExactEntityIds(value, expectedIds) {
  return (
    Array.isArray(value) &&
    value.length === expectedIds.length &&
    expectedIds.every((id) => value.some((item) => isRecord(item) && item.id === id))
  );
}

function isNumberRecord(value) {
  return isRecord(value) && Object.values(value).every(isFiniteNumber);
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

  const expedition = getTidewalkExpedition(state);
  if (expedition.active && !expedition.complete) {
    return buildObjective("tidewalk-expedition", expedition.title, expedition.target, state);
  }

  const tidewalkSurvey = getTidewalkSurveyField(state);
  if (tidewalkSurvey.active) {
    return buildObjective("tidewalk-survey", tidewalkSurvey.title, tidewalkSurvey.target, state);
  }

  const openFragments = state.fragments.filter((fragment) => !fragment.collected);
  if (openFragments.length === 0) {
    return buildObjective("gate", "Reach extraction", state.gate, state);
  }

  const coastalOperation = getFrontierCoastalOperation(state);
  if (coastalOperation.active && !coastalOperation.complete) {
    return buildObjective("coastal-operation", coastalOperation.title, coastalOperation.gate, state);
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

export function getFrontierArrival(state) {
  const traversedRouteIds = state.frontier?.traversedRouteIds || [];
  if (traversedRouteIds.length === 0) {
    return inactiveFrontierArrival();
  }

  const routeId = state.frontier?.lastTraverse?.routeId || traversedRouteIds[traversedRouteIds.length - 1];
  const route = FRONTIER_ROUTES.find((candidate) => candidate.id === routeId);
  const arrival = FRONTIER_ARRIVALS[routeId];

  if (!route || !arrival) {
    return inactiveFrontierArrival();
  }

  const encounter = getFrontierEncounter(state);
  const survey = getFrontierSurvey(state);
  const routeChoice = getFrontierRouteChoice(state);
  const storylet = getBlackKeelStorylet(state);
  const coastalOperation = getFrontierCoastalOperation(state);
  const resolvedEncounter = encounter.active && encounter.resolved;

  return {
    active: true,
    routeId,
    gateTitle: route.gateTitle,
    destinationName: route.destinationName,
    destinationBiome: route.destinationBiome,
    title: arrival.title,
    summary: arrival.summary,
    encounterTitle: resolvedEncounter ? encounter.resolvedTitle : arrival.encounterTitle,
    encounterText: resolvedEncounter ? encounter.resolvedText : arrival.encounterText,
    settlementName: arrival.settlementName,
    settlementText: arrival.settlementText,
    resourceTitle: coastalOperation.active
      ? coastalOperation.complete
        ? coastalOperation.completionTitle
        : `Field op: ${coastalOperation.title}`
      : storylet.active
      ? `Fallout: ${storylet.title}`
      : survey.active
        ? survey.resourceTitle
        : arrival.resourceTitle,
    resourceText: coastalOperation.active
      ? coastalOperation.complete
        ? coastalOperation.completionText
        : coastalOperation.briefing
      : storylet.active
      ? storylet.reward
      : survey.active
        ? survey.resourceText
        : arrival.resourceText,
    nextHook: coastalOperation.active
      ? coastalOperation.complete
        ? coastalOperation.nextHook
        : `Return to ${coastalOperation.gateTitle} and hold E to advance the live frontier lead.`
      : storylet.active
      ? storylet.nextHook
      : routeChoice.active && routeChoice.selectedChoice
        ? routeChoice.selectedChoice.consequence
        : survey.active
          ? survey.nextHook
          : resolvedEncounter
            ? encounter.resolvedHook
            : arrival.nextHook
  };
}

export function getFrontierEncounter(state) {
  const routeId = getFrontierArrivalRouteId(state);
  if (!routeId) {
    return inactiveFrontierEncounter();
  }

  const encounter = FRONTIER_EDGE_ENCOUNTERS[routeId];
  if (!encounter) {
    return inactiveFrontierEncounter();
  }

  const resolved = (state.frontier?.resolvedEncounterIds || []).includes(encounter.id);
  return {
    active: true,
    routeId,
    id: encounter.id,
    resolved,
    actionLabel: encounter.actionLabel,
    pendingNote: encounter.pendingNote,
    resolvedTitle: encounter.resolvedTitle,
    resolvedText: encounter.resolvedText,
    resolvedNote: encounter.resolvedNote,
    resolvedHook: encounter.resolvedHook,
    note: resolved ? encounter.resolvedNote : encounter.pendingNote
  };
}

export function resolveFrontierEncounter(state, encounterId = null) {
  const encounter = getFrontierEncounter(state);
  if (!encounter.active || encounter.resolved) {
    return false;
  }

  if (encounterId && encounter.id !== encounterId) {
    return false;
  }

  state.frontier.resolvedEncounterIds ||= [];
  remember(state.frontier.resolvedEncounterIds, encounter.id);
  state.frontier.lastEncounter = {
    id: encounter.id,
    routeId: encounter.routeId,
    title: encounter.resolvedTitle,
    resolvedAt: state.time
  };
  state.clueLog.push(`Edge encounter resolved: ${encounter.resolvedTitle}`);
  return true;
}

export function getFrontierSurvey(state) {
  const routeId = getFrontierArrivalRouteId(state);
  const encounter = getFrontierEncounter(state);
  if (!routeId || !encounter.active || !encounter.resolved) {
    return inactiveFrontierSurvey();
  }

  const operation = FRONTIER_SURVEY_OPERATIONS[routeId];
  if (!operation) {
    return inactiveFrontierSurvey();
  }

  const surveyedSiteIds = state.frontier?.surveyedSiteIds || [];
  const discoveredCoastalClueIds = state.frontier?.discoveredCoastalClueIds || [];
  const sites = operation.sites.map((site) => ({
    id: site.id,
    title: site.title,
    briefing: site.briefing,
    result: site.result,
    completed: surveyedSiteIds.includes(site.id)
  }));
  const completedCount = sites.filter((site) => site.completed).length;
  const nextSite = sites.find((site) => !site.completed) || null;
  const complete = completedCount === sites.length;
  const lastSurveyId = state.frontier?.lastSurvey?.siteId || null;
  const lastSite = sites.find((site) => site.id === lastSurveyId) || null;

  return {
    active: true,
    complete,
    routeId,
    title: operation.title,
    summary: operation.summary,
    completedCount,
    totalSiteCount: sites.length,
    hostileSalvageMarked: complete,
    discoveredClueIds: [...discoveredCoastalClueIds],
    resourceTitle: complete
      ? operation.completionTitle
      : lastSite
        ? `Surveyed: ${lastSite.title}`
        : "Coastal survey map",
    resourceText: complete
      ? operation.completionText
      : lastSite
        ? lastSite.result
        : "The stewards marked two reachable warehouses. Return to the Coastline Lift and hold E to descend so each site is surveyed on foot.",
    nextHook: complete
      ? "Track the hostile salvage mark deeper along Tidewalk Coast and decide whether to intercept, bargain, or shadow the crew."
      : nextSite
        ? `Next survey target: ${nextSite.title}. Return to the Coastline Lift, descend, and survey it in person.`
        : "Survey complete.",
    sites,
    nextSite
  };
}

export function resolveFrontierSurveySite(state, siteId) {
  const survey = getFrontierSurvey(state);
  if (!survey.active || survey.complete) {
    return false;
  }

  const site = survey.sites.find((candidate) => candidate.id === siteId);
  if (!site || site.completed) {
    return false;
  }

  state.frontier.surveyedSiteIds ||= [];
  remember(state.frontier.surveyedSiteIds, site.id);
  state.frontier.discoveredCoastalClueIds ||= [];
  state.frontier.lastSurvey = {
    routeId: survey.routeId,
    siteId: site.id,
    title: site.title,
    surveyedAt: state.time
  };
  if (site.id === "north-spool-house") {
    remember(state.frontier.discoveredCoastalClueIds, "warehouse-ledger");
  }
  if (site.id === "lamp-black-warehouse") {
    remember(state.frontier.discoveredCoastalClueIds, "black-keel-mark");
  }
  state.clueLog.push(`Warehouse surveyed: ${site.title}`);
  state.clueLog.push(site.result);

  const nextSurvey = getFrontierSurvey(state);
  if (nextSurvey.complete) {
    state.clueLog.push(`Threat marked: ${FRONTIER_SURVEY_OPERATIONS[survey.routeId].completionTitle}`);
  }

  return true;
}

export function getFrontierRouteChoice(state) {
  const survey = getFrontierSurvey(state);
  if (!survey.active || !survey.complete || survey.routeId !== "intake-coastline-lift") {
    return inactiveFrontierRouteChoice();
  }

  const selectedChoiceId = state.frontier?.selectedRouteChoiceId || null;
  const selectedChoice = TIDEWALK_ROUTE_CHOICES.find((choice) => choice.id === selectedChoiceId) || null;
  return {
    active: true,
    routeId: survey.routeId,
    selectedChoice,
    choices: TIDEWALK_ROUTE_CHOICES.map((choice) => ({
      ...choice,
      selected: choice.id === selectedChoiceId
    })),
    prompt: selectedChoice
      ? `${selectedChoice.label} selected: ${selectedChoice.consequence}`
      : "Choose whether Tidewalk Coast stabilizes behind lanterns or presses the hostile countermark deeper into Black-Keel territory."
  };
}

export function chooseFrontierRoute(state, choiceId) {
  const routeChoice = getFrontierRouteChoice(state);
  if (!routeChoice.active || routeChoice.selectedChoice) {
    return false;
  }

  const choice = TIDEWALK_ROUTE_CHOICES.find((candidate) => candidate.id === choiceId);
  if (!choice) {
    return false;
  }

  state.frontier.selectedRouteChoiceId = choice.id;
  state.frontier.lastRouteChoice = {
    routeId: routeChoice.routeId,
    choiceId: choice.id,
    label: choice.label,
    chosenAt: state.time
  };
  state.clueLog.push(`Tidewalk route chosen: ${choice.label}`);
  state.clueLog.push(choice.consequence);
  return true;
}

export function getBlackKeelStorylet(state) {
  const routeChoice = getFrontierRouteChoice(state);
  if (!routeChoice.active || !routeChoice.selectedChoice) {
    return inactiveBlackKeelStorylet();
  }

  const baseStorylet = BLACK_KEEL_STORYLETS[routeChoice.selectedChoice.id];
  if (!baseStorylet) {
    return inactiveBlackKeelStorylet();
  }

  const knowsBlackKeel = (state.frontier?.discoveredCoastalClueIds || []).includes("black-keel-mark");
  const factionPressure = baseStorylet.factionPressure + (knowsBlackKeel ? 1 : 0);
  return {
    active: true,
    ...baseStorylet,
    selectedChoice: routeChoice.selectedChoice,
    knowsBlackKeel,
    factionPressure,
    headline: `${baseStorylet.title} | Pressure ${factionPressure}/5 | Trust ${baseStorylet.settlementTrust}/5`,
    nextHook: knowsBlackKeel
      ? baseStorylet.nextHook
      : "Recover the Black-Keel mark before this consequence can point to a named enemy."
  };
}

export function getFrontierCoastalOperation(state) {
  const routeChoice = getFrontierRouteChoice(state);
  if (!routeChoice.active || !routeChoice.selectedChoice) {
    return inactiveFrontierCoastalOperation();
  }

  const operation = FRONTIER_COASTAL_OPERATIONS[routeChoice.selectedChoice.id];
  if (!operation) {
    return inactiveFrontierCoastalOperation();
  }

  const route = FRONTIER_ROUTES.find((candidate) => candidate.id === operation.routeId);
  if (!route) {
    return inactiveFrontierCoastalOperation();
  }

  let gate = { x: route.gate.x, y: route.gate.y };
  let gateTitle = operation.gateTitle || route.gateTitle;

  if (operation.landmarkId) {
    const landmark = LANDMARKS.find((candidate) => candidate.id === operation.landmarkId);
    if (!landmark) {
      return inactiveFrontierCoastalOperation();
    }

    gate = { x: landmark.x, y: landmark.y };
    gateTitle = operation.gateTitle || landmark.title;
  }

  const resolvedIds = state.frontier?.resolvedCoastalOperationIds || [];
  const complete = resolvedIds.includes(operation.id);
  return {
    active: true,
    id: operation.id,
    routeId: operation.routeId,
    choiceId: routeChoice.selectedChoice.id,
    gateTitle,
    mapLabel: operation.mapLabel || gateTitle,
    title: operation.title,
    briefing: operation.briefing,
    completionTitle: operation.completionTitle,
    completionText: operation.completionText,
    nextHook: operation.nextHook,
    complete,
    inRange: distance(state.player, gate) <= WORLD.coastalOperationRadius,
    progress: state.frontier?.coastalOperationProgress?.[operation.id] || 0,
    required: WORLD.coastalOperationSeconds,
    signalReward: operation.signalReward || 0,
    gate
  };
}

export function getTidewalkSurveyField(state) {
  const survey = getFrontierSurvey(state);
  if (!survey.active || survey.complete || survey.routeId !== "intake-coastline-lift" || !survey.nextSite) {
    return inactiveTidewalkSurveyField();
  }

  const progressState = state.frontier?.tidewalkSurvey || {};
  const launched = Boolean(progressState.launched);
  const sites = survey.sites.map((site) => {
    const layout = TIDEWALK_SURVEY_SCENE.sites[site.id];
    return {
      ...site,
      label: layout?.label || site.title,
      target: layout ? { ...layout.target } : null
    };
  });
  const nextSite = sites.find((site) => site.id === survey.nextSite.id) || null;
  if (!nextSite?.target) {
    return inactiveTidewalkSurveyField();
  }

  const target = launched ? nextSite.target : TIDEWALK_SURVEY_SCENE.launchGate;
  const radius = launched ? WORLD.tidewalkSurveyRadius : WORLD.frontierTraverseRadius;
  return {
    active: true,
    phase: launched ? "field" : "launch",
    title: launched ? `Survey ${nextSite.title}` : "Descend to Tidewalk Coast",
    briefing: launched
      ? nextSite.briefing
      : "Return to the Coastline Lift and hold E to descend into the drowned warehouses.",
    launched,
    completedCount: survey.completedCount,
    totalSiteCount: survey.totalSiteCount,
    nextSite,
    sites,
    target: { ...target },
    inRange: distance(state.player, target) <= radius,
    progress: progressState.progress || 0,
    required: WORLD.tidewalkSurveySeconds,
    tideStilled: (progressState.tideStilledUntil || 0) > state.time,
    hazards: TIDEWALK_SCENE.hazards.map((hazard) => {
      const tidePhase = state.frontier?.tide?.phase || "low";
      const mult = tidePhase === "low" ? 0.6 : tidePhase === "surge" ? 1.5 : 1.0;
      return { ...hazard, radius: hazard.radius * mult };
    }),
    obstacles: TIDEWALK_SCENE.obstacles.map((obstacle) => ({ ...obstacle }))
  };
}

export function getTidewalkExpedition(state) {
  const operation = getFrontierCoastalOperation(state);
  const choiceId = state.frontier?.selectedRouteChoiceId;
  const lead = TIDEWALK_SCENE.leads[choiceId];
  if (!operation.active || !operation.complete || !lead) {
    return inactiveTidewalkExpedition();
  }

  const progressState = state.frontier?.tidewalkExpedition || {};
  const launched = Boolean(progressState.launched);
  const complete = Boolean(progressState.complete);
  const target = launched && !complete ? lead.target : TIDEWALK_SCENE.launchGate;
  const phase = complete ? "complete" : launched ? "field" : "launch";
  const radius = launched ? WORLD.coastalOperationRadius : WORLD.frontierTraverseRadius;
  return {
    active: true,
    phase,
    launched,
    complete,
    choiceId,
    title: phase === "launch" ? "Descend to Tidewalk Coast" : lead.title,
    label: lead.label,
    completionTitle: lead.completionTitle,
    completionText: lead.completionText,
    leadTarget: { ...lead.target },
    target: { ...target },
    inRange: distance(state.player, target) <= radius,
    progress: progressState.progress || 0,
    required: WORLD.tidewalkExpeditionSeconds,
    tideStilled: (progressState.tideStilledUntil || 0) > state.time,
    hazards: TIDEWALK_SCENE.hazards.map((hazard) => {
      const tidePhase = state.frontier?.tide?.phase || "low";
      const mult = tidePhase === "low" ? 0.6 : tidePhase === "surge" ? 1.5 : 1.0;
      return { ...hazard, radius: hazard.radius * mult };
    }),
    obstacles: TIDEWALK_SCENE.obstacles.map((obstacle) => ({ ...obstacle }))
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

  if (state.scene === "tidewalk") {
    const tidewalkSurvey = getTidewalkSurveyField(state);
    if (tidewalkSurvey.active && tidewalkSurvey.phase === "field") {
      state.frontier.tidewalkSurvey.tideStilledUntil = state.time + WORLD.echoStunSeconds;
    } else {
      state.frontier.tidewalkExpedition.tideStilledUntil = state.time + WORLD.echoStunSeconds;
    }
    return true;
  }

  for (const fragment of state.fragments) {
    if (
      !fragment.collected &&
      canPulseRevealFragment(state, fragment) &&
      distance(state.player, fragment) <= WORLD.pulseRadius
    ) {
      fragment.revealedUntil = state.time + WORLD.fragmentRevealSeconds;
    }
  }

  for (const echo of state.echoes) {
    const dist = distance(state.player, echo);
    if (dist <= WORLD.pulseRadius) {
      echo.stunnedUntil = state.time + WORLD.echoStunSeconds;
    }
    if (dist <= WORLD.pulseRadius * 2) {
      echo.huntTarget = { x: state.player.x, y: state.player.y };
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

function updateTideCycle(state, dt) {
  state.frontier.tide ||= { phase: "low", timer: 0 };
  state.frontier.tide.timer += dt;
  if (state.frontier.tide.timer >= 15) {
    state.frontier.tide.timer = 0;
    if (state.frontier.tide.phase === "low") {
      state.frontier.tide.phase = "high";
    } else if (state.frontier.tide.phase === "high") {
      state.frontier.tide.phase = "surge";
    } else {
      state.frontier.tide.phase = "low";
    }
  }
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
  if (state.scene === "archive") {
    moveEchoes(state, dt);
    resolveWorldSurvey(state);
    resolveFieldAnalysis(state, input, dt);
    resolveFrontierTraverse(state, input, dt);
    resolveFrontierCoastalOperation(state, input, dt);
    resolveCollection(state);
    resolveEchoPressure(state, dt);
    resolveGate(state);
  } else if (state.scene === "tidewalk") {
    updateTideCycle(state, dt);
  }
  resolveTidewalkSurveyField(state, input, dt);
  resolveTidewalkExpedition(state, input, dt);

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
  const obstacles = state.scene === "tidewalk" ? TIDEWALK_SCENE.obstacles : state.obstacles;
  moveCircleWithCollision(state.player, dx * distanceToMove, 0, obstacles);
  moveCircleWithCollision(state.player, 0, dy * distanceToMove, obstacles);
}

function resolveTidewalkSurveyField(state, input, dt) {
  const tidewalkSurvey = getTidewalkSurveyField(state);
  if (!tidewalkSurvey.active) {
    return;
  }

  const progressState = state.frontier.tidewalkSurvey;
  const holdingAction = Boolean(input.analyze);
  if (!holdingAction || !tidewalkSurvey.inRange || state.signal <= 0) {
    progressState.progress = Math.max(0, progressState.progress - dt * 0.7);
  } else {
    state.signal = Math.max(0, state.signal - WORLD.tidewalkSurveyDrainPerSecond * dt);
    progressState.progress = Math.min(tidewalkSurvey.required, progressState.progress + dt);
  }

  if (progressState.progress >= tidewalkSurvey.required) {
    progressState.progress = 0;
    if (tidewalkSurvey.phase === "launch") {
      progressState.launched = true;
      progressState.tideStilledUntil = 0;
      state.scene = "tidewalk";
      state.player.x = TIDEWALK_SURVEY_SCENE.entry.x;
      state.player.y = TIDEWALK_SURVEY_SCENE.entry.y;
      state.pulses = [];
      state.clueLog.push("Tidewalk survey launched: Drowned Warehouse Survey");
      return;
    }

    const completedSiteId = tidewalkSurvey.nextSite?.id;
    if (completedSiteId) {
      resolveFrontierSurveySite(state, completedSiteId);
    }

    const nextSurvey = getFrontierSurvey(state);
    if (nextSurvey.complete) {
      progressState.launched = false;
      progressState.tideStilledUntil = 0;
      state.scene = "archive";
      state.player.x = TIDEWALK_SURVEY_SCENE.launchGate.x;
      state.player.y = TIDEWALK_SURVEY_SCENE.launchGate.y;
    }
    return;
  }

  if (state.scene !== "tidewalk" || tidewalkSurvey.phase !== "field" || tidewalkSurvey.tideStilled) {
    return;
  }

  const insideHazard = tidewalkSurvey.hazards.some(
    (hazard) => distance(state.player, hazard) <= hazard.radius + state.player.radius
  );
  if (insideHazard) {
    const tidePhase = state.frontier?.tide?.phase || "low";
    const mult = tidePhase === "low" ? 0.5 : tidePhase === "surge" ? 2.0 : 1.0;
    state.signal = Math.max(0, state.signal - WORLD.tideHazardDrainPerSecond * mult * dt);
    if (state.signal <= 0) {
      state.status = "failed";
      state.result = "Lost to the black tide";
    }
  }
}

function resolveTidewalkExpedition(state, input, dt) {
  const expedition = getTidewalkExpedition(state);
  if (!expedition.active || expedition.complete) {
    return;
  }

  const progressState = state.frontier.tidewalkExpedition;
  const holdingAction = Boolean(input.analyze);
  if (!holdingAction || !expedition.inRange || state.signal <= 0) {
    progressState.progress = Math.max(0, progressState.progress - dt * 0.7);
  } else {
    state.signal = Math.max(0, state.signal - WORLD.tidewalkExpeditionDrainPerSecond * dt);
    progressState.progress = Math.min(expedition.required, progressState.progress + dt);
  }

  if (progressState.progress >= expedition.required) {
    progressState.progress = 0;
    if (expedition.phase === "launch") {
      progressState.launched = true;
      state.scene = "tidewalk";
      state.player.x = TIDEWALK_SCENE.entry.x;
      state.player.y = TIDEWALK_SCENE.entry.y;
      state.pulses = [];
      state.clueLog.push("Tidewalk excursion launched: Brinehook Low Piers");
      return;
    }

    progressState.complete = true;
    state.scene = "archive";
    state.player.x = TIDEWALK_SCENE.launchGate.x;
    state.player.y = TIDEWALK_SCENE.launchGate.y;
    state.clueLog.push(expedition.completionTitle);
    state.clueLog.push(expedition.completionText);
    return;
  }

  if (state.scene !== "tidewalk" || expedition.tideStilled) {
    return;
  }

  const insideHazard = expedition.hazards.some(
    (hazard) => distance(state.player, hazard) <= hazard.radius + state.player.radius
  );
  if (insideHazard) {
    const tidePhase = state.frontier?.tide?.phase || "low";
    const mult = tidePhase === "low" ? 0.5 : tidePhase === "surge" ? 2.0 : 1.0;
    state.signal = Math.max(0, state.signal - WORLD.tideHazardDrainPerSecond * mult * dt);
    if (state.signal <= 0) {
      state.status = "failed";
      state.result = "Lost to the black tide";
    }
  }
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

    if (echo.huntTarget) {
      const dx = echo.huntTarget.x - echo.x;
      const dy = echo.huntTarget.y - echo.y;
      const remaining = Math.hypot(dx, dy);

      if (remaining < 5) {
        echo.huntTarget = null;
        continue;
      }

      const step = Math.min(remaining, echo.speed * 1.5 * dt);
      echo.x += (dx / remaining) * step;
      echo.y += (dy / remaining) * step;
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
    const arrival = FRONTIER_ARRIVALS[traverse.route.id];
    remember(state.frontier.traversedRouteIds, traverse.route.id);
    state.frontier.lastTraverse = {
      routeId: traverse.route.id,
      gateTitle: traverse.route.gateTitle,
      destinationName: traverse.route.destinationName,
      destinationBiome: traverse.route.destinationBiome,
      arrivalTitle: arrival?.title || traverse.route.destinationName,
      traversedAt: state.time
    };
    state.clueLog.push(`Frontier link secured: ${traverse.route.destinationName}`);
    if (arrival?.title) {
      state.clueLog.push(`Arrival logged: ${arrival.title}`);
    }
  }
}

function resolveFrontierCoastalOperation(state, input, dt) {
  const operation = getFrontierCoastalOperation(state);
  if (!operation.active || operation.complete) {
    return;
  }

  const currentProgress = state.frontier.coastalOperationProgress[operation.id] || 0;
  const holdingAction = Boolean(input.analyze);
  const canAdvance = holdingAction && operation.inRange && state.signal > 0;

  if (!canAdvance) {
    state.frontier.coastalOperationProgress[operation.id] = Math.max(0, currentProgress - dt * 0.7);
    return;
  }

  state.signal = Math.max(0, state.signal - WORLD.coastalOperationDrainPerSecond * dt);
  const nextProgress = Math.min(WORLD.coastalOperationSeconds, currentProgress + dt);
  state.frontier.coastalOperationProgress[operation.id] = nextProgress;

  if (nextProgress >= WORLD.coastalOperationSeconds) {
    remember(state.frontier.resolvedCoastalOperationIds, operation.id);
    state.frontier.lastCoastalOperation = {
      id: operation.id,
      routeId: operation.routeId,
      title: operation.completionTitle,
      resolvedAt: state.time
    };
    if (operation.signalReward > 0) {
      state.signal = Math.min(100, state.signal + operation.signalReward);
    }
    state.clueLog.push(`Coastal route scoped: ${operation.completionTitle}`);
    state.clueLog.push(operation.completionText);
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

function getFrontierArrivalRouteId(state) {
  const traversedRouteIds = state.frontier?.traversedRouteIds || [];
  if (traversedRouteIds.length === 0) {
    return null;
  }

  return state.frontier?.lastTraverse?.routeId || traversedRouteIds[traversedRouteIds.length - 1];
}

function inactiveFrontierArrival() {
  return {
    active: false,
    routeId: null,
    gateTitle: null,
    destinationName: null,
    destinationBiome: null,
    title: null,
    summary: null,
    encounterTitle: null,
    encounterText: null,
    settlementName: null,
    settlementText: null,
    resourceTitle: null,
    resourceText: null,
    nextHook: null
  };
}

function inactiveFrontierEncounter() {
  return {
    active: false,
    routeId: null,
    id: null,
    resolved: false,
    actionLabel: null,
    pendingNote: null,
    resolvedTitle: null,
    resolvedText: null,
    resolvedNote: null,
    resolvedHook: null,
    note: null
  };
}

function inactiveFrontierSurvey() {
  return {
    active: false,
    complete: false,
    routeId: null,
    title: null,
    summary: null,
    completedCount: 0,
    totalSiteCount: 0,
    hostileSalvageMarked: false,
    resourceTitle: null,
    resourceText: null,
    nextHook: null,
    sites: [],
    nextSite: null
  };
}

function inactiveFrontierRouteChoice() {
  return {
    active: false,
    routeId: null,
    selectedChoice: null,
    choices: [],
    prompt: null
  };
}

function inactiveBlackKeelStorylet() {
  return {
    active: false,
    id: null,
    title: null,
    headline: null,
    opening: null,
    twist: null,
    reward: null,
    nextHook: null,
    unlockedFlags: [],
    riskTags: [],
    selectedChoice: null,
    knowsBlackKeel: false,
    factionPressure: 0,
    settlementTrust: 0
  };
}

function inactiveFrontierCoastalOperation() {
  return {
    active: false,
    id: null,
    routeId: null,
    choiceId: null,
    gateTitle: null,
    title: null,
    briefing: null,
    completionTitle: null,
    completionText: null,
    leadTarget: null,
    nextHook: null,
    complete: false,
    inRange: false,
    progress: 0,
    required: WORLD.coastalOperationSeconds,
    gate: null
  };
}

function inactiveTidewalkSurveyField() {
  return {
    active: false,
    phase: null,
    title: null,
    briefing: null,
    launched: false,
    completedCount: 0,
    totalSiteCount: 0,
    nextSite: null,
    sites: [],
    target: null,
    inRange: false,
    progress: 0,
    required: WORLD.tidewalkSurveySeconds,
    tideStilled: false,
    hazards: [],
    obstacles: []
  };
}

function inactiveTidewalkExpedition() {
  return {
    active: false,
    phase: null,
    launched: false,
    complete: false,
    choiceId: null,
    title: null,
    label: null,
    completionTitle: null,
    completionText: null,
    target: null,
    inRange: false,
    progress: 0,
    required: WORLD.tidewalkExpeditionSeconds,
    tideStilled: false,
    hazards: [],
    obstacles: []
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
