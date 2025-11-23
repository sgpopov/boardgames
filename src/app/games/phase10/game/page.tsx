"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameDetails } from "@games/phase10/ui/components/GameDetails";
import { routes } from "@/app/routes";

export default function Phase10GameDetailPage() {
  const query = useSearchParams();
  const router = useRouter();

  const gameId = query.get("id");

  const onGameDeletion = useCallback(() => {
    router.replace(routes.phase10.list());
  }, [router]);

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return <GameDetails gameId={gameId} onGameDeletion={onGameDeletion} />;
}
