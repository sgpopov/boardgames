"use client";

import { useState } from "react";
import { completeGame } from "@/games/everdell/application/use-cases/completeGame";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { useEverdellRepo } from "@/games/everdell/ui/hooks/useEverdellRepo";
import { mapErrorToMessage } from "@/core/ui/errors/mapErrorToMessage";

type UseCompleteGameProps = {
  gameId: string;
  onCompleted?: (game: EverdellGame) => void;
};

export function useCompleteGame({ gameId, onCompleted }: UseCompleteGameProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repo = useEverdellRepo();

  async function complete() {
    setIsCompleting(true);
    setError(null);

    try {
      const updated = await completeGame({ repository: repo, gameId });
      onCompleted?.(updated);
    } catch (err) {
      setError(mapErrorToMessage(err, "Failed to complete game"));
    } finally {
      setIsCompleting(false);
    }
  }

  return { complete, isCompleting, error };
}
