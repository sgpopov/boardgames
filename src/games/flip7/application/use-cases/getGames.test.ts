import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import { getGames } from "./getGames";

describe("getGames", () => {
  let repo: GameRepository<Flip7Game>;

  beforeEach(() => {
    repo = {
      list: vi.fn(),
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
  });

  it("maps repository games to summaries", async () => {
    const games: Flip7Game[] = [
      {
        id: "g1",
        createdAt: "2025-01-01T00:00:00.000Z",
        completedAt: null,
        players: [
          { id: "p1", name: "Alice", total: 10 },
          { id: "p2", name: "Bob", total: 5 },
        ],
        rounds: [
          {
            index: 1,
            scores: [{ playerId: "p1", score: 10 }],
            savedAt: "2025-01-01T00:01:00.000Z",
          },
        ],
        winnerId: null,
      },
      {
        id: "g2",
        createdAt: "2025-01-02T00:00:00.000Z",
        completedAt: "2025-01-02T00:10:00.000Z",
        players: [{ id: "p3", name: "Cara", total: 201 }],
        rounds: [],
        winnerId: "p3",
      },
    ];

    vi.mocked(repo.list).mockResolvedValue(games);

    const summaries = await getGames(repo);

    expect(summaries).toEqual([
      {
        id: "g1",
        createdAt: "2025-01-01T00:00:00.000Z",
        completedAt: null,
        playerCount: 2,
        roundsCount: 1,
        status: "in-progress",
        winnerId: null,
      },
      {
        id: "g2",
        createdAt: "2025-01-02T00:00:00.000Z",
        completedAt: "2025-01-02T00:10:00.000Z",
        playerCount: 1,
        roundsCount: 0,
        status: "completed",
        winnerId: "p3",
      },
    ]);
  });
});
