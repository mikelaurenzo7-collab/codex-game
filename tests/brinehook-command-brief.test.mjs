import assert from "node:assert/strict";
import { getBrinehookCommandBrief } from "../src/brinehook-command-brief.js";

{
  const brief = getBrinehookCommandBrief({
    location: "Fragments 1/3",
    status: "Sweep the archive",
    objective: "Trace memory signal"
  });
  assert.equal(brief.active, false);
  assert.equal(brief.title, "Brinehook offline");
}

{
  const brief = getBrinehookCommandBrief({
    location: "Brinehook Low Piers (SURGE TIDE)",
    status: "Brinehook Low Piers",
    objective: "Reveal and recover at least two cargo pings while managing the sentinel."
  });
  assert.equal(brief.active, true);
  assert.equal(brief.tone, "danger");
  assert.equal(brief.eyebrow, "BRINEHOOK // SURGE TIDE");
  assert.match(brief.instruction, /still black tide/i);
}

{
  const brief = getBrinehookCommandBrief({
    location: "Brinehook Low Piers (LOW TIDE)",
    status: "Black tide suppressed",
    objective: "Reach the Black-Keel underpier cache"
  });
  assert.equal(brief.tone, "clear");
  assert.equal(brief.title, "BLACK TIDE STILLED");
  assert.match(brief.instruction, /reposition/i);
}

console.log("brinehook command brief tests passed");