"use client";

import { useEffect, useState } from "react";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useArkNovaRepo } from "./useArkNovaRepo";

export function useGameDetails(gameId: string) {
  const repo = useArkNovaRepo();
  const [game, setGame] = useState<ArkNovaGame | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

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
    setGame,
    isFetching,
  };
}
