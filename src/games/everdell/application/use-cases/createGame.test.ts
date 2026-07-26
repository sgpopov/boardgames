import { describe, expect, it } from "vitest";
import { createEverdellGame } from "@/games/everdell/application/use-cases/createGame";
import { InMemoryEverdellRepo } from "@/games/everdell/tests/mock-repository";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import { DuplicatePlayerCharacterError } from "@/core/domain/errors/DuplicatePlayerCharacterError";

describe("createEverdellGame", () => {
  it("creates a game with base score buckets initialized", async () => {
    const repo = new InMemoryEverdellRepo(null);

    const game = await createEverdellGame(repo, [
      { name: "Alice", character: "squirrel" },
      { name: "Bob", character: "turtle" },
    ]);

    expect(game.players).toHaveLength(2);
    expect(game.players[0]).toMatchObject({
      name: "Alice",
      total: 0,
      scores: {
        base: {
          cards: 0,
          prosperity: 0,
          events: 0,
          journey: 0,
          tokens: 0,
        },
      },
    });
    expect(game.completedAt).toBeNull();
  });

  it("assigns each player the character they chose", async () => {
    const repo = new InMemoryEverdellRepo(null);

    const game = await createEverdellGame(repo, [
      { name: "Alice", character: "mouse" },
      { name: "Bob", character: "hedgehog" },
    ]);

    expect(game.players.map((p) => p.character)).toEqual(["mouse", "hedgehog"]);
  });

  it("throws on duplicate player names", async () => {
    const repo = new InMemoryEverdellRepo(null);

    await expect(
      createEverdellGame(repo, [
        { name: "Bruce", character: "squirrel" },
        { name: " bruce ", character: "turtle" },
      ]),
    ).rejects.toThrow(DuplicatePlayerNameError);
  });

  it("throws on duplicate characters and persists nothing", async () => {
    const repo = new InMemoryEverdellRepo(null);

    await expect(
      createEverdellGame(repo, [
        { name: "Alice", character: "turtle" },
        { name: "Bob", character: "turtle" },
      ]),
    ).rejects.toThrow(DuplicatePlayerCharacterError);

    expect(await repo.list()).toEqual([]);
  });
});
