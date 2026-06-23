# Automation Run 0031 - Tidewalk Omen Deck

## State Assessment

Pressure made the contact moment feel alive, but the choice still needed clearer world-forecasting. The player should feel that each contact is a future, not just a button replacement.

## Strategic Choice

**C. Narrative/World Sculpting.**

## Work Completed

- Added `src/tidewalk-contact-omens.js`.
- Added `tests/tidewalk-contact-omens.test.mjs`.
- Registered the omen deck in `tests/run-all.mjs`.

## Gameplay Decision

Each Tidewalk contact now exposes an omen row with promise, cost, world tag, signal, range, and selected state. This is deterministic preview logic; it does not resolve commitment.

## Visual-Design Decision

No Canva pass. The omen deck keeps the existing visual language but gives UI copy a bolder hierarchy: Lantern Tender = Witness Line; Black-Keel Scout = Countermark Pursuit.

## Validation

Connector-side structural review plus deterministic tests. Full local runtime was not claimed.
