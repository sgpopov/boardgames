"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ScoreRoundForm from "@games/phase10/ui/components/ScoreRoundForm";
import { routes } from "@/app/routes";

export default function NewRoundPage() {
  const router = useRouter();
  const params = useSearchParams();
  const gameId = params.get("gameId");

  const redirectToDetails = useCallback(() => {
    if (!gameId) {
      return;
    }

    router.replace(routes.phase10.gameDetails(gameId));
  }, [router, gameId]);

  if (!gameId) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Score round</h2>

        <Link
          href={routes.phase10.gameDetails(gameId)}
          className="text-sm underline self-center"
        >
          Back to details
        </Link>
      </div>

      <ScoreRoundForm
        gameId={gameId}
        onDone={redirectToDetails}
        onCancel={redirectToDetails}
      />
    </div>
  );
}
