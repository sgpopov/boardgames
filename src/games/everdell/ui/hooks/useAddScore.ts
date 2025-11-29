"use client";

import { useEffect, useState } from "react";
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

export function useAddScore(props: HookProps) {
  const { gameId, gameModule, moduleComponent, onScoreAdded } = props;
  const repo = useEverdellRepo();
  const modules = repo.modules();
  const [game, setGame] = useState<EverdellGame | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const selectedModule = modules.find((module) => module.type === gameModule)!;

  const selectedModuleComponent = selectedModule.components.find(
    (component) => {
      return component.key === moduleComponent;
    }
  )!;

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

  useEffect(() => {
    if (!selectedModule?.type || !selectedModuleComponent?.key || game) {
      return;
    }

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

        form.setFieldValue("players", prefill);
      }

      setLoading(false);
    })();
  }, [
    form,
    game,
    gameId,
    moduleComponent,
    repo,
    selectedModule,
    selectedModuleComponent,
  ]);

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
