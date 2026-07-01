import { v4 as uuidv4 } from "uuid";
import { GameRepository } from "@core/domain/repositories/GameRepository";
import { DuplicatePlayerNameError } from "@core/domain/errors/DuplicatePlayerNameError";
import { hasDuplicateNames } from "@core/domain/validation/uniqueNames";
import { ANIMAL_ICONS, AnimalIcon } from "@/games/ark-nova/domain/constants";
import {
  ArkNovaGame,
  ArkNovaPlayer,
} from "@/games/ark-nova/application/entities/ArkNovaGame";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export async function createArkNovaGame(
  repo: GameRepository<ArkNovaGame>,
  players: { id?: string; name: string; color: ArkNovaPlayer["color"] }[],
  generateId: () => string = uuidv4,
  now: () => string = () => new Date().toISOString(),
  shuffleIcons: (icons: AnimalIcon[]) => AnimalIcon[] = shuffle,
) {
  if (hasDuplicateNames(players)) {
    throw new DuplicatePlayerNameError();
  }

  const icons = shuffleIcons([...ANIMAL_ICONS]);

  const gamePlayers: ArkNovaPlayer[] = players.map((p, index) => ({
    id: p.id ?? generateId(),
    name: p.name,
    color: p.color,
    icon: icons[index % icons.length],
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
