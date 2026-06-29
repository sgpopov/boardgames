"use client";

import { createArkNovaGame } from "@/games/ark-nova/application/use-cases/createGame";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { PlayersSchema } from "@/games/ark-nova/domain/validation/players.schema";
import { MAX_PLAYERS_ALLOWED } from "@/games/ark-nova/domain/constants";
import { useArkNovaRepo } from "@/games/ark-nova/ui/hooks/useArkNovaRepo";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: ArkNovaGame) => void;
};

export function useCreateGame(props: HookProps) {
  const repo = useArkNovaRepo();

  return useCreateGamePlayersForm({
    maxPlayers: MAX_PLAYERS_ALLOWED,
    playersSchema: PlayersSchema,
    createGame: (players) => createArkNovaGame(repo, players),
    onGameCreated: props.onGameCreated,
  });
}
