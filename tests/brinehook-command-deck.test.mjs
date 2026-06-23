import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const client = readFileSync(new URL("../src/brinehook-command-deck.js", import.meta.url), "utf8");

assert.match(index, /brinehook-command-deck\.css/);
assert.match(index, /id="brinehookCommandDeck"/);
assert.match(index, /src="\.\/src\/brinehook-command-deck\.js"/);
assert.match(client, /getBrinehookCommandBrief/);
assert.match(client, /MutationObserver/);
assert.match(client, /fragmentReadout/);
assert.match(client, /objectiveReadout/);

console.log("brinehook command deck client tests passed");