# Ark Nova — Context Glossary

A board-game scoring module. This file is a glossary only — no implementation
details, no decisions (those live in `docs/adr/`).

## Terms

- **Appeal** — A player's value on the appeal track at game end. Raw input.
- **Conservation Points (CP)** — A player's value on the conservation track at
  game end. Raw input. Drives the lookup into the scoring tables.
- **Victory Points (VP)** — A player's final score. Derived, never entered
  directly. Computed two ways (see Official scoring, Alternative scoring).
- **Official scoring** — VP method from the printed rulebook:
  `VP = Appeal − threshold(CP)`, where the threshold is the lowest appeal value
  in the scoring area the conservation marker occupies. VP may be negative.
- **Alternative scoring** — VP method from the updated ("New Scoring")
  rulebook: `VP = Appeal + bonus(CP)`, where the bonus is the white number in
  the conservation space. The bonus itself is negative for low CP (CP 0–6),
  so VP may be negative.
- **Final scoring** — The single end-of-game step in which each player's Appeal
  and Conservation Points are entered once, after which the game is completed.
- **Winner (per method)** — Each scoring method has its own winner: the
  player(s) with the highest VP under that method. Ties are broken by higher
  Appeal; if Appeal also ties, the winner is joint (shared). A game therefore
  has an Official winner and an Alternative winner, which may differ.
- **Scoring table** — A fixed rulebook mapping from Conservation Points to a
  number, one per method: the Official threshold table and the Alternative
  bonus table.
