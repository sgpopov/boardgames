import { describe, expect, it } from "vitest";
import { completeArkNovaGame } from "@/games/ark-nova/application/use-cases/completeGame";
import { InMemoryArkNovaRepo } from "@/games/ark-nova/tests/mock-repository";
import {
  ArkNovaGame,
  ArkNovaPlayer,
} from "@/games/ark-nova/application/entities/ArkNovaGame";
import { GameNotFoundError } from "@/core/domain/errors/GameNotFoundError";
import { GameAlreadyCompletedError } from "@/core/domain/errors/GameAlreadyCompletedError";
import { ValidationError } from "@/core/domain/errors/ValidationError";
import { computeVictoryPoints } from "@/games/ark-nova/domain/vp-engine";

const scoredPlayer = (
  id: string,
  appeal: number,
  conservationPoints: number,
): ArkNovaPlayer => {
  const { officialVp, alternativeVp } = computeVictoryPoints(
    appeal,
    conservationPoints,
  );

  return {
    id,
    name: id,
    color: "blue",
    icon: "bird",
    appeal,
    conservationPoints,
    officialVp,
    alternativeVp,
  };
};

const unscoredPlayer = (id: string): ArkNovaPlayer => ({
  id,
  name: id,
  color: "yellow",
  icon: "fish",
  appeal: null,
  conservationPoints: null,
  officialVp: null,
  alternativeVp: null,
});

const makeGame = (game: Partial<ArkNovaGame> = {}): ArkNovaGame => ({
  id: game.id ?? "g1",
  startedAt: game.startedAt ?? "2026-01-01T00:00:00.000Z",
  completedAt: game.completedAt ?? null,
  players: game.players ?? [
    scoredPlayer("p1", 70, 22),
    scoredPlayer("p2", 50, 20),
  ],
  winners: game.winners ?? null,
});

describe("completeArkNovaGame", () => {
  it("sets completedAt and computes per-method winners", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    const updated = await completeArkNovaGame({
      repository: repo,
      gameId: "g1",
      now: () => "2026-02-02T00:00:00.000Z",
    });

    expect(updated.completedAt).toBe("2026-02-02T00:00:00.000Z");
    expect(updated.winners).toEqual({
      official: ["p1"],
      alternative: ["p1"],
    });
  });

  it("persists the completed game via the repository", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    await completeArkNovaGame({ repository: repo, gameId: "g1" });

    const saved = await repo.getById("g1");
    expect(saved?.completedAt).not.toBeNull();
    expect(saved?.winners).not.toBeNull();
  });

  it("throws GameNotFoundError when the game does not exist", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    await expect(
      completeArkNovaGame({ repository: repo, gameId: "missing" }),
    ).rejects.toBeInstanceOf(GameNotFoundError);
  });

  it("throws GameAlreadyCompletedError on an already-completed game", async () => {
    const repo = new InMemoryArkNovaRepo(
      makeGame({ completedAt: "2026-01-05T00:00:00.000Z" }),
    );

    await expect(
      completeArkNovaGame({ repository: repo, gameId: "g1" }),
    ).rejects.toBeInstanceOf(GameAlreadyCompletedError);
  });

  it("rejects completing while a player is unscored", async () => {
    const repo = new InMemoryArkNovaRepo(
      makeGame({ players: [scoredPlayer("p1", 70, 22), unscoredPlayer("p2")] }),
    );

    await expect(
      completeArkNovaGame({ repository: repo, gameId: "g1" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
