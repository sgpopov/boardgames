import { v4 as uuidv4 } from "uuid";
import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import type { CreateGameInput } from "./types";
import { DuplicatePlayerNameError } from "@/core/domain/errors/DuplicatePlayerNameError";
import { hasDuplicateNames } from "@/core/domain/validation/uniqueNames";

export async function createGame(
  repo: GameRepository<Flip7Game>,
  players: CreateGameInput[]
): Promise<Flip7Game> {
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  const gameId = uuidv4();

  const game: Flip7Game = {
    id: gameId,
    createdAt: new Date().toISOString(),
    completedAt: null,
    players: players.map((player) => ({
      id: uuidv4(),
      name: player.name,
      total: 0,
    })),
    rounds: [],
    winnerId: null,
  };

  await repo.save(game);

  return game;
}
