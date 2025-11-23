import { describe, it, expect } from "vitest";
import { addPhase10Round, AddRoundInput } from "@games/phase10";
import { InMemoryPhase10Repo } from "../../tests/mock-repository";
import { makeGame, makePlayer } from "../../tests/helpers";

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
      })
    ).rejects.toThrow(/Game not found/);
  });

  it("should throw and error for invalid round input", async () => {
    const player = makePlayer();
    const game = makeGame({ players: [player] });
    const repo = new InMemoryPhase10Repo(game);

    const badInput = {
      players: [
        {
          id: player.id,
          phase: 11, // phase > max
          score: 10,
        },
      ],
    };

    await expect(addPhase10Round(repo, game.id, badInput)).rejects.toThrow(
      /Invalid round input/
    );
  });
});
