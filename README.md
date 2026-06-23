# Codex Game

This repository is the durable workspace for the Autonomous Game Architect automation.

- Mandate: `docs/AGA_MANDATE.md`
- State log: `docs/AGA_STATE.md`

The automation should keep each iteration scoped, verifiable, and committed. It should prefer the simplest stack that can produce a playable PC game prototype quickly, then refine based on tested evidence.

## Current Prototype

**Signal Below** is the first playable MVP slice: a top-down atmospheric mystery game where the player explores a drowned archive, uses a limited signal pulse to reveal hidden memory fragments, performs field analysis on deduced sites, surveys regions and landmarks through an atlas, reads frontier routes with hazards and settlement prospects, avoids echo interference, unlocks the extraction gate, launches charted off-map frontier traversals at route gates, resolves the first Tidewalk Coast settlement encounter from the arrival panel, descends into Tidewalk Coast to survey drowned warehouses on foot, commits to a Tidewalk coastal route through in-world coastal contacts, and follows that choice into the playable Brinehook Low Piers coastal micro-scene.

Brinehook Low Piers now has a browser-visible Canvas scene contract plus a deterministic encounter contract. The Black-Keel route spawns a hunting underpier sentinel, the lantern route creates a safe-haven support zone, and both routes can reveal and recover salvage cargo through pulse play.

A tide-aware **Brinehook Command Deck** now appears only during the Low Piers crossing. It projects the existing live HUD into one tactical readout: current tide window, the immediate objective, and a short field instruction. It is presentation-only by design—the deck never owns or mutates gameplay state.

Run locally:

```powershell
npm test
npm run serve
```

Then open `http://localhost:5173`.

If `npm` is not available, the prototype can still be run with any modern Node.js executable:

```powershell
node tests/run-all.mjs
node scripts/serve.mjs
```

Controls: move with `WASD` or arrow keys, pulse with `Space`, analyze with `E`, traverse eligible charted frontier gates with `E`, descend into Tidewalk Coast and advance warehouse or Brinehook field rings with `E`, commit to an in-world Tidewalk contact with `E`, reveal Brinehook salvage cargo with `Space`, suppress black-tide hazards and the Black-Keel sentinel with `Space`, use the arrival dossier for settlement clearance and status review, read the Brinehook Command Deck for tide-aware routing guidance during the Low Piers crossing, save the current expedition with `Save checkpoint`, and restart with `R` or the on-screen button. A valid checkpoint resumes automatically on the next load; restarting clears it.