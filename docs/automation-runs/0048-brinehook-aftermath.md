# Automation Run 0048 — Brinehook Aftermath & Pier Return

## State Assessment

Pulled origin/main (squash-merged from PR #5, 29 suites passing). The Resonance Broadcast
closed the intel-return reward loop, but the coastal journey still had no narrative close:
completing Brinehook resolution left the player stranded on the pier with no exit and no
world consequence recorded. The arrival dossier showed stale pre-expedition text regardless
of what happened on the coast.

## Strategic Choice

**B. World/Narrative Expansion.**

The Brinehook aftermath system closes the coastal loop end-to-end: resolution → pier exit →
dossier update. It makes the route choice (`black-keel-countermark` vs `quay-safe-lantern-line`)
consequential in the permanent world state, not just in the field moment.

## Work Completed

- **`GAME_SAVE_VERSION`** bumped 5 → 6; checkpoint validator now requires
  `tidewalkExpedition.exitProgress: number`, `tidewalkExpedition.resolutionAchieved: boolean`,
  and `brinehookAftermath: null | object`.
- **`BRINEHOOK_AFTERMATH_DATA`** constant — authored consequences for both outcomes:
  faction pressure (1–5), settlement trust (1–5), resource title/text, next hook.
- **`getBrinehookAftermath(state)`** selector — reads `frontier.brinehookAftermath` and
  returns full authored aftermath record.
- **`getBrinehookPierExit(state)`** selector — active when `resolutionAchieved` flag is set
  and aftermath not yet recorded; exposes `inRange`, `progress`, `gate`.
- **`resolveResolutionAchieved(state)`** — private ticker that stamps `resolutionAchieved: true`
  the first tick the resolution conditions (cargo + sentinel suppressed / haven holding + cargo)
  are simultaneously met, so the flag survives player movement away from the haven.
- **`resolveBrinehookPierExit(state, input, dt)`** — hold-E progress at launch gate when active;
  on completion records aftermath and switches scene back to archive at player spawn.
- **`resolveTidewalkExpedition`** extended — also records aftermath when the existing lead-target
  hold completes and `resolutionAchieved` is already set.
- **`getFrontierArrival`** updated — aftermath takes precedence over all other text layers for
  `title`, `settlementText`, `resourceTitle`, `resourceText`, `nextHook`; exposes `aftermath`
  field for callers.
- **`src/game.js`**: imported `getBrinehookAftermath`, `getBrinehookPierExit`; added
  `drawPierExit()` (animated green ring, fill arc, called in tidewalk scene branch); updated
  `statusReadout` and `formatObjective` to show pier exit distance/progress and aftermath title.
- **`tests/brinehook-aftermath.test.mjs`**: 7 assertion blocks covering inactive state, pier
  exit blocked before resolution, pier exit active after resolution achieved, full lantern exit
  (aftermath recorded, player in archive), full black-keel exit, dossier consequences, and
  one-shot seal guard.
- **`tests/run-all.mjs`**: registered `brinehook-aftermath.test.mjs`.
- **`docs/AGA_STATE.md`**: updated current state bullet and iteration log.

## Validation

`node --check src/game-state.js` — no syntax errors.
`node --check src/game.js` — no syntax errors.
`node tests/run-all.mjs` — all 29 suites passed.

## Next Bottleneck

The archive endgame (extraction gate) now has a richer lead-up with coastal aftermath recorded,
but the gate check still only validates fragment count. Gate unlock should read the aftermath and
synthesis together — a "complete thread" that acknowledges both the archive memory and the coastal
consequence before opening the extraction.
