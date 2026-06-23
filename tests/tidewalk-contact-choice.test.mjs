import assert from "node:assert/strict";
import {
  CONTACT_CHOICES,
  CONTACT_HOLD_SECONDS,
  CONTACT_RADIUS,
  createContactChoiceState,
  getContactChoiceStatus,
  updateContactChoiceState
} from "../src/tidewalk-contact-choice-state.js";

function holdAtChoice(choiceId) {
  const state = createContactChoiceState();
  const choice = CONTACT_CHOICES.find((candidate) => candidate.id === choiceId);
  assert.ok(choice, `expected fixture for ${choiceId}`);
  state.player.x = choice.target.x;
  state.player.y = choice.target.y;
  for (let t = 0; t < CONTACT_HOLD_SECONDS + 0.1; t += 0.05) {
    updateContactChoiceState(state, { analyze: true }, 0.05);
  }
  return state;
}

{
  const state = createContactChoiceState();
  const status = getContactChoiceStatus(state);
  assert.equal(status.active, true);
  assert.equal(status.complete, false);
  assert.equal(status.choices.length, 2);
  assert.equal(status.selectedChoice, null);
}

{
  const state = createContactChoiceState();
  const lantern = CONTACT_CHOICES.find((choice) => choice.id === "quay-safe-lantern-line");
  state.player.x = lantern.target.x + CONTACT_RADIUS + 12;
  state.player.y = lantern.target.y;
  updateContactChoiceState(state, { analyze: true }, CONTACT_HOLD_SECONDS * 2);
  assert.equal(state.selectedChoiceId, null, "holding outside a contact ring must not commit a route");
}

{
  const state = holdAtChoice("quay-safe-lantern-line");
  const status = getContactChoiceStatus(state);
  assert.equal(status.complete, true);
  assert.equal(status.selectedChoice.id, "quay-safe-lantern-line");
  assert.ok(state.log.at(-1).includes("rival salvagers"));
}

{
  const state = holdAtChoice("black-keel-countermark");
  const status = getContactChoiceStatus(state);
  assert.equal(status.complete, true);
  assert.equal(status.selectedChoice.id, "black-keel-countermark");
  assert.ok(state.log.at(-1).includes("hostile salvage network"));

  const lantern = CONTACT_CHOICES.find((choice) => choice.id === "quay-safe-lantern-line");
  state.player.x = lantern.target.x;
  state.player.y = lantern.target.y;
  updateContactChoiceState(state, { analyze: true }, CONTACT_HOLD_SECONDS * 2);
  assert.equal(state.selectedChoiceId, "black-keel-countermark", "route commitment cannot be overwritten");
}

console.log("tidewalk contact choice tests passed");
