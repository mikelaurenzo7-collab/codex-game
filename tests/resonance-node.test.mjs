import assert from "node:assert/strict";
import {
  RESONANCE_NODE,
  createGameState,
  getResonanceNode,
  triggerPulse,
  updateGameState
} from "../src/game-state.js";

function completeExpedition(state) {
  state.frontier.traversedRouteIds = ["intake-coastline-lift"];
  state.frontier.resolvedEncounterIds = ["tidewalk-docking-rights"];
  state.frontier.surveyedSiteIds = ["north-spool-house", "lamp-black-warehouse"];
  state.frontier.discoveredCoastalClueIds = ["warehouse-ledger", "black-keel-mark"];
  state.frontier.selectedRouteChoiceId = "quay-safe-lantern-line";
  state.frontier.lastRouteChoice = {
    routeId: "intake-coastline-lift",
    choiceId: "quay-safe-lantern-line",
    label: "quay-safe-lantern-line",
    chosenAt: 0
  };
  state.frontier.resolvedCoastalOperationIds = ["lantern-line-witness-sync"];
  state.frontier.tidewalkExpedition.launched = true;
  state.frontier.tidewalkExpedition.complete = true;
}

{
  const state = createGameState();
  const node = getResonanceNode(state);
  assert.equal(node.active, false, "node inactive before expedition");
  assert.equal(node.broadcast, false);
}

{
  const state = createGameState();
  completeExpedition(state);
  const node = getResonanceNode(state);
  assert.equal(node.active, true, "node active after expedition complete");
  assert.equal(node.broadcast, false);
  assert.equal(node.inRange, false, "player not at node initially");
  assert.equal(node.x, RESONANCE_NODE.x);
  assert.equal(node.y, RESONANCE_NODE.y);
}

{
  const state = createGameState();
  completeExpedition(state);
  state.player.x = RESONANCE_NODE.x;
  state.player.y = RESONANCE_NODE.y;
  const node = getResonanceNode(state);
  assert.equal(node.inRange, true, "player in range when at node");
}

{
  const state = createGameState();
  completeExpedition(state);
  state.player.x = RESONANCE_NODE.x;
  state.player.y = RESONANCE_NODE.y;
  state.signal = 80;
  state.fragments[0].collected = true;

  const prePulseSignal = state.signal;
  assert.equal(triggerPulse(state), true);

  assert.equal(state.resonanceBroadcast, true, "broadcast flag set");
  assert.ok(state.signal > prePulseSignal - 24, "signal boosted by +30 after pulse cost");

  for (const echo of state.echoes) {
    assert.ok(echo.stunnedUntil >= state.time + 7.5, "all echoes stunned 8s by broadcast");
  }

  for (const fragment of state.fragments) {
    if (!fragment.collected) {
      assert.ok(
        fragment.revealedUntil >= state.time + 14.5,
        `fragment ${fragment.id} revealed 15s by broadcast`
      );
    }
  }

  assert.equal(state.fragments[0].revealedUntil, 0, "collected fragment not touched");
}

{
  const state = createGameState();
  completeExpedition(state);
  state.player.x = RESONANCE_NODE.x;
  state.player.y = RESONANCE_NODE.y;
  state.signal = 80;

  triggerPulse(state);
  assert.equal(state.resonanceBroadcast, true);

  const stunAfterFirst = state.echoes[0].stunnedUntil;
  state.signal = 80;
  state.pulseCooldownUntil = 0;

  triggerPulse(state);
  assert.equal(state.echoes[0].stunnedUntil, stunAfterFirst, "broadcast does not re-trigger");
}

{
  const state = createGameState();
  assert.equal(typeof state.resonanceBroadcast, "boolean", "resonanceBroadcast is boolean in initial state");
  assert.equal(state.resonanceBroadcast, false);
}

console.log("resonance node tests passed");
