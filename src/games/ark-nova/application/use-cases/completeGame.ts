import { GameRepository } from "@core/domain/repositories/GameRepository";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { computeWinners } from "@/games/ark-nova/application/winners";

type CompleteGameProps = {
  repository: GameRepository<ArkNovaGame>;
  gameId: string;
  now?: () => string;
};

export async function completeArkNovaGame({
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

  const allScored = game.players.every(
    (player) => player.officialVp !== null && player.alternativeVp !== null,
  );

  if (!allScored) {
    throw new ValidationError(
      "Cannot complete game",
      "All players must be scored before the game can be completed.",
    );
  }

  const updatedGame: ArkNovaGame = {
    ...game,
    completedAt: now(),
    winners: computeWinners(game.players),
  };

  await repository.save(updatedGame);

  return updatedGame;
}
