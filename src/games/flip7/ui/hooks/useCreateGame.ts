"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useFlip7Repo } from "./useFlip7Repo";
import {
  Flip7NewGameSchema,
  MAX_PLAYERS,
  validatePlayers,
} from "../../domain/validation/create-game";
import { Flip7Game } from "../../domain/validation/schemas";
import { createGame } from "../../application/use-cases/createGame";

interface PlayerRow {
  name: string;
}

type HookProps = {
  onGameCreated: (game: Flip7Game) => void;
};

export function useCreateGame(props: HookProps) {
  const repo = useFlip7Repo();

  const form = useForm({
    defaultValues: {
      players: Array(3).fill({ name: "" }) as PlayerRow[],
    },
    validators: {
      onChange: Flip7NewGameSchema,
      onBlur: Flip7NewGameSchema,
      onSubmit: Flip7NewGameSchema,
    },
    onSubmit: async ({ value }) => {
      const players = value.players.map((p) => ({ name: p.name.trim() }));
      const result = validatePlayers({ players });

      if (!result.success) {
        return;
      }

      const game = await createGame(repo, players);

      if (props.onGameCreated) {
        props.onGameCreated(game);
      }
    },
  });

  const players = useStore(form.store, (s) => s.values.players) as PlayerRow[];

  const addPlayer = useCallback(() => {
    if (players.length >= MAX_PLAYERS) {
      return;
    }

    form.setFieldValue("players", [...players, { name: "" }]);
  }, [form, players]);

  return {
    form,
    players,
    addPlayer,
    maxPlayers: MAX_PLAYERS,
  };
}
