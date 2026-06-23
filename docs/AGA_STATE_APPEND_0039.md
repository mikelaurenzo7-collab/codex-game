# AGA State Append - 0039 Tidewalk Live Commitment Adapter

## Current State Delta

- `src/tidewalk-playable-commitment.js` now exposes the preferred live-client seam for Tidewalk route commitment.
- `createTidewalkPlayableCommitmentFrameAdapter(...)` enforces deterministic browser-frame order: update game state, process in-world contact commitment, invalidate arrival HUD when needed, draw, then refresh HUD.
- `shouldBlockLegacyTidewalkRouteClick(...)` prevents dossier route-click fallback from bypassing the physical contact rings while the contact choice is active.
- `tests/tidewalk-playable-commitment.test.mjs` covers adapter callback order, route mutation, HUD invalidation, and legacy-click guard behavior.
- `docs/TIDEWALK_CONTACTS.md` now identifies `src/tidewalk-playable-commitment.js` as the integration surface for the live browser client.

## Strategic Choice

**D. Technical/Polish Overhaul.** The game already had the contact mechanics and identity spine; the highest leverage was reducing live-client integration risk before touching the large Canvas shell.

## Gameplay Decision

The Tidewalk branch decision is still a physical held-**E** contact commitment. Dossier UI is guidance only while the contact choice is active.

## Visual-Design Decision

No Canva asset pass. The run preserved the existing Canvas faction hierarchy instead: Lantern Tender uses warm gold safe-line emphasis; Black-Keel uses hostile red-black pressure emphasis.

## Validation

Connector-side structural review plus deterministic test additions. Full local runtime was not claimed.

## Next Bottleneck

Wire the adapter into `src/game.js` in one surgical change and remove or guard the old arrival-panel route-choice click handler in the same reviewed commit.
