import { describe, it, expect, beforeEach } from "vitest";
import { EverdellGameRepository } from "./EverdellGameRepository";
import { MockStorage } from "@core/tests/mock-storage";
import {
  EverdellGame,
  EverdellPlayer,
} from "../application/entities/EverdellGame";

const makePlayer = (details: Partial<EverdellPlayer> = {}): EverdellPlayer => {
  return {
    id: details.id ?? "batman",
    name: details.name ?? "James Bond",
    total: details.total ?? 0,
    scores: details.scores ?? {
      base: {
        cards: 0,
        prosperity: 0,
        events: 0,
        journey: 0,
        tokens: 0,
      },
    },
  };
};

const makeGame = (game: Partial<EverdellGame> = {}): EverdellGame => {
  return {
    id: game.id ?? "game1",
    startedAt: game.startedAt ?? new Date().toISOString(),
    completedAt: null,
    players: game.players ?? [makePlayer()],
  };
};

describe("EverdellGameRepository", () => {
  let storage: MockStorage;
  let repo: EverdellGameRepository;

  beforeEach(() => {
    storage = new MockStorage("boardgames");
    repo = new EverdellGameRepository(storage);
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

  describe("get module component", () => {
    it("should return the correct module and component", () => {
      const result = repo.getModuleComponent("base", "cards");

      expect(result.module.type).toBe("base");
      expect(result.module.components.map((c) => c.key)).toContain("cards");
      expect(result.component.key).toBe("cards");
      expect(result.component.title).toBe("Cards");
    });

    it("should throw when module is not found", () => {
      expect(() => repo.getModuleComponent("nonexistent", "cards")).toThrow(
        /Module nonexistent not found/
      );
    });

    it("should throw when component is not found in module", () => {
      expect(() => repo.getModuleComponent("base", "unknown")).toThrow(
        /Component unknown not found in module base/
      );
    });
  });
});
