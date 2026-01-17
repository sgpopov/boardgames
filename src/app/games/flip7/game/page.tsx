"use client";

import { useSearchParams } from "next/navigation";
import { GameDetails } from "@games/flip7/ui/components/GameDetails";

export default function GameDetailsPage() {
  const queryParams = useSearchParams();
  const gameId = queryParams.get("id");

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return <GameDetails id={gameId} />;
}
