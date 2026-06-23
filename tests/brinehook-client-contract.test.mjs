import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const gameClient = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");

const sceneContractIndex = indexHtml.indexOf("var BRINEHOOK_SCENE =");
const moduleIndex = indexHtml.indexOf('<script type="module" src="./src/game.js"></script>');

assert.ok(sceneContractIndex > -1, "index.html must expose the Brinehook scene contract before loading the game client");
assert.ok(moduleIndex > sceneContractIndex, "Brinehook scene contract must be declared before the module client executes");
assert.match(gameClient, /BRINEHOOK_SCENE\.piers/, "the Canvas client should draw the Brinehook pier contract");

const pierMatches = indexHtml.match(/\{ x: \d+, y: \d+, width: \d+, height: \d+ \}/g) || [];
assert.equal(pierMatches.length, 6, "Brinehook should expose the six authored low-pier collision silhouettes");

console.log("brinehook client contract tests passed");
