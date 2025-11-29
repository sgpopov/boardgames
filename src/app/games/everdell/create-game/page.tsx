"use client";

import { routes } from "@/app/routes";
import { CreateNewGameForm, EverdellGame } from "@games/everdell";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function CreateEverdellGamePage() {
  const router = useRouter();

  const onGameCreated = useCallback(
    (game: EverdellGame) => {
      router.replace(routes.everdell.gameDetails(game.id));
    },
    [router]
  );

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-xl font-semibold">New Game</h2>

      <CreateNewGameForm onGameCreated={onGameCreated} />
    </div>
  );
}
