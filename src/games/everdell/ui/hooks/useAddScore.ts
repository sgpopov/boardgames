"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { addScore, EverdellGame, useEverdellRepo } from "@games/everdell";

interface PlayerScoreRow {
  playerId: string;
  name: string;
  score: string | number;
}

type HookProps = {
  gameId: string;
  gameModule: string;
  moduleComponent: string;
  onScoreAdded?: (game: EverdellGame) => void;
};

export function useAddScore({
  gameId,
  gameModule,
  moduleComponent,
  onScoreAdded,
}: HookProps) {
  const [game, setGame] = useState<EverdellGame | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const repo = useEverdellRepo();

  const { module: selectedModule, component: selectedModuleComponent } =
    repo.getModuleComponent(gameModule, moduleComponent);

  const form = useForm({
    defaultValues: {
      players: [] as PlayerScoreRow[],
    },
    onSubmit: async ({ value }) => {
      const parsedScores = value.players.map((row) => ({
        ...row,
        score:
          row.score === "" || isNaN(Number(row.score)) ? 0 : Number(row.score),
      }));

      const updatedGame = await addScore({
        repository: repo,
        gameId,
        module: selectedModule.type,
        component: selectedModuleComponent.key,
        scores: parsedScores as unknown as {
          playerId: string;
          name: string;
          score: number;
        }[],
      });

      if (onScoreAdded) {
        onScoreAdded(updatedGame);
      }
    },
  });

  const hasLoadedRef = useRef(false);
  const formRef = useRef(form);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    if (!selectedModule?.type || !selectedModuleComponent?.key) return;

    (async () => {
      setLoading(true);

      const data = await repo.getById(gameId);

      if (data) {
        setGame(data);

        const prefill: PlayerScoreRow[] = data.players.map((player) => {
          const playerScore = player.scores as unknown as Record<
            string,
            Record<string, number>
          >;

          return {
            playerId: player.id,
            name: player.name,
            score: String(
              playerScore[selectedModule.type][selectedModuleComponent.key] ??
                ""
            ),
          };
        });

        formRef.current.setFieldValue("players", prefill);
      }

      setLoading(false);
      hasLoadedRef.current = true;
    })();
  }, [gameId, repo, selectedModule.type, selectedModuleComponent.key]);

  const players = useStore(
    form.store,
    (s) => s.values.players
  ) as PlayerScoreRow[];

  return {
    form,
    game,
    loading,
    players,
    selectedModuleComponent,
  };
}
