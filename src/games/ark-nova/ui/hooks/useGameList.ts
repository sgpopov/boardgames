"use client";

import { useCallback, useEffect, useState } from "react";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useArkNovaRepo } from "@/games/ark-nova/ui/hooks/useArkNovaRepo";

export function useGameList() {
  const repository = useArkNovaRepo();
  const [games, setGames] = useState<ArkNovaGame[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);

  useEffect(() => {
    repository.list().then((arkNovaGames) => {
      setGames(arkNovaGames);
      setGamesLoaded(true);
    });
  }, [repository]);

  const deleteGame = useCallback(
    async (id: string) => {
      await repository.delete(id);
      setGames((current) => current.filter((game) => game.id !== id));
    },
    [repository],
  );

  return {
    games,
    gamesLoaded,
    deleteGame,
  };
}
