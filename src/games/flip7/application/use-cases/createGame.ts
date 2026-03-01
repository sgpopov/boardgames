import { v4 as uuidv4 } from "uuid";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import type { CreateGameInput } from "./types";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import { hasDuplicateNames } from "@/core/domain/validation/uniqueNames";

export async function createGame(
  repo: GameRepository<Flip7Game>,
  players: CreateGameInput[],
  generateId: () => string = uuidv4,
  now: () => string = () => new Date().toISOString()
): Promise<Flip7Game> {
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  const game: Flip7Game = {
    id: generateId(),
    createdAt: now(),
    completedAt: null,
    players: players.map((player) => ({
      id: generateId(),
      name: player.name,
      total: 0,
    })),
    rounds: [],
    winnerId: null,
  };

  await repo.save(game);

  return game;
}
