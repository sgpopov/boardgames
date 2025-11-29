import { describe, it, expect } from "vitest";
import { addScore, createEverdellGame, EverdellGame } from "@games/everdell";
import { InMemoryEverdellRepo } from "@games/everdell/tests/mock-repository";

function buildGameWithPlayers(names: string[]): Promise<EverdellGame> {
  const repo = new InMemoryEverdellRepo(null);

  return createEverdellGame(
    repo,
    names.map((n) => ({ name: n }))
  );
}

describe("addScore", () => {
  it("should throw an error when game is not found", async () => {
    const repo = new InMemoryEverdellRepo(null);

    await expect(
      addScore({
        repository: repo,
        gameId: "missing-id",
        module: "base",
        component: "cards",
        scores: [],
      })
    ).rejects.toThrowError("Game not found");
  });

  it("should update the scores for provided players and persists the game", async () => {
    const game = await buildGameWithPlayers(["Alice", "Bob", "Cara"]);
    const repo = new InMemoryEverdellRepo(game);

    await addScore({
      repository: repo,
      gameId: game.id,
      module: "base",
      component: "cards",
      scores: [
        { playerId: game.players[0].id, score: 5 },
        { playerId: game.players[1].id, score: 10 },
        { playerId: game.players[2].id, score: 15 },
      ],
    });

    const updated = await repo.getById(game.id);

    expect(updated!.players.map((p) => p.scores.base.cards)).toEqual([
      5, 10, 15,
    ]);

    expect(updated!.players.every((p) => p.scores.base.prosperity === 0)).toBe(
      true
    );

    expect(updated!.players.every((p) => p.scores.base.events === 0)).toBe(
      true
    );

    expect(updated!.players.every((p) => p.scores.base.journey === 0)).toBe(
      true
    );

    expect(updated!.players.every((p) => p.scores.base.tokens === 0)).toBe(
      true
    );

    expect(updated!.players.map((p) => p.total)).toEqual([5, 10, 15]);
  });

  it("should gracefully handle missing player scores", async () => {
    const initialGame = await buildGameWithPlayers(["Alice", "Bob"]);
    const repo = new InMemoryEverdellRepo(initialGame);

    await addScore({
      repository: repo,
      gameId: initialGame.id,
      module: "base",
      component: "events",
      scores: [
        { playerId: initialGame.players[0].id, score: 7 },
        // missing second player's score
      ],
    });

    const updated = await repo.getById(initialGame.id);

    expect(updated?.players[0].scores.base.events).toEqual(7);
    expect(updated?.players[1].scores.base.events).toEqual(0);
  });

  it("should update a different component without affecting previously set ones", async () => {
    const game = await buildGameWithPlayers(["Alice", "Bob"]);
    const repo = new InMemoryEverdellRepo(game);

    // set scores for the "cards" component
    await addScore({
      repository: repo,
      gameId: game.id,
      module: "base",
      component: "cards",
      scores: [
        { playerId: game.players[0].id, score: 3 },
        { playerId: game.players[1].id, score: 6 },
      ],
    });

    // set scores for the "prosperity" component
    await addScore({
      repository: repo,
      gameId: game.id,
      module: "base",
      component: "prosperity",
      scores: [
        { playerId: game.players[0].id, score: 2 },
        { playerId: game.players[1].id, score: 4 },
      ],
    });

    const updated = await repo.getById(game.id);

    expect(updated!.players.map((p) => p.scores.base.cards)).toEqual([3, 6]);

    expect(updated!.players.map((p) => p.scores.base.prosperity)).toEqual([
      2, 4,
    ]);

    expect(updated!.players.map((p) => p.total)).toEqual([5, 10]);

    expect(updated!.players.every((p) => p.scores.base.events === 0)).toBe(
      true
    );
    expect(updated!.players.every((p) => p.scores.base.journey === 0)).toBe(
      true
    );
    expect(updated!.players.every((p) => p.scores.base.tokens === 0)).toBe(
      true
    );
  });

  it("should allow updating the component multiple times", async () => {
    const game = await buildGameWithPlayers(["Alice", "Bob"]);
    const repo = new InMemoryEverdellRepo(game);

    await addScore({
      repository: repo,
      gameId: game.id,
      module: "base",
      component: "cards",
      scores: [
        { playerId: game.players[0].id, score: 3 },
        { playerId: game.players[1].id, score: 6 },
      ],
    });

    await addScore({
      repository: repo,
      gameId: game.id,
      module: "base",
      component: "cards",
      scores: [
        { playerId: game.players[0].id, score: 0 },
        { playerId: game.players[1].id, score: 6 },
      ],
    });

    const updated = await repo.getById(game.id);

    expect(updated!.players.map((p) => p.scores.base.cards)).toEqual([0, 6]);
    expect(updated!.players.map((p) => p.total)).toEqual([0, 6]);
  });
});
