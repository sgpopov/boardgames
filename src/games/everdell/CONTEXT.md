# Everdell — Context Glossary

A board-game scoring module. This file is a glossary only — no implementation
details, no decisions (those live in `docs/adr/`).

## Terms

- **Category** — One of the five base-game scoring areas a player accumulates
  points in: Cards, Prosperity, Events, Journey, Point tokens. Raw input,
  entered once per player per category.
- **Total** — A player's final score: the sum of their five Categories.
  Derived, never entered directly.
- **Completed game** — A game whose scoring is finished and which accepts no
  further changes. Completion is what makes a Winner and a Rank meaningful;
  before it, neither exists.
- **Rank** — A player's position by Total in a Completed game, highest first.
  Ranking is by competition rules: players on an equal Total share a Rank, and
  the next Rank skips accordingly (52, 52, 51, 44 → Ranks 1, 1, 3, 4).
- **Winner** — Every player holding Rank 1. A game with tied top Totals has
  joint Winners, all equally the Winner; there is no tiebreaker.
- **Character** — The woodland creature identifying a player for the life of a
  game: Squirrel, Turtle, Mouse or Hedgehog. Chosen when the game is created,
  unique within a game (one Character belongs to at most one player), and fixed
  thereafter. Purely an identity — a Character has no effect on scoring.

  Deliberately *not* called a Critter: in Everdell's own rules, Critter names a
  card type (as opposed to a Construction), and overloading it would make the
  glossary ambiguous.

- **Podium** — The presentation of a Completed game's outcome: each player
  shown as their Character, ordered and elevated by Rank, Winners bearing a
  trophy. A view of the Rank and Total that already exist; it introduces no
  data of its own.
