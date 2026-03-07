"use client";

import { useEffect, useState } from "react";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { useEverdellRepo } from "@/games/everdell/ui/hooks/useEverdellRepo";

export function useGameList() {
  const repository = useEverdellRepo();
  const [games, setGames] = useState<EverdellGame[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);

  useEffect(() => {
    repository.list().then((everdellGames) => {
      setGames(everdellGames);
      setGamesLoaded(true);
    });
  }, [repository]);

  return {
    games,
    gamesLoaded,
  };
}
