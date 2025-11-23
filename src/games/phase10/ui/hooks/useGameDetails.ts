"use client";

import { useCallback, useEffect, useState } from "react";
import { Phase10Game } from "@games/phase10";
import { usePhase10Repo } from "@/games/phase10/ui/hooks/usePhase10Repo";

export function useGameDetails(gameId: string) {
  const repo = usePhase10Repo();
  const [game, setGame] = useState<Phase10Game | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const removeGame = (id: string) => {
    repo.delete(id);
  };

  const getPhaseDetails = useCallback(
    (phaseNumber: number) => {
      return repo.getPhaseDetails(phaseNumber);
    },
    [repo]
  );

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
    getPhaseDetails,
    isFetching,
    removeGame,
  };
}
