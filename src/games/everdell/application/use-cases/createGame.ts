import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import { DuplicatePlayerNameError } from "@core/domain/errors/DuplicatePlayerNameError";
import { DuplicatePlayerCharacterError } from "@core/domain/errors/DuplicatePlayerCharacterError";
import { hasDuplicateNames } from "@core/domain/validation/uniqueNames";
import { hasDuplicateCharacters } from "@/games/everdell/domain/validation/uniqueCharacters";
import { Character } from "@/games/everdell/domain/constants";
import {
  EverdellGame,
  EverdellPlayer,
} from "@/games/everdell/application/entities/EverdellGame";

export async function createEverdellGame(
  repo: GameRepository<EverdellGame>,
  players: { id?: string; name: string; character: Character }[],
  generateId: () => string = uuidv4,
  now: () => string = () => new Date().toISOString(),
) {
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  if (hasDuplicateCharacters(players)) {
    throw new DuplicatePlayerCharacterError();
  }

  const gamePlayers: EverdellPlayer[] = players.map((p) => ({
    id: p.id ?? generateId(),
    name: p.name,
    character: p.character,
    total: 0,
    scores: {
      base: {
        cards: 0,
        prosperity: 0,
        events: 0,
        journey: 0,
        tokens: 0,
      },
    },
  }));

  const game: EverdellGame = {
    id: generateId(),
    startedAt: now(),
    completedAt: null,
    players: gamePlayers,
  };

  await repo.save(game);

  return game;
}
