"use client";

import { useEffect, useState } from "react";
import { EverdellGame, useEverdellRepo } from "@games/everdell";

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
