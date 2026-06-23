# 0018 — Tidewalk Contact Contract and CI Gate

## State assessment

The Tidewalk warehouse survey is now on-foot, but the next route commitment is still selected from the arrival dossier. That breaks the project’s strongest progression rule: consequential choices should happen in navigable space, under the same readability and risk conditions as the rest of the game.

A second issue was delivery confidence. The repository had deterministic tests but no checked-in GitHub Actions gate to execute them on branch pushes and pull requests.

## Strategic choice

**B. Systemic Expansion**, supported by a narrow **D. Technical/Polish** guardrail.

The corrected scope is to establish a testable canonical contract for the two in-world Tidewalk contacts and to protect every future integration with CI. Directly rewriting the entire route flow before a shared contract existed would have risked duplicating route choice data across the client, state model, and future scene rendering.

## Work completed

- Added `src/tidewalk-contact.js`, a deterministic schema for the physical Tidewalk choice:
  - **Lantern Tender** at the north pier, mapping to `quay-safe-lantern-line`.
  - **Black-Keel Scout** at the lower pilings, mapping to `black-keel-countermark`.
  - A plan selector that only exposes contacts after both warehouse surveys.
  - A guarded resolver that persists one choice, records a timestamp, and prevents conflicting route commitments.
- Added dedicated tests for locked, available, resolved, invalid, and no-overwrite states.
- Added the contact suite to `tests/run-all.mjs`.
- Added `.github/workflows/validate.yml` to check syntax and run all deterministic suites on `main`, AGA branches, and pull requests.
- Added `docs/CANVA_ART_DIRECTION.md` as the visual contract for the Tidewalk decision and the formal role of Canva in future AGA runs.

## Visual direction decision

Canva found no existing Signal Below visual reference. The run therefore established a reusable board brief rather than pretending an unrelated Canva design represents the game. The decision language is deliberately binary in silhouette and palette: lantern gold and sea-glass teal for settlement trust, black tar and restrained red for Black-Keel exposure.

## Success metrics

- The two route choices have distinct contact IDs, destinations, visual cues, and consequences.
- Contacts remain hidden until both warehouse sites have been surveyed.
- A resolved contact cannot be overwritten by a second choice.
- The full test runner includes the new contact suite.
- GitHub Actions executes syntax and deterministic tests on future branch changes and pull requests.

## Risk mitigation

The schema uses the existing choice IDs rather than creating a second branch system. It is additive and side-effect-limited, so the next run can integrate it into `src/game-state.js` and `src/game.js` without changing existing Black-Keel or Lantern Line consequences.

## Next bottleneck

Wire the Tidewalk contact plan into the live `game-state` and Canvas scene: after warehouse completion, return the player to the coast, render both contacts at their physical anchors, and let holding `E` at one contact resolve the route choice. Then delete the route-choice buttons from the dossier or reduce the dossier to read-only consequence status.
