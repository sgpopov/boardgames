import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import { DuplicatePlayerNameError } from "@core/domain/errors/DuplicatePlayerNameError";
import { hasDuplicateNames } from "@core/domain/validation/uniqueNames";
import {
  ArkNovaGame,
  ArkNovaPlayer,
} from "@/games/ark-nova/application/entities/ArkNovaGame";

export async function createArkNovaGame(
  repo: GameRepository<ArkNovaGame>,
  players: { id?: string; name: string }[],
  generateId: () => string = uuidv4,
  now: () => string = () => new Date().toISOString(),
) {
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  const gamePlayers: ArkNovaPlayer[] = players.map((p) => ({
    id: p.id ?? generateId(),
    name: p.name,
    appeal: null,
    conservationPoints: null,
    officialVp: null,
    alternativeVp: null,
  }));

  const game: ArkNovaGame = {
    id: generateId(),
    startedAt: now(),
    completedAt: null,
    players: gamePlayers,
    winners: null,
  };

  await repo.save(game);

  return game;
}
