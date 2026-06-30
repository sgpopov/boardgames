import { GameRepository } from "@core/domain/repositories/GameRepository";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { validateAddScores } from "@/games/ark-nova/domain/validation/add-scores.schema";
import { computeVictoryPoints } from "@/games/ark-nova/domain/vp-engine";

export type PlayerScore = {
  playerId: string;
  appeal: number;
  conservationPoints: number;
};

type AddScoresProps = {
  repository: GameRepository<ArkNovaGame>;
  gameId: string;
  scores: PlayerScore[];
};

export async function addArkNovaScores({
  repository,
  gameId,
  scores,
}: AddScoresProps) {
  const game = await repository.getById(gameId);

  if (!game) {
    throw new GameNotFoundError();
  }

  if (game.completedAt) {
    throw new GameAlreadyCompletedError();
  }

  const validation = validateAddScores({ players: scores });

  if (!validation.success) {
    throw new ValidationError(
      "Invalid scores",
      validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    );
  }

  const knownPlayerIds = new Set(game.players.map((player) => player.id));
  const seenPlayerIds = new Set<string>();

  for (const score of scores) {
    if (!knownPlayerIds.has(score.playerId)) {
      throw new ValidationError(
        "Invalid scores",
        `Unknown player id '${score.playerId}'`,
      );
    }

    if (seenPlayerIds.has(score.playerId)) {
      throw new ValidationError(
        "Invalid scores",
        `Duplicate score for player id '${score.playerId}'`,
      );
    }

    seenPlayerIds.add(score.playerId);
  }

  const scoreByPlayer = new Map(scores.map((score) => [score.playerId, score]));

  const players = game.players.map((player) => {
    const entry = scoreByPlayer.get(player.id);

    if (!entry) {
      return player;
    }

    const { officialVp, alternativeVp } = computeVictoryPoints(
      entry.appeal,
      entry.conservationPoints,
    );

    return {
      ...player,
      appeal: entry.appeal,
      conservationPoints: entry.conservationPoints,
      officialVp,
      alternativeVp,
    };
  });

  const updatedGame: ArkNovaGame = {
    ...game,
    players,
  };

  await repository.save(updatedGame);

  return updatedGame;
}
