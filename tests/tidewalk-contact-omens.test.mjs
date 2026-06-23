import assert from "node:assert/strict";
import {
  formatTidewalkContactOmen,
  getTidewalkContactOmenDeck
} from "../src/tidewalk-contact-omens.js";

function createState({ scene = "tidewalk", x = 1580, y = 260, selectedRouteChoiceId = null } = {}) {
  return {
    scene,
    time: 42,
    player: { x, y },
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId
    }
  };
}

{
  const deck = getTidewalkContactOmenDeck(createState());
  assert.equal(deck.active, true);
  assert.equal(deck.complete, false);
  assert.equal(deck.rows.length, 2);
  assert.equal(deck.focusOmen.contactId, "lantern-tender");
  assert.equal(deck.focusOmen.title, "Witness Line");
  assert.match(formatTidewalkContactOmen(deck), /Ready: Witness Line/);
  assert.match(formatTidewalkContactOmen(deck), /Cost:/);
}

{
  const deck = getTidewalkContactOmenDeck(createState({ x: 1570, y: 860 }));
  assert.equal(deck.focusOmen.contactId, "black-keel-scout");
  assert.equal(deck.focusOmen.title, "Countermark Pursuit");
  assert.match(deck.focusOmen.worldTag, /heat rises/);
}

{
  const deck = getTidewalkContactOmenDeck(createState({ selectedRouteChoiceId: "quay-safe-lantern-line" }));
  assert.equal(deck.active, false);
  assert.equal(deck.complete, true);
  assert.equal(deck.selectedOmen.contactId, "lantern-tender");
  assert.match(formatTidewalkContactOmen(deck), /Chosen: Witness Line/);
}

{
  const deck = getTidewalkContactOmenDeck(createState({ scene: "archive" }));
  assert.equal(deck.active, false);
  assert.equal(deck.complete, false);
  assert.equal(deck.rows.length, 2);
  assert.equal(formatTidewalkContactOmen({ title: "No omen" }), "No omen");
}

console.log("tidewalk contact omen tests passed");
