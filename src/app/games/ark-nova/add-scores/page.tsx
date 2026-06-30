"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddScoresForm } from "@games/ark-nova/ui/components/AddScoresForm";
import { routes } from "@/app/routes";

export default function ArkNovaAddScoresPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const gameId = queryParams.get("gameId");

  const onScoresSaved = useCallback(() => {
    if (!gameId) {
      return;
    }

    router.replace(routes.arkNova.gameDetails(gameId));
  }, [gameId, router]);

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return <AddScoresForm gameId={gameId} onScoresSaved={onScoresSaved} />;
}
