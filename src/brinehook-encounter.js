import { getTidewalkExpedition, distance } from "./game-state.js";

export function getBrinehookEncounterState(state) {
  const expedition = getTidewalkExpedition(state);
  const progressState = state.frontier?.tidewalkExpedition || {};
  const cargoItems = Array.isArray(progressState.cargoItems) ? progressState.cargoItems : [];
  const sentinel = progressState.sentinel || null;
  const active = expedition.active && expedition.phase === "field" && !expedition.complete;

  if (!active) {
    return {
      active: false,
      branch: null,
      threat: null,
      cargo: [],
      cargoRecovered: state.frontier?.cargo || [],
      supportZone: null,
      bottomLogText: "Brinehook encounter dormant."
    };
  }

  const threat = sentinel
    ? {
        active: true,
        x: sentinel.x,
        y: sentinel.y,
        stunned: sentinel.stunUntil > state.time,
        distanceToPlayer: Math.round(distance(state.player, sentinel)),
        pressure: sentinel.stunUntil > state.time ? "suppressed" : "hunting"
      }
    : null;

  const supportZone = expedition.choiceId === "quay-safe-lantern-line"
    ? {
        active: true,
        label: "Lantern safe haven",
        x: expedition.leadTarget.x,
        y: expedition.leadTarget.y,
        inRange: distance(state.player, expedition.leadTarget) <= 150
      }
    : null;

  const cargo = cargoItems.map((item) => ({
    id: item.id,
    title: item.title,
    x: item.x,
    y: item.y,
    revealed: Boolean(item.revealed),
    collected: Boolean(item.collected),
    distanceToPlayer: Math.round(distance(state.player, item))
  }));

  const visibleCargo = cargo.filter((item) => item.revealed && !item.collected).length;
  const recoveredCargo = cargo.filter((item) => item.collected).length;
  const branchLabel = expedition.choiceId === "black-keel-countermark" ? "Black-Keel underpier" : "Lantern witness line";

  return {
    active: true,
    branch: expedition.choiceId,
    branchLabel,
    threat,
    cargo,
    visibleCargo,
    recoveredCargo,
    cargoRecovered: state.frontier?.cargo || [],
    supportZone,
    bottomLogText: threat
      ? `${branchLabel}: sentinel ${threat.pressure}, ${visibleCargo} cargo pings visible.`
      : `${branchLabel}: haven ${supportZone?.inRange ? "holding" : "ahead"}, ${visibleCargo} cargo pings visible.`
  };
}
