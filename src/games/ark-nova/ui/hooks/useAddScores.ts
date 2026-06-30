"use client";

import { useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { addArkNovaScores } from "@/games/ark-nova/application/use-cases/addScores";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useArkNovaRepo } from "@/games/ark-nova/ui/hooks/useArkNovaRepo";

export interface ScoreRow {
  playerId: string;
  name: string;
  appeal: string;
  conservationPoints: string;
}

type HookProps = {
  gameId: string;
  onScoresSaved?: (game: ArkNovaGame) => void;
};

export function useAddScores({ gameId, onScoresSaved }: HookProps) {
  const repo = useArkNovaRepo();
  const [game, setGame] = useState<ArkNovaGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm({
    defaultValues: {
      players: [] as ScoreRow[],
    },
    onSubmit: async ({ value }) => {
      const scores = value.players.map((row) => ({
        playerId: row.playerId,
        appeal: Number(row.appeal),
        conservationPoints: Number(row.conservationPoints),
      }));

      const updated = await addArkNovaScores({
        repository: repo,
        gameId,
        scores,
      });

      setGame(updated);
      onScoresSaved?.(updated);
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await repo.getById(gameId);

      if (data) {
        setGame(data);

        form.setFieldValue(
          "players",
          data.players.map((player) => ({
            playerId: player.id,
            name: player.name,
            appeal: player.appeal === null ? "" : String(player.appeal),
            conservationPoints:
              player.conservationPoints === null
                ? ""
                : String(player.conservationPoints),
          })),
        );
      }

      setLoading(false);
    })();
  }, [gameId, repo, form]);

  const players = useStore(form.store, (s) => s.values.players) as ScoreRow[];

  return {
    form,
    game,
    loading,
    players,
  };
}
