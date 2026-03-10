import { describe, it, expect } from "vitest";
import { completeGame } from "@/games/everdell/application/use-cases/completeGame";
import { createEverdellGame } from "@/games/everdell/application/use-cases/createGame";
import { InMemoryEverdellRepo } from "@games/everdell/tests/mock-repository";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";

describe("completeGame", () => {
  it("should throw GameNotFoundError when game does not exist", async () => {
    const repo = new InMemoryEverdellRepo(null);

    await expect(
      completeGame({ repository: repo, gameId: "missing-id" })
    ).rejects.toThrow(GameNotFoundError);
  });

  it("should throw GameAlreadyCompletedError when game is already completed", async () => {
    const repo = new InMemoryEverdellRepo(null);
    const game = await createEverdellGame(repo, [
      { name: "Alice" },
      { name: "Bob" },
    ]);

    await completeGame({ repository: repo, gameId: game.id });

    await expect(
      completeGame({ repository: repo, gameId: game.id })
    ).rejects.toThrow(GameAlreadyCompletedError);
  });

  it("should set completedAt and persist the game", async () => {
    const repo = new InMemoryEverdellRepo(null);
    const game = await createEverdellGame(repo, [
      { name: "Alice" },
      { name: "Bob" },
    ]);
    const fixedNow = "2026-03-10T12:00:00.000Z";

    const updated = await completeGame({
      repository: repo,
      gameId: game.id,
      now: () => fixedNow,
    });

    expect(updated.completedAt).toBe(fixedNow);

    const persisted = await repo.getById(game.id);
    expect(persisted?.completedAt).toBe(fixedNow);
  });

  it("should not modify players or other game fields when completing", async () => {
    const repo = new InMemoryEverdellRepo(null);
    const game = await createEverdellGame(repo, [
      { name: "Alice" },
      { name: "Bob" },
    ]);

    const updated = await completeGame({ repository: repo, gameId: game.id });

    expect(updated.id).toBe(game.id);
    expect(updated.startedAt).toBe(game.startedAt);
    expect(updated.players).toEqual(game.players);
  });
});
