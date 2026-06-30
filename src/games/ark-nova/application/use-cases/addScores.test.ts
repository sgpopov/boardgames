import { describe, expect, it } from "vitest";
import { addArkNovaScores } from "@/games/ark-nova/application/use-cases/addScores";
import { InMemoryArkNovaRepo } from "@/games/ark-nova/tests/mock-repository";
import {
  ArkNovaGame,
  ArkNovaPlayer,
} from "@/games/ark-nova/application/entities/ArkNovaGame";
import { GameNotFoundError } from "@/core/domain/errors/GameNotFoundError";
import { GameAlreadyCompletedError } from "@/core/domain/errors/GameAlreadyCompletedError";
import { ValidationError } from "@/core/domain/errors/ValidationError";

const makePlayer = (details: Partial<ArkNovaPlayer> = {}): ArkNovaPlayer => ({
  id: details.id ?? "p1",
  name: details.name ?? "Alice",
  appeal: details.appeal ?? null,
  conservationPoints: details.conservationPoints ?? null,
  officialVp: details.officialVp ?? null,
  alternativeVp: details.alternativeVp ?? null,
});

const makeGame = (game: Partial<ArkNovaGame> = {}): ArkNovaGame => ({
  id: game.id ?? "g1",
  startedAt: game.startedAt ?? "2026-01-01T00:00:00.000Z",
  completedAt: game.completedAt ?? null,
  players: game.players ?? [
    makePlayer({ id: "p1", name: "Alice" }),
    makePlayer({ id: "p2", name: "Bob" }),
  ],
  winners: game.winners ?? null,
});

describe("addArkNovaScores", () => {
  it("computes and snapshots both VPs per player and keeps the game in-progress", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    const updated = await addArkNovaScores({
      repository: repo,
      gameId: "g1",
      scores: [
        { playerId: "p1", appeal: 70, conservationPoints: 22 },
        { playerId: "p2", appeal: 50, conservationPoints: 20 },
      ],
    });

    expect(updated.completedAt).toBeNull();
    expect(updated.players[0]).toMatchObject({
      appeal: 70,
      conservationPoints: 22,
      officialVp: 70 - 58,
      alternativeVp: 70 + 42,
    });
    expect(updated.players[1]).toMatchObject({
      appeal: 50,
      conservationPoints: 20,
      officialVp: 50 - 64,
      alternativeVp: 50 + 36,
    });
  });

  it("persists the snapshot via the repository", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    await addArkNovaScores({
      repository: repo,
      gameId: "g1",
      scores: [{ playerId: "p1", appeal: 80, conservationPoints: 30 }],
    });

    const stored = await repo.getById("g1");

    expect(stored!.players[0].officialVp).toBe(80 - 34);
    expect(stored!.players[0].alternativeVp).toBe(80 + 66);
    // untouched player keeps unset scores
    expect(stored!.players[1].appeal).toBeNull();
  });

  it("leaves players without a submitted score unchanged", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    const updated = await addArkNovaScores({
      repository: repo,
      gameId: "g1",
      scores: [{ playerId: "p2", appeal: 40, conservationPoints: 10 }],
    });

    expect(updated.players[0].appeal).toBeNull();
    expect(updated.players[1].appeal).toBe(40);
  });

  it("overwrites an existing snapshot on re-score", async () => {
    const repo = new InMemoryArkNovaRepo(
      makeGame({
        players: [
          makePlayer({
            id: "p1",
            appeal: 10,
            conservationPoints: 5,
            officialVp: 10 - 104,
            alternativeVp: 10 - 4,
          }),
        ],
      }),
    );

    const updated = await addArkNovaScores({
      repository: repo,
      gameId: "g1",
      scores: [{ playerId: "p1", appeal: 90, conservationPoints: 35 }],
    });

    expect(updated.players[0]).toMatchObject({
      appeal: 90,
      conservationPoints: 35,
      officialVp: 90 - 19,
      alternativeVp: 90 + 81,
    });
  });

  it("throws when the game does not exist", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    await expect(
      addArkNovaScores({
        repository: repo,
        gameId: "missing",
        scores: [{ playerId: "p1", appeal: 50, conservationPoints: 20 }],
      }),
    ).rejects.toThrow(GameNotFoundError);
  });

  it("throws when the game is already completed", async () => {
    const repo = new InMemoryArkNovaRepo(
      makeGame({ completedAt: "2026-02-01T00:00:00.000Z" }),
    );

    await expect(
      addArkNovaScores({
        repository: repo,
        gameId: "g1",
        scores: [{ playerId: "p1", appeal: 50, conservationPoints: 20 }],
      }),
    ).rejects.toThrow(GameAlreadyCompletedError);
  });

  it("throws a ValidationError for an unknown player id", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    await expect(
      addArkNovaScores({
        repository: repo,
        gameId: "g1",
        scores: [{ playerId: "ghost", appeal: 50, conservationPoints: 20 }],
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("throws a ValidationError for a duplicate player id", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    await expect(
      addArkNovaScores({
        repository: repo,
        gameId: "g1",
        scores: [
          { playerId: "p1", appeal: 50, conservationPoints: 20 },
          { playerId: "p1", appeal: 60, conservationPoints: 25 },
        ],
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("throws a ValidationError on out-of-range input", async () => {
    const repo = new InMemoryArkNovaRepo(makeGame());

    await expect(
      addArkNovaScores({
        repository: repo,
        gameId: "g1",
        scores: [{ playerId: "p1", appeal: 200, conservationPoints: 20 }],
      }),
    ).rejects.toThrow(ValidationError);
  });
});
