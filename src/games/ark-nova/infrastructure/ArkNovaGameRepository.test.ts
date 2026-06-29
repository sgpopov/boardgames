import { describe, it, expect, beforeEach } from "vitest";
import { ArkNovaGameRepository } from "./ArkNovaGameRepository";
import { MockStorage } from "@core/tests/mock-storage";
import {
  ArkNovaGame,
  ArkNovaPlayer,
} from "../application/entities/ArkNovaGame";

const makePlayer = (details: Partial<ArkNovaPlayer> = {}): ArkNovaPlayer => {
  return {
    id: details.id ?? "p1",
    name: details.name ?? "James Bond",
    appeal: details.appeal ?? null,
    conservationPoints: details.conservationPoints ?? null,
    officialVp: details.officialVp ?? null,
    alternativeVp: details.alternativeVp ?? null,
  };
};

const makeGame = (game: Partial<ArkNovaGame> = {}): ArkNovaGame => {
  return {
    id: game.id ?? "game1",
    startedAt: game.startedAt ?? new Date().toISOString(),
    completedAt: game.completedAt ?? null,
    players: game.players ?? [makePlayer()],
    winners: game.winners ?? null,
  };
};

describe("ArkNovaGameRepository", () => {
  const STORAGE_KEY = "ark-nova:games";

  let storage: MockStorage;
  let repo: ArkNovaGameRepository;

  beforeEach(() => {
    storage = new MockStorage("boardgames");
    repo = new ArkNovaGameRepository(storage);
  });

  it("returns games sorted by their creation date (newest first)", async () => {
    const game1 = makeGame({
      id: "g1",
      startedAt: new Date("2025-01-01").toISOString(),
    });
    const game2 = makeGame({
      id: "g2",
      startedAt: new Date("2025-01-02").toISOString(),
    });

    await repo.save(game1);
    await repo.save(game2);

    const list = await repo.list();

    expect(list.map((g) => g.id)).toEqual(["g2", "g1"]);
  });

  it("persists games under the ark-nova:games key", async () => {
    await repo.save(makeGame({ id: "g1" }));

    const raw = storage.read<unknown[]>(STORAGE_KEY, []);

    expect(raw).toHaveLength(1);
  });

  it("updates an existing game", async () => {
    const game1 = makeGame({
      id: "g1",
      players: [makePlayer({ name: "James Bond" })],
    });

    await repo.save(game1);

    const updated = {
      ...game1,
      players: [makePlayer({ name: "Bruce Wayne" })],
    };

    await repo.save(updated);

    const stored = await repo.getById("g1");

    expect(stored!.players).toHaveLength(1);
    expect(stored!.players[0].name).toBe("Bruce Wayne");
  });

  it("removes games from the storage", async () => {
    await repo.save(makeGame({ id: "g1" }));

    expect(await repo.getById("g1")).toBeDefined();

    await repo.delete("g1");

    expect(await repo.getById("g1")).toBeUndefined();
  });

  it("handles deleting a non-existent game", async () => {
    await repo.save(makeGame({ id: "g1" }));

    await repo.delete("non-existent");

    expect(await repo.list()).toHaveLength(1);
    expect(await repo.getById("g1")).toBeDefined();
  });

  it("filters out invalid records when reading from storage", async () => {
    const valid1 = makeGame({ id: "good-1" });
    const valid2 = makeGame({ id: "good-2" });
    const invalid = { id: "bad", players: "wrong" } as unknown;

    storage.write(STORAGE_KEY, [valid1, invalid, valid2]);

    const list = await repo.list();

    expect(list.map((g) => g.id).sort()).toEqual(["good-1", "good-2"]);
    expect(await repo.getById("bad")).toBeUndefined();
  });
});
