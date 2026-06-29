"use client";

import { routes } from "@/app/routes";
import { CreateNewGameForm } from "@games/ark-nova/ui/components/CreateNewGameForm";
import { ArkNovaGame } from "@games/ark-nova/application/entities/ArkNovaGame";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function CreateArkNovaGamePage() {
  const router = useRouter();

  const onGameCreated = useCallback(
    (game: ArkNovaGame) => {
      router.replace(routes.arkNova.gameDetails(game.id));
    },
    [router],
  );

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-xl font-semibold">New Game</h1>

      <CreateNewGameForm onGameCreated={onGameCreated} />
    </div>
  );
}
