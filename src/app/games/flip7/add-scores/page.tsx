"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ScoreRoundForm from "@/games/flip7/ui/components/ScoreRound";
import { useCallback } from "react";
import { routes } from "@/app/routes";

export default function GameDetailsPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const gameId = queryParams.get("gameId");

  const redirectToGameDetails = useCallback(() => {
    if (!gameId) {
      return;
    }

    router.replace(routes.flip7.gameDetails(gameId));
  }, [router, gameId]);

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return (
    <div className="px-2 py-6 md:px-6 space-y-4">
      <ScoreRoundForm
        gameId={gameId}
        onDone={redirectToGameDetails}
        onCancel={redirectToGameDetails}
      />
    </div>
  );
}
