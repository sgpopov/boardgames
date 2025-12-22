"use client";

import { useEffect, useState } from "react";
import { getGames } from "@games/flip7/application/use-cases/getGames";
import { useFlip7Repo } from "./useFlip7Repo";
import type { GameSummary } from "@games/flip7/application/use-cases/types";

export function useGetGames() {
  const repo = useFlip7Repo();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);

  useEffect(() => {
    getGames(repo).then((games) => {
      setGames(games);
      setGamesLoaded(true);
    });
  }, [repo]);

  return { games, gamesLoaded };
}
