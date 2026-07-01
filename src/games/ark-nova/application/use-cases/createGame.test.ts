import { describe, expect, it } from "vitest";
import { createArkNovaGame } from "@/games/ark-nova/application/use-cases/createGame";
import { InMemoryArkNovaRepo } from "@/games/ark-nova/tests/mock-repository";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import { ANIMAL_ICONS } from "@/games/ark-nova/domain/constants";

describe("createArkNovaGame", () => {
  it("creates an in-progress game with scoring fields unset", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    const game = await createArkNovaGame(repo, [
      { name: "Alice", color: "blue" },
      { name: "Bob", color: "yellow" },
    ]);

    expect(game.players).toHaveLength(2);
    expect(game.players[0]).toMatchObject({
      name: "Alice",
      color: "blue",
      appeal: null,
      conservationPoints: null,
      officialVp: null,
      alternativeVp: null,
    });
    expect(game.completedAt).toBeNull();
    expect(game.winners).toBeNull();
  });

  it("uses injected generateId and now for determinism", async () => {
    const repo = new InMemoryArkNovaRepo(null);
    const ids = ["p1", "p2", "game"];

    const game = await createArkNovaGame(
      repo,
      [
        { name: "Alice", color: "blue" },
        { name: "Bob", color: "yellow" },
      ],
      () => ids.shift() ?? "fallback",
      () => "2026-01-01T00:00:00.000Z",
    );

    expect(game.id).toBe("game");
    expect(game.players.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(game.startedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("persists the created game to the repository", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    const game = await createArkNovaGame(repo, [
      { name: "Solo", color: "blue" },
    ]);

    expect(await repo.getById(game.id)).toEqual(game);
  });

  it("throws on duplicate player names", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    await expect(
      createArkNovaGame(repo, [
        { name: "Bruce", color: "blue" },
        { name: " bruce ", color: "yellow" },
      ]),
    ).rejects.toThrow(DuplicatePlayerNameError);
  });

  it("assigns each player a distinct icon, independent of color, using the injected shuffle", async () => {
    const repo = new InMemoryArkNovaRepo(null);

    const game = await createArkNovaGame(
      repo,
      [
        { name: "Alice", color: "blue" },
        { name: "Bob", color: "yellow" },
        { name: "Carol", color: "red" },
        { name: "Dave", color: "black" },
      ],
      undefined,
      undefined,
      (icons) => [...icons].reverse(),
    );

    expect(game.players.map((p) => p.icon)).toEqual(
      [...ANIMAL_ICONS].reverse(),
    );
    expect(new Set(game.players.map((p) => p.icon)).size).toBe(4);
  });
});
