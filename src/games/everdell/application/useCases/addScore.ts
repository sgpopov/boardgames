import { GameRepository } from "@core/domain/repositories/GameRepository";
import { EverdellGame, EverdellPlayer } from "@games/everdell";

type AddScoreProps = {
  repository: GameRepository<EverdellGame>;
  gameId: string;
  module: keyof EverdellPlayer["scores"];
  component: string;
  scores: { playerId: string; score: number }[];
};

export async function addScore({
  repository,
  gameId,
  module,
  component,
  scores,
}: AddScoreProps) {
  const game = await repository.getById(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const players = game.players.map((player) => {
    const updatedScore = scores.find(
      (score) => score.playerId === player.id
    )?.score;

    const playerScores = {
      ...player.scores,
      [module]: {
        ...player.scores[module],
        ...(updatedScore !== undefined && { [component]: updatedScore }),
      },
    };

    // calculate total as the sum of all component scores across modules
    const updatedTotal = Object.values(playerScores).reduce(
      (acc, moduleScores) => {
        const moduleTotal = Object.values(moduleScores).reduce(
          (sum, value) => sum + value,
          0
        );

        return acc + moduleTotal;
      },
      0
    );

    return {
      ...player,
      scores: playerScores,
      total: updatedTotal,
    };
  });

  const updatedGame: EverdellGame = {
    ...game,
    players,
  };

  await repository.save(updatedGame);

  return updatedGame;
}
