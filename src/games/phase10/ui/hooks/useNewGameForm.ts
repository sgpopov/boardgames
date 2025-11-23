"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  PlayersSchema,
  createPhase10Game,
  MAX_PLAYERS,
  Phase10Game,
} from "@games/phase10";
import { usePhase10Repo } from "@/games/phase10/ui/hooks/usePhase10Repo";

interface PlayerRow {
  name: string;
}

type HookProps = {
  onGameCreated: (game: Phase10Game) => void;
};

export function useNewGameForm(props: HookProps) {
  const repo = usePhase10Repo();

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

      const game = await createPhase10Game(repo, players);

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
