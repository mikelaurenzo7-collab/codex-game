import { getBrinehookEncounterState } from "./brinehook-encounter.js";

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

export function formatBrinehookResolution(state) {
  const resolution = getBrinehookResolutionState(state);
  return `${resolution.title} — ${resolution.consequence}`;
}
