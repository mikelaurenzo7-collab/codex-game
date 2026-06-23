# Automation Run 0046 - Brinehook Resolution Client Contract

## State Assessment

The latest default branch already had Brinehook Low Piers playable state, encounter detection, and a deterministic branch resolution selector. The highest-leverage bottleneck was the seam between that deterministic resolution and the live client: HUD copy, primer copy, bottom-log messaging, status tone, and map/canvas marker targeting still had no stable contract. Without that layer, later Canvas integration would either duplicate branch logic in `src/game.js` or risk inconsistent player guidance.

## Strategic Choice

**D. Technical/Polish Overhaul.**

## Execution Plan

- **Specific Tasks:** Add a read-only client presentation selector over Brinehook resolution state; expose HUD/status/primer/bottom-log copy; expose tone and marker target semantics; test dormant, Black-Keel, and Lantern presentation branches; update Brinehook player-facing docs.
- **Technology Stack Justification:** Vanilla ES modules remain appropriate because the game is a no-dependency HTML5 Canvas prototype. Presentation selection belongs next to Brinehook resolution logic so the Canvas client can consume one deterministic contract instead of re-implementing branch checks.
- **Success Metrics:** Every Brinehook resolution state maps to deterministic player-facing copy, tone, and marker data; Black-Keel under-hunt points at sentinel suppression; Lantern safe-line points at haven guidance; tests cover the new contract.
- **Risk Mitigation:** The selector is read-only and imports no browser APIs, so it cannot break Canvas rendering, mutate cargo, or alter sentinel/haven gameplay. If future UI requirements change, copy/tone/marker semantics can be revised behind the same exported contract.

## Work Completed

- Extended `src/brinehook-resolution.js` with `getBrinehookResolutionClientState(state)`.
- Added deterministic presentation metadata for Brinehook statuses: dormant, hunted, cargo-under-hunt, escaped-with-cargo, safe-line-ahead, haven-holding, and witness-secured.
- Extended `tests/brinehook-resolution.test.mjs` to validate HUD copy, primer copy, tones, completion copy, and marker target kinds.
- Updated `docs/BRINEHOOK_LOW_PIERS.md` with the client presentation contract.

## Gameplay Decision

Brinehook player guidance is now outcome-specific: Black-Keel pressure escalates from cargo search to sentinel suppression, while Lantern guidance routes from haven approach to cargo proof and witness security.

## Visual-Design Decision

The visual/UI vocabulary is now encoded as tone semantics instead of hardcoded art: `danger` for active Black-Keel hunt, `warning` for cargo held under pursuit, `safe` for lantern haven states, `success` for completed outcomes, and `muted` for dormant state. Canva was not used because the bottleneck was contract-level HUD/Canvas semantics, not missing visual references or presentable assets.

## Validation

- Static review: new selector is read-only and delegates gameplay truth to `getBrinehookResolutionState`.
- Test review: dormant, Black-Keel hunted, Black-Keel cargo-under-hunt, Black-Keel escaped-with-cargo, Lantern safe-line-ahead, Lantern haven-holding, and Lantern witness-secured client states are covered.
- Full local runtime execution was not claimed because this connector-only run cannot execute the repository in a local checkout.

## Next Bottleneck

Import `getBrinehookResolutionClientState` in `src/game.js` and render the marker/tone/copy directly in the live Canvas and HUD once a safe full-file client edit path is available.
