import assert from "node:assert/strict";
import {
  TIDEWALK_CONTACTS,
  getTidewalkContactPlan,
  resolveTidewalkContactChoice
} from "../src/tidewalk-contact.js";

{
  const plan = getTidewalkContactPlan();
  assert.equal(plan.active, false);
  assert.equal(plan.complete, false);
  assert.match(plan.prompt, /Survey both drowned warehouses/);
}

{
  const plan = getTidewalkContactPlan({ surveyedSiteIds: "not-an-array" });
  assert.equal(plan.active, false);
  assert.equal(plan.complete, false);
}

{
  const plan = getTidewalkContactPlan({
    surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"]
  });
  assert.equal(plan.active, true);
  assert.equal(plan.complete, false);
  assert.equal(plan.contacts.length, 2);
  assert.notDeepEqual(plan.contacts[0].target, plan.contacts[1].target);
  assert.ok(plan.contacts.every((contact) => contact.radius > 0));
}

{
  const state = {
    time: 42,
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId: null
    }
  };

  const contact = resolveTidewalkContactChoice(state, "lantern-tender");
  assert.equal(contact.choiceId, "quay-safe-lantern-line");
  assert.equal(state.frontier.selectedRouteChoiceId, "quay-safe-lantern-line");
  assert.equal(state.frontier.lastRouteChoice.contactId, "lantern-tender");
  assert.equal(state.frontier.lastRouteChoice.chosenAt, 42);
  assert.match(state.clueLog[0], /Lantern tender/);
  assert.equal(resolveTidewalkContactChoice(state, "black-keel-scout"), null);

  const completePlan = getTidewalkContactPlan(state.frontier);
  assert.equal(completePlan.active, false);
  assert.equal(completePlan.complete, true);
}

{
  const state = {
    clueLog: [],
    frontier: {
      surveyedSiteIds: ["north-spool-house", "lamp-black-warehouse"],
      selectedRouteChoiceId: null
    }
  };

  assert.equal(resolveTidewalkContactChoice(state, "missing-contact"), null);
  assert.equal(state.frontier.selectedRouteChoiceId, null);
  assert.equal(TIDEWALK_CONTACTS.some((contact) => contact.id === "black-keel-scout"), true);

  const contact = resolveTidewalkContactChoice(state, "black-keel-scout");
  assert.equal(contact.choiceId, "black-keel-countermark");
  assert.equal(state.frontier.lastRouteChoice.chosenAt, 0);
}

console.log("tidewalk contact tests passed");
