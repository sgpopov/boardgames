"use client";

import { useEffect, useState } from "react";
import { getGameDetails } from "@games/flip7/application/use-cases/getGameDetails";
import { useFlip7Repo } from "./useFlip7Repo";
import { Flip7Game } from "../../domain/entities/game";

export function useGetGameDetails({ id }: { id: string }) {
  const repo = useFlip7Repo();
  const [game, setGame] = useState<Flip7Game>();
  const [gameLoaded, setGameLoaded] = useState<boolean>(false);

  useEffect(() => {
    getGameDetails(repo, id)
      .then((game) => {
        setGame(game);
        setGameLoaded(true);
      })
      .catch((error) => {
        console.error(`Unable to fetch game details`, error);

        setGameLoaded(true);
      });
  }, [repo, id]);

  return { game, gameLoaded };
}
