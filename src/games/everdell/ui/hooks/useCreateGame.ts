"use client";

import { createEverdellGame } from "@/games/everdell/application/use-cases/createGame";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { PlayersSchema } from "@/games/everdell/domain/validation/players.schema";
import {
  CHARACTERS,
  Character,
  MAX_PLAYERS_ALLOWED,
} from "@/games/everdell/domain/constants";
import { useEverdellRepo } from "@/games/everdell/ui/hooks/useEverdellRepo";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: EverdellGame) => void;
};

export type EverdellPlayerRow = { name: string; character: Character };

// There are as many Characters as player slots, so a free one always exists;
// the fallback only guards a caller that ignores the player limit.
function nextFreeCharacter(existing: EverdellPlayerRow[]): Character {
  const taken = new Set(existing.map((player) => player.character));

  return CHARACTERS.find((character) => !taken.has(character)) ?? CHARACTERS[0];
}

export function useCreateGame(props: HookProps) {
  const repo = useEverdellRepo();

  return useCreateGamePlayersForm<EverdellGame, EverdellPlayerRow>({
    maxPlayers: MAX_PLAYERS_ALLOWED,
    playersSchema: PlayersSchema,
    createDefaultPlayer: (existing) => ({
      name: "",
      character: nextFreeCharacter(existing),
    }),
    createGame: (players) => createEverdellGame(repo, players),
    onGameCreated: props.onGameCreated,
  });
}
