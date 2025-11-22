"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import NewPhase10GameForm from "@/games/phase10/ui/components/CreateNewGameForm";
import { Phase10Game } from "@/games/phase10";

export default function NewPhase10GamePage() {
  const router = useRouter();

  const onGameCreated = useCallback(
    (game: Phase10Game) => {
      router.replace(`/games/phase10/${game.id}`);
    },
    [router]
  );

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-xl font-semibold">New Game</h2>

      <NewPhase10GameForm onGameCreated={onGameCreated} />
    </div>
  );
}
