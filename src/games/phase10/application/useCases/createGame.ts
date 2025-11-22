import {
  Phase10Game,
  Phase10Player,
} from "@/games/phase10/application/entities/Phase10Game";
import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import { MAX_PLAYERS } from "../validations/players.schema";
import { DuplicatePlayerNameError } from "@core/domain/errors/DuplicatePlayerNameError";
import { hasDuplicateNames } from "@core/domain/validation/uniqueNames";

export async function createPhase10Game(
  repo: GameRepository<Phase10Game>,
  players: { id?: string; name: string }[]
) {
  if (players.length > MAX_PLAYERS) {
    throw Error(
      `Maximum number of players exceeded. You can add up to ${MAX_PLAYERS} players`
    );
  }

  // Enforce uniqueness of player names (case-insensitive, trimmed)
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  const gamePlayers: Phase10Player[] = players.map((p) => ({
    id: p.id ?? uuidv4(),
    name: p.name,
    score: 0,
    phase: 1,
    rounds: [],
  }));

  const game: Phase10Game = {
    id: uuidv4(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    players: gamePlayers,
    rounds: 0,
  };

  await repo.save(game);

  return game;
}
