import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import {
  validateAddRound,
  AddRoundInput,
} from "@/games/phase10/application/validations/rounds.schema";

export async function addPhase10Round(
  repo: GameRepository<Phase10Game>,
  gameId: string,
  scores: AddRoundInput
) {
  const validation = validateAddRound(scores);

  if (!validation.success) {
    throw new Error(
      "Invalid round input: " +
        validation.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")
    );
  }

  const game = await repo.getById(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const players = game.players.map((player) => {
    const playerScore = scores.players.find((sc) => sc.id === player.id);

    if (!playerScore) {
      return player;
    }

    const phaseCompleted = playerScore.phase > player.phase;

    const rounds = [
      ...player.rounds,
      {
        phase: playerScore.phase,
        score: playerScore.score,
        phaseCompleted,
      },
    ];

    return {
      ...player,
      phase: playerScore.phase,
      score: player.score + playerScore.score,
      rounds,
    };
  });

  const updated: Phase10Game = {
    ...game,
    players,
    rounds: game.rounds + 1,
  };

  await repo.save(updated);

  return updated;
}
