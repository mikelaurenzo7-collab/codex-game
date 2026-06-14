# Codex Game

This repository is the durable workspace for the Autonomous Game Architect automation.

- Mandate: `docs/AGA_MANDATE.md`
- State log: `docs/AGA_STATE.md`

The automation should keep each iteration scoped, verifiable, and committed. It should prefer the simplest stack that can produce a playable PC game prototype quickly, then refine based on tested evidence.

## Current Prototype

**Signal Below** is the first playable MVP slice: a top-down atmospheric mystery game where the player explores a drowned archive, uses a limited signal pulse to reveal hidden memory fragments, avoids echo interference, and unlocks the extraction gate.

Run locally:

```powershell
npm test
npm run serve
```

Then open `http://localhost:5173`.

If `npm` is not available, the prototype can still be run with any modern Node.js executable:

```powershell
node tests/game-state.test.mjs
node scripts/serve.mjs
```

Controls: move with `WASD` or arrow keys, pulse with `Space`, restart with `R` or the on-screen button.
