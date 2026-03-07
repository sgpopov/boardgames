"use client";

import { useEffect, useState } from "react";
import { getGameDetails } from "@games/flip7/application/use-cases/getGameDetails";
import { useFlip7Repo } from "./useFlip7Repo";
import { Flip7Game } from "../../domain/entities/game";
import { mapErrorToMessage } from "@core/ui/errors/mapErrorToMessage";

export function useGetGameDetails({ id }: { id: string }) {
  const repo = useFlip7Repo();
  const [game, setGame] = useState<Flip7Game>();
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);
  const [gameError, setGameError] = useState<string | null>(null);

  useEffect(() => {
    getGameDetails(repo, id)
      .then((game) => {
        setGame(game);
        setGameError(null);
        setGameLoaded(true);
      })
      .catch((error) => {
        setGameError(mapErrorToMessage(error, "Unable to fetch game details"));

        setGameLoaded(true);
      });
  }, [repo, id]);

  return { game, gameLoaded, gameError };
}
