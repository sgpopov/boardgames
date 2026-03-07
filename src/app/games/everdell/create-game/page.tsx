"use client";

import { routes } from "@/app/routes";
import { CreateNewGameForm } from "@games/everdell/ui/components/CreateNewGameForm";
import { EverdellGame } from "@games/everdell/application/entities/EverdellGame";
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
      <h1 className="text-xl font-semibold">New Game</h1>

      <CreateNewGameForm onGameCreated={onGameCreated} />
    </div>
  );
}
