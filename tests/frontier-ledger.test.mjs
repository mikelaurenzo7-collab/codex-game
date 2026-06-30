import assert from "node:assert/strict";
import { createGameState } from "../src/game-state.js";
import { formatFrontierLedgerLead, getFrontierLedger } from "../src/frontier-ledger.js";

function mappedState() {
  const state = createGameState();
  state.atlas.discoveredRouteIds = ["intake-coastline-lift", "fen-deep-green-verge"];
  state.atlas.chartedRouteIds = ["intake-coastline-lift", "fen-deep-green-verge"];
  state.atlas.discoveredLandmarkIds = ["salvager-camp", "east-relay-basin"];
  return state;
}

function readyTidewalk(choiceId, outcome = null) {
  const state = mappedState();
  state.frontier.traversedRouteIds = ["intake-coastline-lift"];
  state.frontier.lastTraverse = { routeId: "intake-coastline-lift", traversedAt: 0 };
  state.frontier.resolvedEncounterIds = ["tidewalk-docking-rights"];
  state.frontier.surveyedSiteIds = ["north-spool-house", "lamp-black-warehouse"];
  state.frontier.discoveredCoastalClueIds = ["warehouse-ledger", "black-keel-mark"];
  state.frontier.selectedRouteChoiceId = choiceId;
  state.frontier.lastRouteChoice = { routeId: "intake-coastline-lift", choiceId, label: choiceId, chosenAt: 0 };

  if (outcome) {
    state.frontier.brinehookAftermath = {
      branch: choiceId,
      outcome,
      recoveredCargo: 2,
      resolvedAt: 0
    };
  }

  return state;
}

{
  const ledger = getFrontierLedger(createGameState());
  assert.equal(ledger.active, true);
  assert.equal(ledger.lead.routeId, "intake-coastline-lift");
  assert.equal(ledger.entries.length, 3);
  assert.match(formatFrontierLedgerLead(ledger), /Raised Dock Hamlet/);
}

{
  const ledger = getFrontierLedger(mappedState());
  assert.equal(ledger.active, true);
  assert.equal(ledger.entries.some((entry) => entry.routeId === "fen-deep-green-verge"), true);
  assert.equal(ledger.lead.routeId, "intake-coastline-lift");
  assert.equal(ledger.lead.name, "Raised Dock Hamlet");
  assert.equal(ledger.lead.viability, 3);
  assert.equal(ledger.lead.stage, "Charted");
  assert.match(ledger.lead.nextAction, /Coastline Lift/);
}

{
  const ledger = getFrontierLedger(readyTidewalk("black-keel-countermark", "escaped-with-cargo"));
  const tidewalk = ledger.entries.find((entry) => entry.routeId === "intake-coastline-lift");
  assert.equal(tidewalk.name, "Tidelantern Quay");
  assert.equal(tidewalk.stage, "Pressured");
  assert.equal(tidewalk.viability, 2);
  assert.match(tidewalk.detailText, /Trust 2\/5/);
  assert.match(tidewalk.detailText, /Pressure 5\/5/);
  assert.equal(ledger.lead.routeId, "fen-deep-green-verge");
  assert.match(ledger.lead.nextAction, /Fen Outflow Sluice/);
}

{
  const ledger = getFrontierLedger(readyTidewalk("quay-safe-lantern-line", "witness-secured"));
  const tidewalk = ledger.entries.find((entry) => entry.routeId === "intake-coastline-lift");
  assert.equal(tidewalk.name, "Tidelantern Quay");
  assert.equal(tidewalk.stage, "Secured");
  assert.equal(tidewalk.viability, 5);
  assert.match(tidewalk.detailText, /Trust 5\/5/);
  assert.match(tidewalk.detailText, /Pressure 1\/5/);
  assert.equal(ledger.lead.routeId, "intake-coastline-lift");
  assert.match(formatFrontierLedgerLead(ledger), /Tidelantern Quay/);
}

console.log("frontier ledger tests passed");
