import { GameRepository } from "@core/domain/repositories/GameRepository";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";

type CompleteGameProps = {
  repository: GameRepository<EverdellGame>;
  gameId: string;
  now?: () => string;
};

export async function completeGame({
  repository,
  gameId,
  now = () => new Date().toISOString(),
}: CompleteGameProps) {
  const game = await repository.getById(gameId);

  if (!game) {
    throw new GameNotFoundError();
  }

  if (game.completedAt) {
    throw new GameAlreadyCompletedError();
  }

  const updated: EverdellGame = {
    ...game,
    completedAt: now(),
  };

  await repository.save(updated);

  return updated;
}
