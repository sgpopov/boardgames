"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AddScoresForm } from "@games/everdell";
import { useCallback } from "react";
import { routes } from "@/app/routes";

export default function CreateEverdellGamePage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const gameId = queryParams.get("gameId");
  const [gameModule, moduleComponent] = (
    queryParams.get("component") ?? ""
  ).split("_");

  const onScoreAdded = useCallback(() => {
    if (!gameId) {
      return;
    }

    router.replace(routes.everdell.gameDetails(gameId));
  }, [gameId, router]);

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  if (!gameModule || !moduleComponent) {
    return (
      <div className="p-6 space-y-4">
        <p>Unable to add scores for selected component</p>
      </div>
    );
  }

  return (
    <AddScoresForm
      gameId={gameId}
      gameModule={gameModule}
      moduleComponent={moduleComponent}
      onScoreAdded={onScoreAdded}
    />
  );
}
