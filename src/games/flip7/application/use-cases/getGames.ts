import type { GameRepository } from "@core/domain/repositories/GameRepository";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import type { GameSummary } from "./types";
import { status } from "@games/flip7/domain/entities/game";

export async function getGames(
  repo: GameRepository<Flip7Game>
): Promise<GameSummary[]> {
  const games = await repo.list();

  return games.map((game) => ({
    id: game.id,
    createdAt: game.createdAt,
    completedAt: game.completedAt,
    playerCount: game.players.length,
    roundsCount: game.rounds.length,
    status: status(game),
    winnerId: game.winnerId,
  }));
}
