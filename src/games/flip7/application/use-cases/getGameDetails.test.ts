import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import { getGameDetails } from "./getGameDetails";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";

describe("getGameDetails", () => {
  let repo: GameRepository<Flip7Game>;

  beforeEach(() => {
    repo = {
      list: vi.fn(),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  it("returns a game when found", async () => {
    const game: Flip7Game = {
      id: "g1",
      createdAt: "2025-01-01T00:00:00.000Z",
      completedAt: null,
      players: [{ id: "p1", name: "Alice", total: 0 }],
      rounds: [],
      winnerId: null,
    };

    vi.mocked(repo.getById).mockResolvedValue(game);

    await expect(getGameDetails(repo, "g1")).resolves.toEqual(game);
  });

  it("throws GameNotFoundError when game does not exist", async () => {
    vi.mocked(repo.getById).mockResolvedValue(undefined);

    await expect(getGameDetails(repo, "missing")).rejects.toThrow(
      GameNotFoundError,
    );
  });
});
