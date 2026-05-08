import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import {
  validateAddRound,
  AddRoundInput,
} from "@/games/phase10/domain/validation/rounds.schema";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { WINNER_PHASE } from "@/games/phase10/domain/constants";

type AddRoundOptions = {
  now?: () => string;
};

export async function addPhase10Round(
  repo: GameRepository<Phase10Game>,
  gameId: string,
  scores: AddRoundInput,
  { now = () => new Date().toISOString() }: AddRoundOptions = {},
) {
  const validation = validateAddRound(scores);

  if (!validation.success) {
    const details = validation.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");

    throw new ValidationError("Invalid round input", details);
  }

  const game = await repo.getById(gameId);

  if (!game) {
    throw new GameNotFoundError();
  }

  if (game.completedAt) {
    throw new GameAlreadyCompletedError();
  }

  // Validate phase progression per player: max one phase advance per round
  for (const playerScore of scores.players) {
    const current = game.players.find((p) => p.id === playerScore.id);

    if (current && playerScore.phase > current.phase + 1) {
      throw new ValidationError(
        "Invalid round input",
        `players.${playerScore.id}: phase cannot advance more than one step per round`,
      );
    }
  }

  const players = game.players.map((player) => {
    const playerScore = scores.players.find((sc) => sc.id === player.id);

    if (!playerScore) {
      return player;
    }

    const phaseCompleted = playerScore.phase > player.phase;

    return {
      ...player,
      phase: playerScore.phase,
      score: player.score + playerScore.score,
      rounds: [
        ...player.rounds,
        {
          phase: playerScore.phase,
          score: playerScore.score,
          phaseCompleted,
        },
      ],
    };
  });

  const gameCompleted = players.some((p) => p.phase === WINNER_PHASE);

  const updated: Phase10Game = {
    ...game,
    players,
    rounds: game.rounds + 1,
    completedAt: gameCompleted ? now() : game.completedAt,
  };

  await repo.save(updated);

  return updated;
}
