# Automation Run 0047 — The Resonance Broadcast

## State Assessment

Pulled origin/main (squash-merged from PR #4). All 27 suites passed clean. The
highest-leverage gap: the coastal journey through Brinehook has real consequences
in resolution state, but returning to the archive with that intel produces no
mechanical reward. The Rewritten Cartography Table at (1080, 760) sits at the center
of the map — the thematically correct anchor for a "knowledge burst" mechanic.

## Strategic Choice

**A. Core Mechanic Deep Dive.**

The Resonance Broadcast turns the cartography table into a one-time superpower
unlocked by completing the coastal expedition. It gives agency to the intel-return
loop and makes the route choice feel consequential all the way back to the archive.

## Work Completed

- **`GAME_SAVE_VERSION`** bumped from 4 → 5; checkpoint validator now requires
  `resonanceBroadcast: boolean`.
- **`RESONANCE_NODE`** constant exported from `src/game-state.js` at `{x:1080, y:760, radius:65}`.
- **`getResonanceNode(state)`** selector added: active when `tidewalkExpedition.complete`
  is true and `resonanceBroadcast` is false; exposes `inRange`, `broadcast`, position.
- **`triggerPulse`** extended: after normal archive-pulse effects, checks resonance node;
  on first pulse at the active node — sets `resonanceBroadcast = true`, stuns all echoes
  8 seconds, reveals all uncollected fragments 15 seconds, adds +30 signal.
- **`createGameState`** initializes `resonanceBroadcast: false`.
- **`src/game.js`**: imported `RESONANCE_NODE` and `getResonanceNode`; added
  `drawResonanceNode()` between `drawRelays` and `drawFragments` — animated golden
  dashed ring while active, subtle static ring after broadcast, inner glow + tighter
  ring when player is in range.
- **`tests/resonance-node.test.mjs`**: 6 assertion blocks covering inactive state,
  active state, in-range detection, full broadcast cascade, one-shot guard, and
  initial state shape.
- **`tests/run-all.mjs`**: registered `resonance-node.test.mjs`.
- **`docs/AGA_STATE.md`**: updated current state bullet and iteration log.

## Validation

`node --check src/game-state.js` — no syntax errors.
`node --check src/game.js` — no syntax errors.
`node tests/run-all.mjs` — all 28 suites passed.

## Next Bottleneck

Build a Brinehook exit/return transition: when a resolution state reaches `complete`
(`escaped-with-cargo` or `witness-secured`), give the player a way to leave the pier
with the outcome recorded in the arrival dossier so the coastal leg has a narrative
close and the world reflects what happened there.
