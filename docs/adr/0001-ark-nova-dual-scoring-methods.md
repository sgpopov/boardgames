# Ark Nova: dual scoring methods with per-method winners

Ark Nova's final victory points can be computed two ways — the **Official**
method from the printed rulebook (`VP = appeal − threshold(CP)`, threshold from
the board's appeal track) and an **Alternative** method from the updated "New
Scoring" rulebook (`VP = appeal + bonus(CP)`). Both derive from the same two raw
inputs per player (appeal + conservation points), each via its **own** fixed
CP→number lookup table.

## Decision

Keep **two independent lookup tables** (Official thresholds, Alternative
bonuses) as explicit domain constants — we do not derive one from the other in
code, even though they are mathematically related. Each game has **two winners**,
one per method, computed independently: the player(s) with the highest VP under
that method, ties broken by higher appeal then declared joint (so a winner is a
list of player IDs). The detail page shows two leaderboards.

## The relationship, and why two tables anyway

`threshold(CP) + bonus(CP) = 100` for every CP except the board's capped
corner (CP 0, where the appeal track maxes at 113 instead of the pattern's 114).
Consequently `officialVP = alternativeVP − 100` everywhere except that corner,
so the two methods are **rank-equivalent in virtually every real game** — the
two winners coincide; only the absolute totals differ (by 100). They can diverge
only at the capped board extreme.

We still keep both tables and compute both winners because: (a) the two absolute
totals are what players read off their own rulebook and both must be shown
faithfully; (b) the tables are independent rulebook data that could in principle
be revised separately; (c) deriving official as `alt − 100` would silently hide
the board's cap behaviour. The earlier assumption that the two winners routinely
differ was wrong — recorded here so the per-method, list-valued winner shape
isn't mistaken for an inconsistency, and so nobody "simplifies" it back to a
single winner without realising the totals legitimately differ.
