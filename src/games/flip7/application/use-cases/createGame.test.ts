import { describe, it, expect, beforeEach, vi } from "vitest";
import { createGame } from "./createGame";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import type { CreateGameInput } from "./types";

describe("createGame", () => {
  let mockRepo: GameRepository<Flip7Game>;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      delete: vi.fn(),
    };
  });

  it("should create a game with valid players", async () => {
    const players: CreateGameInput[] = [
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ];

    const game = await createGame(mockRepo, players);

    expect(game).toBeDefined();
    expect(game.id).toBeTruthy();
    expect(game.players).toHaveLength(3);
    expect(game.players[0].name).toBe("Alice");
    expect(game.players[1].name).toBe("Bob");
    expect(game.players[2].name).toBe("Charlie");
  });

  it("should generate unique IDs for game and players", async () => {
    const players: CreateGameInput[] = [{ name: "Alice" }, { name: "Bob" }];

    const game = await createGame(mockRepo, players);

    expect(game.id).toBeTruthy();
    expect(game.players[0].id).toBeTruthy();
    expect(game.players[1].id).toBeTruthy();
    expect(game.id).not.toBe(game.players[0].id);
    expect(game.players[0].id).not.toBe(game.players[1].id);
  });

  it("should initialize game with correct default values", async () => {
    const players: CreateGameInput[] = [{ name: "Alice" }];

    const game = await createGame(mockRepo, players);

    expect(game.completedAt).toBeNull();
    expect(game.rounds).toEqual([]);
    expect(game.winnerId).toBeNull();
    expect(game.players[0].total).toBe(0);
  });

  it("should call repository save method with the created game", async () => {
    const players: CreateGameInput[] = [{ name: "Alice" }];

    const game = await createGame(mockRepo, players);

    expect(mockRepo.save).toHaveBeenCalledOnce();
    expect(mockRepo.save).toHaveBeenCalledWith(game);
  });

  it("should throw DuplicatePlayerNameError when players have duplicate names", async () => {
    const players: CreateGameInput[] = [
      { name: "Alice" },
      { name: "Bob" },
      { name: "Alice" },
    ];

    await expect(createGame(mockRepo, players)).rejects.toThrow(
      DuplicatePlayerNameError
    );
  });

  it("should not save game when duplicate names are detected", async () => {
    const players: CreateGameInput[] = [{ name: "alice" }, { name: "Alice" }];

    await expect(createGame(mockRepo, players)).rejects.toThrow(
      DuplicatePlayerNameError
    );

    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it("should return the created game", async () => {
    const players: CreateGameInput[] = [{ name: "Alice" }];

    const game = await createGame(mockRepo, players);

    expect(game).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(String),
      completedAt: null,
      players: [
        {
          id: expect.any(String),
          name: "Alice",
          total: 0,
        },
      ],
      rounds: [],
      winnerId: null,
    });
  });
});
