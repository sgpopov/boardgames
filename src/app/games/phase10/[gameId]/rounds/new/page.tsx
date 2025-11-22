"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScoreRoundForm from "@games/phase10/ui/components/ScoreRoundForm";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function NewRoundPage() {
  const router = useRouter();
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId || "";

  const redirectToDetails = useCallback(() => {
    router.replace(`/games/phase10/${gameId}`);
  }, [router, gameId]);

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Score round</h2>

        <Link
          href={`/games/phase10/${gameId}`}
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
