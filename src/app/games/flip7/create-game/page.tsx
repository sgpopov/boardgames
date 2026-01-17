"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { Flip7Game } from "@/games/flip7/domain/entities/game";
import CreateFlip7GameForm from "@/games/flip7/ui/components/CreateGameForm";

export default function CreateFlip7Page() {
  const router = useRouter();

  const onGameCreated = useCallback(
    (game: Flip7Game) => {
      router.replace(routes.flip7.gameDetails(game.id));
    },
    [router]
  );

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-xl font-semibold">New Game</h2>

      <CreateFlip7GameForm onGameCreated={onGameCreated} />
    </div>
  );
}
