import { GameRepository } from "@core/domain/repositories/GameRepository";
import { Flip7Game } from "../../domain/entities/game";
import {
  AddRoundInput,
  validateAddRound,
} from "../../domain/validation/round-score.schema";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";

export async function addRoundScore(
  repo: GameRepository<Flip7Game>,
  gameId: string,
  scores: AddRoundInput,
  now: () => string = () => new Date().toISOString()
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
    throw new GameNotFoundError();
  }

  if (game.completedAt) {
    throw new GameAlreadyCompletedError();
  }

  const gameRounds = game.rounds;

  gameRounds.push({
    index: gameRounds.length + 1,
    scores: scores.players.map((p) => ({
      playerId: p.id,
      score: p.score,
    })),
    savedAt: now(),
  });

  const players = game.players.map((player) => {
    const playerScore = scores.players.find((sc) => sc.id === player.id);

    if (!playerScore) {
      return player;
    }

    return {
      ...player,
      total: player.total + playerScore.score,
    };
  });

  const winner = getGameWinner(players);

  const updated: Flip7Game = {
    ...game,
    rounds: gameRounds,
    players,
    completedAt: winner ? now() : null,
    winnerId: winner?.id ?? null,
  };

  await repo.save(updated);

  return updated;
}

const getGameWinner = (
  players: Flip7Game["players"]
): Flip7Game["players"][0] | null => {
  if (!players || players.length === 0) {
    return null;
  }

  let highestScore = 0;
  let numberOfHighestScores = 0;
  let winner = null;

  players.forEach((player) => {
    if (player.total < 200) {
      return;
    }

    if (player.total === highestScore) {
      numberOfHighestScores += 1;

      return;
    }

    numberOfHighestScores = 1;
    highestScore = player.total;

    winner = player;
  });

  return numberOfHighestScores === 1 ? winner : null;
};
