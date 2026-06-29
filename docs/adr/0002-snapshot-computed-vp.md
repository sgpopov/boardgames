# Ark Nova: snapshot computed VP instead of deriving on read

Sibling modules derive scores on read (Everdell recomputes a player's `total`
from its components every time). For Ark Nova we instead **persist** the
computed `officialVp` and `alternativeVp` alongside the raw `appeal` and
`conservationPoints` inputs.

## Decision

When final scores are saved, compute both VP values from the CP lookup tables
and store them on the player record. They are recomputed and rewritten on every
edit of the draft scores, and the stored values are the source of truth for the
leaderboards and winner calculation.

## Why

The scoring tables are large fixed rulebook data; snapshotting the result keeps
the persisted game self-describing and avoids re-running table lookups on every
read. The tables are immutable rulebook constants, so the usual drift risk of
storing derived data does not apply. A pure compute function is still the single
source of the formula — it powers both the live draft preview and the saved
snapshot — so the deviation from the derive-on-read convention is localized.
