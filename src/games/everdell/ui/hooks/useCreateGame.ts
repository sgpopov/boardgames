"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  createEverdellGame,
  EverdellGame,
  MAX_PLAYERS_ALLOWED,
  PlayersSchema,
  useEverdellRepo,
} from "@games/everdell";

interface PlayerRow {
  name: string;
}

type HookProps = {
  onGameCreated: (game: EverdellGame) => void;
};

export function useCreateGame(props: HookProps) {
  const repo = useEverdellRepo();

  const form = useForm({
    defaultValues: {
      players: [{ name: "" }] as PlayerRow[],
    },
    validators: {
      onChange: PlayersSchema,
      onBlur: PlayersSchema,
      onSubmit: PlayersSchema,
    },
    onSubmit: async ({ value }) => {
      const players = value.players.map((p) => ({ name: p.name.trim() }));
      const result = PlayersSchema.safeParse({
        players,
      });

      if (!result.success) {
        return;
      }

      const game = await createEverdellGame(repo, players);

      if (props.onGameCreated) {
        props.onGameCreated(game);
      }
    },
  });

  const players = useStore(form.store, (s) => s.values.players) as PlayerRow[];

  const addPlayer = useCallback(() => {
    if (players.length >= MAX_PLAYERS_ALLOWED) {
      return;
    }

    form.setFieldValue("players", [...players, { name: "" }]);
  }, [form, players]);

  return {
    form,
    players,
    addPlayer,
    maxPlayers: MAX_PLAYERS_ALLOWED,
  };
}
