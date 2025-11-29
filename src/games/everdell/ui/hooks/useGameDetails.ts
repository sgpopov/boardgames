"use client";

import { useEffect, useState } from "react";
import { EverdellGame } from "@games/everdell";
import { useEverdellRepo } from "./useEverdellRepo";

export function useGameDetails(gameId: string) {
  const repo = useEverdellRepo();
  const [game, setGame] = useState<EverdellGame | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const modules = repo.modules();

  useEffect(() => {
    const fetchGame = async (id: string) => {
      const game = await repo.getById(id);

      setGame(game ?? null);
      setIsFetching(false);
    };

    fetchGame(gameId);
  }, [repo, gameId]);

  return {
    game,
    isFetching,
    modules,
  };
}
