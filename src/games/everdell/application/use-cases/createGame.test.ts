import { describe, expect, it } from "vitest";
import { createEverdellGame } from "@/games/everdell/application/use-cases/createGame";
import { InMemoryEverdellRepo } from "@/games/everdell/tests/mock-repository";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";

describe("createEverdellGame", () => {
  it("creates a game with base score buckets initialized", async () => {
    const repo = new InMemoryEverdellRepo(null);

    const game = await createEverdellGame(repo, [
      { name: "Alice" },
      { name: "Bob" },
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

  it("throws on duplicate player names", async () => {
    const repo = new InMemoryEverdellRepo(null);

    await expect(
      createEverdellGame(repo, [{ name: "Bruce" }, { name: " bruce " }]),
    ).rejects.toThrow(DuplicatePlayerNameError);
  });
});
