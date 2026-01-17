import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "../../domain/entities/game";
import { addRoundScore } from "./addRoundScore";

describe("addRoundScore", () => {
  let repo: GameRepository<Flip7Game>;

  const baseGame: Flip7Game = {
    id: "game-1",
    createdAt: new Date().toISOString(),
    completedAt: null,
    players: [
      { id: "p1", name: "Alice", total: 0 },
      { id: "p2", name: "Bob", total: 0 },
      { id: "p3", name: "Charlie", total: 0 },
    ],
    rounds: [],
    winnerId: null,
  };

  beforeEach(() => {
    repo = {
      list: vi.fn(),
      getById: vi.fn().mockResolvedValue(baseGame),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  it("adds a round and updates player totals", async () => {
    const updated = await addRoundScore(repo, baseGame.id, {
      players: [
        { id: "p1", score: 10 },
        { id: "p2", score: 5 },
      ],
    });

    expect(updated.rounds).toHaveLength(1);
    expect(updated.rounds[0].index).toBe(1);
    expect(updated.rounds[0].scores).toEqual([
      { playerId: "p1", score: 10 },
      { playerId: "p2", score: 5 },
    ]);

    expect(updated.players.find((p) => p.id === "p1")!.total).toBe(10);
    expect(updated.players.find((p) => p.id === "p2")!.total).toBe(5);
    expect(updated.players.find((p) => p.id === "p3")!.total).toBe(0);

    expect(updated.completedAt).toBeNull();
    expect(updated.winnerId).toBeNull();

    expect(repo.save).toHaveBeenCalledOnce();
    expect(repo.save).toHaveBeenCalledWith(updated);
  });

  it("throws when input is invalid (empty players)", async () => {
    await expect(
      addRoundScore(repo, baseGame.id, { players: [] })
    ).rejects.toThrow(/Invalid round input:/);

    expect(repo.save).not.toHaveBeenCalled();
  });

  it("throws when game is not found", async () => {
    (repo.getById as Mock).mockResolvedValue(null);

    await expect(
      addRoundScore(repo, "missing-game", { players: [{ id: "p1", score: 1 }] })
    ).rejects.toThrow("Game not found");

    expect(repo.save).not.toHaveBeenCalled();
  });

  it("throws when game is completed", async () => {
    const game: Flip7Game = {
      ...baseGame,
      completedAt: new Date().toISOString(),
      winnerId: "p1",
    };

    (repo.getById as Mock).mockResolvedValue(game);

    await expect(
      addRoundScore(repo, game.id, { players: [{ id: "p1", score: 1 }] })
    ).rejects.toThrow("Game already completed");

    expect(repo.save).not.toHaveBeenCalled();
  });

  it("sets winner and completedAt when a unique player reaches >= 200", async () => {
    const game: Flip7Game = {
      ...baseGame,
      players: [
        { id: "p1", name: "Alice", total: 199 },
        { id: "p2", name: "Bob", total: 150 },
      ],
    };

    (repo.getById as Mock).mockResolvedValue(game);

    const updated = await addRoundScore(repo, game.id, {
      players: [
        { id: "p1", score: 5 }, // Alice: 204
        { id: "p2", score: 10 }, // Bob: 160
      ],
    });

    expect(updated.winnerId).toBe("p1");
    expect(updated.completedAt).toEqual(expect.any(String));
  });

  it("does not set winner on tie at highest >= 200", async () => {
    const game: Flip7Game = {
      ...baseGame,
      players: [
        { id: "p1", name: "Alice", total: 195 },
        { id: "p2", name: "Bob", total: 195 },
      ],
    };
    (repo.getById as Mock).mockResolvedValue(game);

    const updated = await addRoundScore(repo, game.id, {
      players: [
        { id: "p1", score: 10 }, // 205
        { id: "p2", score: 10 }, // 205
      ],
    });

    expect(updated.winnerId).toBeNull();
    expect(updated.completedAt).toBeNull();
  });
});
