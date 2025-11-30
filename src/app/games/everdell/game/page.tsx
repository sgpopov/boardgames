"use client";

import { GameDetails } from "@games/everdell";
import { useSearchParams } from "next/navigation";

export default function CreateEverdellGamePage() {
  const queryParams = useSearchParams();
  const gameId = queryParams.get("id");

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return <GameDetails gameId={gameId} />;
}
