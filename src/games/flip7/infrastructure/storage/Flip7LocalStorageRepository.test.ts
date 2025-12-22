import { describe, it, expect, beforeEach } from "vitest";
import { Flip7LocalStorageRepository } from "@games/flip7/infrastructure/storage/Flip7LocalStorageRepository";
import { MockStorage } from "@core/tests/mock-storage";

function clearKey(ns: string, key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(`${ns}:${key}`);
  }
}

const makePlayer = ({
  id,
  name,
  total,
}: {
  id?: string;
  name?: string;
  total?: number;
} = {}) => ({
  id: id ?? "p1",
  name: name ?? "Alice",
  total: total ?? 0,
});

const makeGame = ({
  id,
  createdAt,
  players,
  rounds,
  winnerId,
  completedAt,
}: {
  id?: string;
  createdAt?: string;
  players?: Array<ReturnType<typeof makePlayer>>;
  rounds?: Array<{
    index: number;
    scores: Array<{ playerId: string; score: number }>;
    savedAt: string;
  }>;
  winnerId?: string | null;
  completedAt?: string | null;
} = {}) => ({
  id: id ?? "g1",
  createdAt: createdAt ?? new Date().toISOString(),
  completedAt: completedAt ?? null,
  players: players ?? [makePlayer()],
  rounds: rounds ?? [
    {
      index: 1,
      scores: [{ playerId: "p1", score: 0 }],
      savedAt: new Date().toISOString(),
    },
  ],
  winnerId: winnerId ?? null,
});

describe("Flip7LocalStorageRepository", () => {
  const STORAGE_NS = "boardgames";
  const STORAGE_KEY = "flip7:games";

  let storage: MockStorage;
  let repo: Flip7LocalStorageRepository;

  beforeEach(() => {
    clearKey(STORAGE_NS, STORAGE_KEY);
    storage = new MockStorage(STORAGE_NS);
    repo = new Flip7LocalStorageRepository(storage);
  });

  it("returns empty list when no games are saved", async () => {
    const list = await repo.list();

    expect(list).toEqual([]);
  });

  it("sorts games by createdAt descending", async () => {
    const game1 = makeGame({
      id: "g1",
      createdAt: new Date("2025-01-01").toISOString(),
    });

    const game2 = makeGame({
      id: "g2",
      createdAt: new Date("2025-03-01").toISOString(),
    });

    const game3 = makeGame({
      id: "g3",
      createdAt: new Date("2025-02-01").toISOString(),
    });

    await repo.save(game1);
    await repo.save(game2);
    await repo.save(game3);

    const list = await repo.list();

    expect(list.map((g) => g.id)).toEqual(["g2", "g3", "g1"]);
  });

  it("should return undefined when game is missing", async () => {
    expect(await repo.getById("nope")).toBeUndefined();
  });

  it("creates a new game and retrieves it", async () => {
    const game = makeGame({ id: "g1" });
    await repo.save(game);

    const stored = await repo.getById("g1");

    expect(stored).toBeDefined();
    expect(stored!.id).toBe("g1");
  });

  it("updates an existing game (upsert behavior)", async () => {
    const original = makeGame({
      id: "g1",
      players: [makePlayer({ name: "Alice" })],
    });

    await repo.save(original);

    const updated = makeGame({
      id: "g1",
      players: [makePlayer({ name: "Bob" })],
    });

    await repo.save(updated);

    const stored = await repo.getById("g1");
    expect(stored).toBeDefined();
    expect(stored!.players).toHaveLength(1);
    expect(stored!.players[0].name).toBe("Bob");
  });

  it("deletes an existing game", async () => {
    await repo.save(makeGame({ id: "g1" }));
    expect(await repo.getById("g1")).toBeDefined();

    await repo.delete("g1");
    expect(await repo.getById("g1")).toBeUndefined();
  });

  it("deleting non-existent game leaves storage unchanged", async () => {
    await repo.save(makeGame({ id: "g1" }));
    await repo.save(makeGame({ id: "g2" }));

    const before = await repo.list();
    await repo.delete("no-such-id");
    const after = await repo.list();

    expect(after.map((g) => g.id)).toEqual(before.map((g) => g.id));
  });

  it("filters out invalid records via schema when reading", async () => {
    const valid1 = makeGame({ id: "good-1" });
    const valid2 = makeGame({ id: "good-2" });
    const invalid = { wrong: true, id: "bad" } as unknown;

    storage.write(STORAGE_KEY, [valid1, invalid, valid2]);

    const list = await repo.list();
    expect(list.map((g) => g.id).sort()).toEqual(["good-1", "good-2"]);
    expect(await repo.getById("bad")).toBeUndefined();
  });
});
