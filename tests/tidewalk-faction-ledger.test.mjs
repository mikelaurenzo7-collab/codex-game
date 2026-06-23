import assert from "node:assert/strict";
import { formatTidewalkFactionLedger, getTidewalkFactionLedger } from "../src/tidewalk-faction-ledger.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 70,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const ledger = getTidewalkFactionLedger(createState());
  assert.equal(ledger.active, true);
  assert.equal(ledger.complete, false);
  assert.equal(ledger.previewRow.contactId, "lantern-tender");
  assert.equal(ledger.previewRow.trustDelta, 2);
  assert.equal(ledger.previewRow.heatDelta, -1);
  assert.match(formatTidewalkFactionLedger(ledger), /Faction debts previewed/);
}

{
  const ledger = getTidewalkFactionLedger(createState({ x: 1570, y: 860 }));
  assert.equal(ledger.previewRow.contactId, "black-keel-scout");
  assert.equal(ledger.previewRow.truthDelta, 2);
  assert.match(ledger.previewRow.debt, /safety was traded/);
}

{
  const ledger = getTidewalkFactionLedger(createState({ selectedRouteChoiceId: "black-keel-countermark" }));
  assert.equal(ledger.complete, true);
  assert.equal(ledger.selectedRow.contactId, "black-keel-scout");
  assert.deepEqual(ledger.net, { trust: -1, heat: 2, truth: 2 });
  assert.match(formatTidewalkFactionLedger(ledger), /Faction debt recorded/);
}

console.log("tidewalk faction ledger tests passed");
