import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";

export async function getGameDetails(
  repo: GameRepository<Flip7Game>,
  gameId: string
): Promise<Flip7Game> {
  const game = await repo.getById(gameId);

  if (!game) {
    throw new GameNotFoundError();
  }

  return game;
}
