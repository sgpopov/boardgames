"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { usePhase10Repo } from "./usePhase10Repo";
import { Phase10Game, addPhase10Round } from "@games/phase10";
import {
  AddRoundSchema,
  AddRoundInput,
} from "@/games/phase10/application/validations/rounds.schema";

type PlayerFormRow = {
  id: string;
  phase: number;
  score: number | null; // nullable in the form, coerced to 0 on submit
};

export function useRoundForm(gameId: string | undefined) {
  const repo = usePhase10Repo();
  const [game, setGame] = useState<Phase10Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      players: [] as PlayerFormRow[],
    },
    validators: {
      onChange: AddRoundSchema,
    },
    onSubmit: async ({ value }) => {
      if (!game) {
        return;
      }

      const payload: AddRoundInput = {
        players: value.players.map((p) => ({
          id: p.id,
          phase: p.phase,
          score: p.score ?? 0,
        })),
      };

      await addPhase10Round(repo, game.id, payload);
    },
  });

  const playersValues = useStore(
    form.store,
    (s) => s.values.players
  ) as PlayerFormRow[];

  useEffect(() => {
    let active = true;

    async function load(id?: string) {
      if (!id) {
        return;
      }

      try {
        const gameDetails = await repo.getById(id);

        if (!active) {
          return;
        }

        if (!gameDetails) {
          setError("Game not found");
          setLoading(false);

          return;
        }

        setGame(gameDetails);

        form.setFieldValue(
          "players",
          gameDetails.players.map((player) => ({
            id: player.id,
            phase: player.phase,
            score: 0,
          }))
        );
      } catch (e) {
        console.error("Failed to fetch the game", e);

        setError("Failed to load game");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load(gameId);

    return () => {
      active = false;
    };
  }, [gameId, repo, form]);

  const handlePhaseChange = useCallback(
    (index: number, delta: number) => {
      const current = form.getFieldValue(`players[${index}].phase`) as number;
      const next = Math.min(10, Math.max(1, current + delta));

      form.setFieldValue(`players[${index}].phase`, next);
    },
    [form]
  );

  return {
    form,
    game,
    loading,
    error,
    playersValues,
    handlePhaseChange,
  };
}
