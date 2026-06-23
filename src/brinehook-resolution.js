import { getBrinehookEncounterState } from "./brinehook-encounter.js";

const RESOLUTION_PRESENTATION = {
  dormant: {
    tone: "muted",
    hudText: "Brinehook dormant",
    statusText: "Pier route inactive",
    primerTitle: "Brinehook dormant",
    primerText: "Reach Brinehook Low Piers before resolving the pier encounter.",
    markerLabel: "Pier dormant"
  },
  hunted: {
    tone: "danger",
    hudText: "Recover 2 cargo pings · evade sentinel",
    statusText: "Black-Keel hunt active",
    primerTitle: "Black-Keel hunt unresolved",
    primerText: "Pulse near hidden salvage, recover two cargo pings, and manage the red sentinel before leaving the underpier.",
    markerLabel: "Hunted"
  },
  "cargo-under-hunt": {
    tone: "warning",
    hudText: "Cargo held · suppress sentinel",
    statusText: "Cargo under hunt",
    primerTitle: "Cargo found under pursuit",
    primerText: "The cache is in hand, but the sentinel still owns the route home. Pulse near the hunter to suppress it before extraction.",
    markerLabel: "Suppress hunter"
  },
  "escaped-with-cargo": {
    tone: "success",
    hudText: "Countermark cache extracted",
    statusText: "Black-Keel cache secured",
    primerTitle: "Countermark cache extracted",
    primerText: "Enough cargo is recovered and the sentinel is suppressed. Return inland before Black-Keel regroups.",
    markerLabel: "Extraction ready"
  },
  "safe-line-ahead": {
    tone: "safe",
    hudText: "Reach lantern haven · recover cargo",
    statusText: "Lantern line ahead",
    primerTitle: "Safe line ahead",
    primerText: "Move into the lantern haven, then recover one cargo ping so the witness line has physical proof.",
    markerLabel: "Reach haven"
  },
  "haven-holding": {
    tone: "safe",
    hudText: "Haven holding · recover 1 cargo",
    statusText: "Lantern haven holding",
    primerTitle: "Lantern haven holding",
    primerText: "The haven light is stable. Recover one visible cargo ping before escorting the witness line home.",
    markerLabel: "Recover proof"
  },
  "witness-secured": {
    tone: "success",
    hudText: "Witness line secured",
    statusText: "Lantern witness secured",
    primerTitle: "Witness line secured",
    primerText: "The quay can vouch for the archive and the recovered cargo proof keeps the coast open.",
    markerLabel: "Escort ready"
  }
};

function countRecoveredCargo(encounter) {
  if (Number.isFinite(encounter?.recoveredCargo)) {
    return encounter.recoveredCargo;
  }

  return Array.isArray(encounter?.cargoRecovered) ? encounter.cargoRecovered.length : 0;
}

function buildOutcome({ encounter, recoveredCargo }) {
  if (!encounter.active) {
    return {
      status: "dormant",
      title: "Brinehook dormant",
      objective: "Reach Brinehook Low Piers before resolving the encounter.",
      consequence: "No pier decision is active yet.",
      complete: false
    };
  }

  if (encounter.branch === "black-keel-countermark") {
    const sentinelSuppressed = encounter.threat?.pressure === "suppressed";
    const enoughCargo = recoveredCargo >= 2;

    if (sentinelSuppressed && enoughCargo) {
      return {
        status: "escaped-with-cargo",
        title: "Countermark cache extracted",
        objective: "Return inland before Black-Keel regroups.",
        consequence: "The archive escapes with enough salvage evidence to force the next Black-Keel pursuit.",
        complete: true
      };
    }

    if (enoughCargo) {
      return {
        status: "cargo-under-hunt",
        title: "Cargo found under pursuit",
        objective: "Pulse to suppress the sentinel, then leave the pier with the recovered cache.",
        consequence: "The evidence is real, but the hunter still owns the route home.",
        complete: false
      };
    }

    return {
      status: "hunted",
      title: "Black-Keel hunt unresolved",
      objective: "Reveal and recover at least two cargo pings while managing the sentinel.",
      consequence: "Leaving now would turn the countermark into rumor instead of proof.",
      complete: false
    };
  }

  const havenHolding = Boolean(encounter.supportZone?.inRange);
  const enoughCargo = recoveredCargo >= 1;

  if (havenHolding && enoughCargo) {
    return {
      status: "witness-secured",
      title: "Witness line secured",
      objective: "Escort the witness line home with the recovered cargo noted.",
      consequence: "The quay can vouch for the archive and the coast stays open.",
      complete: true
    };
  }

  if (havenHolding) {
    return {
      status: "haven-holding",
      title: "Lantern haven holding",
      objective: "Recover one visible cargo ping before leaving the safe haven.",
      consequence: "The witness line is stable, but it needs a physical token to matter inland.",
      complete: false
    };
  }

  return {
    status: "safe-line-ahead",
    title: "Safe line ahead",
    objective: "Reach the lantern safe haven and recover one cargo ping.",
    consequence: "The quay cannot witness the archive from outside the haven light.",
    complete: false
  };
}

function chooseMapTarget(resolution) {
  const encounter = resolution.encounter;
  if (!resolution.active) {
    return null;
  }

  if (resolution.status === "cargo-under-hunt" && encounter.threat) {
    return {
      kind: "sentinel",
      x: encounter.threat.x,
      y: encounter.threat.y,
      radius: 48
    };
  }

  if (resolution.status === "safe-line-ahead" && encounter.supportZone) {
    return {
      kind: "haven",
      x: encounter.supportZone.x,
      y: encounter.supportZone.y,
      radius: 70
    };
  }

  const cargo = encounter.cargo?.find((item) => item.revealed && !item.collected) ||
    encounter.cargo?.find((item) => !item.collected) ||
    null;

  if (!cargo) {
    return null;
  }

  return {
    kind: cargo.revealed ? "cargo" : "cargo-search",
    x: cargo.x,
    y: cargo.y,
    radius: cargo.revealed ? 34 : 80
  };
}

export function getBrinehookResolutionState(state) {
  const encounter = getBrinehookEncounterState(state);
  const recoveredCargo = countRecoveredCargo(encounter);
  const outcome = buildOutcome({ encounter, recoveredCargo });

  return {
    active: encounter.active,
    branch: encounter.branch,
    branchLabel: encounter.branchLabel,
    recoveredCargo,
    visibleCargo: encounter.visibleCargo || 0,
    encounter,
    ...outcome,
    bottomLogText: `${outcome.title}: ${outcome.objective}`
  };
}

export function getBrinehookResolutionClientState(state) {
  const resolution = getBrinehookResolutionState(state);
  const presentation = RESOLUTION_PRESENTATION[resolution.status] || RESOLUTION_PRESENTATION.dormant;
  const target = chooseMapTarget(resolution);

  return {
    active: resolution.active,
    complete: resolution.complete,
    status: resolution.status,
    branch: resolution.branch,
    branchLabel: resolution.branchLabel,
    tone: presentation.tone,
    hudText: presentation.hudText,
    statusText: presentation.statusText,
    primerTitle: presentation.primerTitle,
    primerText: presentation.primerText,
    marker: target
      ? {
          ...target,
          label: presentation.markerLabel,
          complete: resolution.complete,
          tone: presentation.tone
        }
      : null,
    bottomLogText: resolution.complete
      ? `${resolution.title}: ${resolution.consequence}`
      : resolution.bottomLogText
  };
}

export function formatBrinehookResolution(state) {
  const resolution = getBrinehookResolutionState(state);
  return `${resolution.title} — ${resolution.consequence}`;
}
