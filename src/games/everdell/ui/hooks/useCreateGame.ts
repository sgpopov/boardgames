"use client";

import { createEverdellGame } from "@/games/everdell/application/use-cases/createGame";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { PlayersSchema } from "@/games/everdell/domain/validation/players.schema";
import { MAX_PLAYERS_ALLOWED } from "@/games/everdell/domain/constants";
import { useEverdellRepo } from "@/games/everdell/ui/hooks/useEverdellRepo";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: EverdellGame) => void;
};

export function useCreateGame(props: HookProps) {
  const repo = useEverdellRepo();

  return useCreateGamePlayersForm({
    maxPlayers: MAX_PLAYERS_ALLOWED,
    playersSchema: PlayersSchema,
    createGame: (players) => createEverdellGame(repo, players),
    onGameCreated: props.onGameCreated,
  });
}
