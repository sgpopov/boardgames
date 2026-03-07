"use client";

import {
  PlayersSchema,
  MAX_PLAYERS,
} from "@/games/phase10/domain/validation/players.schema";
import { createPhase10Game } from "@/games/phase10/application/use-cases/createGame";
import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";
import { usePhase10Repo } from "@/games/phase10/ui/hooks/usePhase10Repo";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: Phase10Game) => void;
};

export function useNewGameForm(props: HookProps) {
  const repo = usePhase10Repo();

  return useCreateGamePlayersForm({
    maxPlayers: MAX_PLAYERS,
    playersSchema: PlayersSchema,
    createGame: (players) => createPhase10Game(repo, players),
    onGameCreated: props.onGameCreated,
  });
}
