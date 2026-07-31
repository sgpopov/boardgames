import { describe, it, expect } from "vitest";
import { buildPodium } from "./buildPodium";

import type {
  EverdellGame,
  EverdellPlayer,
} from "@/games/everdell/application/entities/EverdellGame";
import type { Character } from "@/games/everdell/domain/constants";

const makePlayer = (
  id: string,
  name: string,
  character: Character,
  total: number,
): EverdellPlayer => ({
  id,
  name,
  character,
  scores: {
    base: { cards: 0, prosperity: 0, events: 0, journey: 0, tokens: 0 },
  },
  total,
});

const makeGame = (players: EverdellPlayer[]): EverdellGame => ({
  id: "game1",
  players,
  startedAt: new Date().toDateString(),
  completedAt: new Date().toDateString(),
});

describe("buildPodium", () => {
  it("ranks a single player as the winner", () => {
    const game = makeGame([makePlayer("p1", "Alice", "squirrel", 52)]);

    const rows = buildPodium(game);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ rank: 1, isWinner: true, total: 52 });
  });

  it("ranks two players by descending total", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 44),
      makePlayer("p2", "Bob", "turtle", 52),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => r.player.id)).toEqual(["p2", "p1"]);
    expect(rows[0]).toMatchObject({ rank: 1, isWinner: true });
    expect(rows[1]).toMatchObject({ rank: 2, isWinner: false });
  });

  it("ranks three players by descending total", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 51),
      makePlayer("p2", "Bob", "turtle", 69),
      makePlayer("p3", "Carol", "mouse", 44),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => r.player.id)).toEqual(["p2", "p1", "p3"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("ranks four players and skips no ranks when all totals differ", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 52),
      makePlayer("p2", "Bob", "hedgehog", 51),
      makePlayer("p3", "Carol", "mouse", 69),
      makePlayer("p4", "Mallory", "turtle", 44),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => r.player.id)).toEqual(["p3", "p1", "p2", "p4"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
  });

  it("shares rank and winner status on a two-way tie for first, and skips the next rank", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 52),
      makePlayer("p2", "Bob", "hedgehog", 52),
      makePlayer("p3", "Carol", "mouse", 51),
      makePlayer("p4", "Mallory", "turtle", 44),
    ]);

    const rows = buildPodium(game);

    const [alice, bob, carol, mallory] = rows;

    expect(alice).toMatchObject({ rank: 1, isWinner: true });
    expect(bob).toMatchObject({ rank: 1, isWinner: true });
    expect(alice.medal).toBe(bob.medal);

    // the rank following the tie skips to 3, not 2
    expect(carol).toMatchObject({ rank: 3, isWinner: false });
    expect(mallory).toMatchObject({ rank: 4, isWinner: false });
  });

  it("shares rank and medal on a tie in the middle of the table", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 60),
      makePlayer("p2", "Bob", "hedgehog", 40),
      makePlayer("p3", "Carol", "mouse", 40),
      makePlayer("p4", "Mallory", "turtle", 20),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => r.rank)).toEqual([1, 2, 2, 4]);
    expect(rows[1].medal).toBe(rows[2].medal);
    expect(rows.every((r) => (r.rank === 1) === r.isWinner)).toBe(true);
  });

  it("shares rank and medal on a tie at the bottom of the table", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 60),
      makePlayer("p2", "Bob", "hedgehog", 40),
      makePlayer("p3", "Carol", "mouse", 20),
      makePlayer("p4", "Mallory", "turtle", 20),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3, 3]);
    expect(rows[2].medal).toBe(rows[3].medal);
  });

  it("treats every player as a joint winner when the whole game is tied", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 30),
      makePlayer("p2", "Bob", "hedgehog", 30),
      makePlayer("p3", "Carol", "mouse", 30),
      makePlayer("p4", "Mallory", "turtle", 30),
    ]);

    const rows = buildPodium(game);

    expect(rows.every((r) => r.rank === 1)).toBe(true);
    expect(rows.every((r) => r.isWinner)).toBe(true);
    expect(rows.every((r) => r.medal === "gold")).toBe(true);
  });

  it("assigns the expected medal per rank", () => {
    const game = makeGame([
      makePlayer("p1", "Alice", "squirrel", 10),
      makePlayer("p2", "Bob", "hedgehog", 40),
      makePlayer("p3", "Carol", "mouse", 30),
      makePlayer("p4", "Mallory", "turtle", 20),
    ]);

    const rows = buildPodium(game);

    expect(rows.map((r) => [r.rank, r.medal])).toEqual([
      [1, "gold"],
      [2, "silver"],
      [3, "bronze"],
      [4, "fourth"],
    ]);
  });

  it("orders by rank regardless of the order players were created in", () => {
    const ascending = makeGame([
      makePlayer("p1", "Alice", "squirrel", 10),
      makePlayer("p2", "Bob", "hedgehog", 20),
      makePlayer("p3", "Carol", "mouse", 30),
      makePlayer("p4", "Mallory", "turtle", 40),
    ]);
    const descending = makeGame([
      makePlayer("p4", "Mallory", "turtle", 40),
      makePlayer("p3", "Carol", "mouse", 30),
      makePlayer("p2", "Bob", "hedgehog", 20),
      makePlayer("p1", "Alice", "squirrel", 10),
    ]);

    const rowsFromAscending = buildPodium(ascending).map((r) => r.player.id);
    const rowsFromDescending = buildPodium(descending).map((r) => r.player.id);

    expect(rowsFromAscending).toEqual(["p4", "p3", "p2", "p1"]);
    expect(rowsFromDescending).toEqual(["p4", "p3", "p2", "p1"]);
  });

  it("orders tied players by name, regardless of the order they were created in", () => {
    const created = makeGame([
      makePlayer("p1", "Bob", "hedgehog", 52),
      makePlayer("p2", "Alice", "squirrel", 52),
    ]);
    const createdReversed = makeGame([
      makePlayer("p2", "Alice", "squirrel", 52),
      makePlayer("p1", "Bob", "hedgehog", 52),
    ]);

    const rowsFromCreated = buildPodium(created).map((r) => r.player.id);
    const rowsFromReversed = buildPodium(createdReversed).map((r) => r.player.id);

    expect(rowsFromCreated).toEqual(["p2", "p1"]);
    expect(rowsFromReversed).toEqual(["p2", "p1"]);
  });
});
