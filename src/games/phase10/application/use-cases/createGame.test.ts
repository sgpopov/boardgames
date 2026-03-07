import { describe, expect, it } from "vitest";
import { createPhase10Game } from "@/games/phase10/application/use-cases/createGame";
import { InMemoryPhase10Repo } from "@/games/phase10/tests/mock-repository";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import { PlayersLimitExceededError } from "@/core/domain/errors/PlayersLimitExceededError";
import { MAX_PLAYERS } from "@/games/phase10/domain/validation/players.schema";

describe("createPhase10Game", () => {
  it("creates a game with default player state", async () => {
    const repo = new InMemoryPhase10Repo(null);

    const game = await createPhase10Game(repo, [
      { name: "Alice" },
      { name: "Bob" },
    ]);

    expect(game.players).toHaveLength(2);
    expect(game.players[0]).toMatchObject({
      name: "Alice",
      score: 0,
      phase: 1,
      rounds: [],
    });
    expect(game.rounds).toBe(0);
    expect(game.completedAt).toBeNull();
  });

  it("throws when player count exceeds max", async () => {
    const repo = new InMemoryPhase10Repo(null);
    const players = Array.from({ length: MAX_PLAYERS + 1 }, (_, index) => ({
      name: `Player ${index + 1}`,
    }));

    await expect(createPhase10Game(repo, players)).rejects.toThrow(
      PlayersLimitExceededError,
    );
  });

  it("throws on duplicate player names", async () => {
    const repo = new InMemoryPhase10Repo(null);

    await expect(
      createPhase10Game(repo, [{ name: "Alice" }, { name: " alice " }]),
    ).rejects.toThrow(DuplicatePlayerNameError);
  });
});
