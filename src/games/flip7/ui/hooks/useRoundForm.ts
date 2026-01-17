"use client";

import { useEffect, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useFlip7Repo } from "./useFlip7Repo";
import { Flip7Game } from "../../domain/entities/game";
import {
  AddRoundInput,
  AddRoundSchema,
} from "../../domain/validation/round-score.schema";
import { addRoundScore } from "../../application/use-cases/addRoundScore";

type PlayerFormRow = {
  id: string;
  score: number | null; // nullable in the form, coerced to 0 on submit
};

export function useRoundForm(gameId: string | undefined) {
  const repo = useFlip7Repo();
  const [game, setGame] = useState<Flip7Game | null>(null);
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
          score: p.score ?? 0,
        })),
      };

      await addRoundScore(repo, game.id, payload);
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

  return {
    form,
    game,
    loading,
    error,
    playersValues,
  };
}
