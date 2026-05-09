import { describe, it, expect } from "vitest";
import { addPhase10Round } from "@/games/phase10/application/use-cases/addRound";
import { AddRoundInput } from "@/games/phase10/domain/validation/rounds.schema";
import { InMemoryPhase10Repo } from "../../tests/mock-repository";
import { makeGame, makePlayer } from "../../tests/helpers";
import { ValidationError } from "@/core/domain/errors/ValidationError";
import { GameAlreadyCompletedError } from "@/core/domain/errors/GameAlreadyCompletedError";
import { WINNER_PHASE } from "@/games/phase10/domain/constants";

describe("addPhase10Round use case", () => {
  it("should update a single player score", async () => {
    const p1 = makePlayer({
      id: "p1",
      name: "James Bond",
    });

    const p2 = makePlayer({
      id: "p2",
      name: "Bruce Wayne",
    });

    const game = makeGame({
      players: [p1, p2],
    });

    const repo = new InMemoryPhase10Repo(game);

    const input: AddRoundInput = {
      players: [{ id: "p1", phase: 2, score: 15 }],
    };

    const updated = await addPhase10Round(repo, game.id, input);

    const updatedP1 = updated.players.find((p) => p.id === "p1")!;
    const updatedP2 = updated.players.find((p) => p.id === "p2")!;

    expect(updated.rounds).toBe(1);

    expect(updatedP1.phase).toBe(2);
    expect(updatedP1.score).toBe(15);
    expect(updatedP1.rounds).toHaveLength(1);
    expect(updatedP1.rounds[0]).toMatchObject({
      phase: 2,
      score: 15,
      phaseCompleted: true,
    });

    expect(updatedP2.phase).toBe(1);
    expect(updatedP2.score).toBe(0);
  });

  it("should not mark phase as completed when it stays the same", async () => {
    const player = makePlayer({
      id: "p1",
      phase: 3,
      score: 30,
    });

    const game = makeGame({
      players: [player],
    });

    const repo = new InMemoryPhase10Repo(game);

    const input: AddRoundInput = {
      players: [{ id: player.id, phase: 3, score: 5 }],
    };

    const updated = await addPhase10Round(repo, game.id, input);

    const updatedP1 = updated.players[0];

    expect(updatedP1.phase).toBe(3);
    expect(updatedP1.score).toBe(35);
    expect(updatedP1.rounds[0].phaseCompleted).toBe(false);
  });

  it("should accumulate score across multiple rounds", async () => {
    const p1 = makePlayer();

    const game = makeGame({
      players: [p1],
    });

    const repo = new InMemoryPhase10Repo(game);

    await addPhase10Round(repo, game.id, {
      players: [{ id: p1.id, phase: 1, score: 10 }],
    });

    let saved = await repo.getById(game.id);

    expect(saved!.players[0].score).toBe(10);

    await addPhase10Round(repo, game.id, {
      players: [{ id: p1.id, phase: 2, score: 20 }],
    });

    saved = await repo.getById(game.id);

    expect(saved!.players[0].score).toBe(30);
    expect(saved!.players[0].phase).toBe(2);
    expect(saved!.rounds).toBe(2);
  });

  it("should ignore players not included in input", async () => {
    const p1 = makePlayer({ id: "p1" });
    const p2 = makePlayer({ id: "p2" });
    const game = makeGame({ players: [p1, p2] });
    const repo = new InMemoryPhase10Repo(game);

    await addPhase10Round(repo, game.id, {
      players: [{ id: p1.id, phase: 1, score: 5 }],
    });

    const saved = await repo.getById(game.id);
    const updatedP2 = saved!.players.find((p) => p.id === p2.id)!;

    expect(updatedP2.score).toBe(0);
    expect(updatedP2.phase).toBe(1);
    expect(updatedP2.rounds.length).toBe(0);
  });

  it("should throw an error on game not found", async () => {
    const repo = new InMemoryPhase10Repo(null);

    await expect(
      addPhase10Round(repo, "missing", {
        players: [{ id: "p1", phase: 1, score: 5 }],
      }),
    ).rejects.toThrow(/Game not found/);
  });

  it("should throw a validation error for phase beyond winner sentinel", async () => {
    const player = makePlayer();
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    const badInput = {
      players: [
        {
          id: player.id,
          phase: 12,
          score: 10,
        },
      ],
    };

    await expect(addPhase10Round(repo, game.id, badInput)).rejects.toThrow(
      ValidationError,
    );
  });

  it("should reject scoring on a completed game", async () => {
    const player = makePlayer({ id: "p1" });
    const game = makeGame({
      players: [player],
      completedAt: new Date().toISOString(),
    });
    const repo = new InMemoryPhase10Repo(game);

    await expect(
      addPhase10Round(repo, game.id, {
        players: [{ id: player.id, phase: 1, score: 5 }],
      }),
    ).rejects.toThrow(GameAlreadyCompletedError);
  });

  it("should complete the game when a player reaches winner phase", async () => {
    const fixedNow = "2026-01-01T12:00:00.000Z";
    const player = makePlayer({ id: "p1", phase: 10 });
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    const updated = await addPhase10Round(
      repo,
      game.id,
      { players: [{ id: player.id, phase: WINNER_PHASE, score: 20 }] },
      { now: () => fixedNow },
    );

    expect(updated.completedAt).toBe(fixedNow);
    expect(updated.players[0].phase).toBe(WINNER_PHASE);
    expect(updated.players[0].score).toBe(20);
  });

  it("should still record score for the winner in the completion round", async () => {
    const player = makePlayer({ id: "p1", phase: 10 });
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    const updated = await addPhase10Round(repo, game.id, {
      players: [{ id: player.id, phase: WINNER_PHASE, score: 35 }],
    });

    const p = updated.players[0];
    expect(p.score).toBe(35);
    expect(p.rounds).toHaveLength(1);
    expect(p.rounds[0]).toMatchObject({
      phase: WINNER_PHASE,
      score: 35,
      phaseCompleted: true,
    });
  });

  it("should not overwrite completedAt on subsequent save attempts", async () => {
    const player = makePlayer({ id: "p1", phase: 10 });
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    await addPhase10Round(repo, game.id, {
      players: [{ id: player.id, phase: WINNER_PHASE, score: 10 }],
    });

    // Second attempt must fail — game is already completed
    await expect(
      addPhase10Round(repo, game.id, {
        players: [{ id: player.id, phase: WINNER_PHASE, score: 5 }],
      }),
    ).rejects.toThrow(GameAlreadyCompletedError);
  });

  it("should reject phase advancement of more than one step per round", async () => {
    const player = makePlayer({ id: "p1", phase: 3 });
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    await expect(
      addPhase10Round(repo, game.id, {
        players: [{ id: player.id, phase: 5, score: 10 }],
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("should allow phase to stay the same (no advancement)", async () => {
    const player = makePlayer({ id: "p1", phase: 5 });
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    const updated = await addPhase10Round(repo, game.id, {
      players: [{ id: player.id, phase: 5, score: 10 }],
    });

    expect(updated.players[0].phase).toBe(5);
  });
});
