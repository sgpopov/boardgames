"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";

type PlayerRow = {
  name: string;
};

type PlayersSchemaContract = {
  safeParse: (input: unknown) => { success: boolean };
};

type UseCreateGamePlayersFormOptions<TGame> = {
  maxPlayers: number;
  defaultPlayerCount?: number;
  playersSchema: PlayersSchemaContract;
  createGame: (players: PlayerRow[]) => Promise<TGame>;
  onGameCreated: (game: TGame) => void;
};

export function useCreateGamePlayersForm<TGame>({
  maxPlayers,
  defaultPlayerCount = 1,
  playersSchema,
  createGame,
  onGameCreated,
}: UseCreateGamePlayersFormOptions<TGame>) {
  const form = useForm({
    defaultValues: {
      players: Array.from({ length: defaultPlayerCount }, () => ({
        name: "",
      })) as PlayerRow[],
    },
    validators: {
      onChange: playersSchema as never,
      onBlur: playersSchema as never,
      onSubmit: playersSchema as never,
    },
    onSubmit: async ({ value }) => {
      const players = value.players.map((player) => ({
        name: player.name.trim(),
      }));

      const result = playersSchema.safeParse({ players });

      if (!result.success) {
        return;
      }

      const game = await createGame(players);

      onGameCreated(game);
    },
  });

  const players = useStore(form.store, (s) => s.values.players) as PlayerRow[];

  const addPlayer = useCallback(() => {
    if (players.length >= maxPlayers) {
      return;
    }

    form.setFieldValue("players", [...players, { name: "" }]);
  }, [form, maxPlayers, players]);

  return {
    form,
    players,
    addPlayer,
    maxPlayers,
  };
}
