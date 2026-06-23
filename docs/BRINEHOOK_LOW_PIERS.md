# Brinehook Low Piers

Brinehook Low Piers is the first playable coastal micro-scene beyond Tidewalk Coast.

## How to Reach It

1. Recover the archive thread and link the Coastline Lift route.
2. Secure Tidewalk docking rights.
3. Descend into Tidewalk Coast and survey both drowned warehouse leads on foot.
4. Commit to a Tidewalk contact in-world.
5. Resolve that branch's coastal operation.
6. Hold `E` at the Brinehook descent gate to enter the Low Piers.

## Play Rules

- Hold `E` inside a field ring to advance Brinehook objectives.
- Use `Space` to suppress black-tide hazards temporarily.
- Tide phases change hazard size and drain pressure.
- Pulse near hidden salvage cargo to reveal recoverable cargo pings.
- Walk onto revealed cargo to recover it and regain a small amount of signal.
- The Lantern route emphasizes protected witness recovery and gives the player a safe-haven recharge pocket near the tender.
- The Black-Keel route emphasizes hostile pursuit: a red sentinel hunts near the underpier and can be temporarily suppressed by pulse play.

## Encounter Readout

`src/brinehook-encounter.js` exposes a deterministic Brinehook encounter selector for tests and future HUD work. It summarizes the active branch, sentinel state, cargo visibility/recovery, lantern haven state, and bottom-log copy without requiring Canvas inspection.

## Resolution Readout

`src/brinehook-resolution.js` converts the encounter into branch-specific outcome states:

- `hunted`: Black-Keel branch active, but not enough cargo has been recovered.
- `cargo-under-hunt`: enough Black-Keel cargo is recovered, but the sentinel still controls the route.
- `escaped-with-cargo`: enough cargo is recovered and the sentinel is suppressed.
- `safe-line-ahead`: Lantern branch active, but the player is outside the haven.
- `haven-holding`: the player is inside the lantern haven but still needs cargo proof.
- `witness-secured`: the player is in the haven with recovered cargo.

These resolution states are deterministic selectors. They do not end the scene by themselves; they provide the stable contract for HUD copy, bottom-log copy, completion messaging, and the eventual Brinehook exit.

## Client Presentation Contract

`getBrinehookResolutionClientState(state)` is the bridge from deterministic resolution logic into playable Canvas/HUD work. It returns:

- `hudText` for the main objective readout.
- `statusText` for the compact player-state readout.
- `primerTitle` and `primerText` for the in-game onboarding primer.
- `bottomLogText` for the lower Canvas log.
- `tone` values (`danger`, `warning`, `safe`, `success`, `muted`) so Canvas/UI can style branch pressure consistently.
- `marker` data for map/canvas targets: cargo search, revealed cargo, sentinel suppression, or lantern haven guidance.

The presentation contract remains read-only. It chooses player-facing copy and marker targets from existing state instead of mutating cargo, sentinel, haven, or completion rules.

## Visual Direction

The Brinehook scene should read as low, dark, and lateral: broad pier silhouettes over black water, warm lantern safety around witness contact points, and sharper red danger language for hostile Black-Keel pressure. Salvage cargo uses small gold pings after a pulse rather than permanent map markers so cargo feels discovered under pressure.

Canva was not used for this run because the bottleneck was deterministic HUD/Canvas presentation plumbing for already-authored Brinehook mechanics, not a missing mood board or asset direction.
