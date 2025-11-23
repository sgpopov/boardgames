import { describe, it, expect, beforeEach } from "vitest";
import { Phase10GameRepository } from "./Phase10GameRepository";
import { MockStorage } from "@core/tests/mock-storage";

const makePlayer = ({
  id,
  name,
  phase,
  score,
}: {
  id?: string;
  name?: string;
  phase?: number;
  score?: number;
} = {}) => {
  return {
    id: id ?? "batman",
    name: name ?? "James Bond",
    phase: phase ?? 1,
    score: score ?? 0,
    rounds: [],
  };
};

const makeGame = ({
  id,
  players,
  startedAt,
  rounds,
}: {
  id?: string;
  startedAt?: string;
  players?: Array<ReturnType<typeof makePlayer>>;
  rounds?: number;
} = {}) => {
  return {
    id: id ?? "game1",
    startedAt: startedAt ?? new Date().toISOString(),
    completedAt: null,
    players: players ?? [makePlayer()],
    rounds: rounds ?? 0,
  };
};

describe("Phase10GameRepository", () => {
  let storage: MockStorage;
  let repo: Phase10GameRepository;

  beforeEach(() => {
    storage = new MockStorage("boardgames");
    repo = new Phase10GameRepository(storage);
  });

  it("should return the games sorted by their creation date", async () => {
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

  it("should update existing game", async () => {
    const game1 = makeGame({
      id: "g1",
      players: [makePlayer({ name: "James Bond" })],
    });

    await repo.save(game1);

    let stored = await repo.getById("g1");

    expect(stored).toBeDefined();
    expect(stored!.players[0].name).toBe("James Bond");

    const updated = {
      ...game1,
      players: [makePlayer({ name: "Bruce Wayne" })],
    };

    await repo.save(updated);

    stored = await repo.getById("g1");

    expect(stored!.players).toHaveLength(1);
    expect(stored!.players[0].name).toBe("Bruce Wayne");
  });

  it("should remove games from the storage", async () => {
    const g1 = makeGame({ id: "g1" });

    await repo.save(g1);

    expect(await repo.getById("g1")).toBeDefined();

    await repo.delete("g1");

    expect(await repo.getById("g1")).toBeUndefined();
  });

  it("should handle non-existent games when removing them", async () => {
    const g1 = makeGame({ id: "g1" });

    await repo.save(g1);

    expect(await repo.list()).toHaveLength(1);
    expect(await repo.getById("g1")).toBeDefined();

    await repo.delete("non-existent");

    expect(await repo.list()).toHaveLength(1);
    expect(await repo.getById("g1")).toBeDefined();
  });

  it("getPhaseDetails returns descriptive name for valid phase", () => {
    expect(repo.getPhaseDetails(1)).toMatch(/2 sets of 3/);
    expect(repo.getPhaseDetails(10)).toMatch(/1 set of 5 and 1 set of 3/);
  });

  it("getPhaseDetails returns fallback for invalid phase", () => {
    expect(repo.getPhaseDetails(0)).toBe("Invalid phase number");
    expect(repo.getPhaseDetails(11)).toBe("Invalid phase number");
  });
});
