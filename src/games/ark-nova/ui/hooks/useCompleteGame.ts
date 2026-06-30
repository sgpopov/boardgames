"use client";

import { useState } from "react";
import { completeArkNovaGame } from "@/games/ark-nova/application/use-cases/completeGame";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useArkNovaRepo } from "@/games/ark-nova/ui/hooks/useArkNovaRepo";
import { mapErrorToMessage } from "@/core/ui/errors/mapErrorToMessage";

type UseCompleteGameProps = {
  gameId: string;
  onCompleted?: (game: ArkNovaGame) => void;
};

export function useCompleteGame({ gameId, onCompleted }: UseCompleteGameProps) {
  const repo = useArkNovaRepo();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function complete() {
    setIsCompleting(true);
    setError(null);

    try {
      const updated = await completeArkNovaGame({ repository: repo, gameId });
      onCompleted?.(updated);
    } catch (err) {
      setError(mapErrorToMessage(err, "Failed to complete game"));
    } finally {
      setIsCompleting(false);
    }
  }

  return { complete, isCompleting, error };
}
