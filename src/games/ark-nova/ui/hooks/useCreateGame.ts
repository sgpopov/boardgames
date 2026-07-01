"use client";

import { createArkNovaGame } from "@/games/ark-nova/application/use-cases/createGame";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { PlayersSchema } from "@/games/ark-nova/domain/validation/players.schema";
import { MAX_PLAYERS_ALLOWED, PlayerColor } from "@/games/ark-nova/domain/constants";
import { useArkNovaRepo } from "@/games/ark-nova/ui/hooks/useArkNovaRepo";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: ArkNovaGame) => void;
};

// Color starts unset ("") until the player picks one manually.
export type ArkNovaPlayerRow = { name: string; color: PlayerColor | "" };

function isPlayerColor(color: PlayerColor | ""): color is PlayerColor {
  return color !== "";
}

export function useCreateGame(props: HookProps) {
  const repo = useArkNovaRepo();

  return useCreateGamePlayersForm<ArkNovaGame, ArkNovaPlayerRow>({
    maxPlayers: MAX_PLAYERS_ALLOWED,
    playersSchema: PlayersSchema,
    createDefaultPlayer: () => ({ name: "", color: "" }),
    createGame: (players) => {
      const validated = players.map((p) => {
        if (!isPlayerColor(p.color)) {
          throw new Error(`Player "${p.name}" has no color selected.`);
        }

        return { name: p.name, color: p.color };
      });

      return createArkNovaGame(repo, validated);
    },
    onGameCreated: props.onGameCreated,
  });
}
