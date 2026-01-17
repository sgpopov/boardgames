import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";

export async function getGameDetails(
  repo: GameRepository<Flip7Game>,
  gameId: string
): Promise<Flip7Game> {
  const game = await repo.getById(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
}
