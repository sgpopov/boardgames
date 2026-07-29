"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";

type PlayerRow = {
  name: string;
};

type PlayersSchemaContract = {
  safeParse: (input: unknown) => { success: boolean };
};

type UseCreateGamePlayersFormOptions<
  TGame,
  TPlayerRow extends PlayerRow = PlayerRow,
> = {
  maxPlayers: number;
  defaultPlayerCount?: number;
  playersSchema: PlayersSchemaContract;
  createGame: (players: TPlayerRow[]) => Promise<TGame>;
  onGameCreated: (game: TGame) => void;
  // Override for player rows with fields beyond `name` (e.g. Ark Nova's color).
  // Receives the rows that already exist, so a default can depend on them —
  // Everdell pre-fills each new slot with a Character no one has taken.
  createDefaultPlayer?: (existing: TPlayerRow[]) => TPlayerRow;
};

function buildInitialPlayers<TPlayerRow>(
  count: number,
  createDefaultPlayer: (existing: TPlayerRow[]) => TPlayerRow,
): TPlayerRow[] {
  const players: TPlayerRow[] = [];

  for (let i = 0; i < count; i++) {
    players.push(createDefaultPlayer(players));
  }

  return players;
}

export function useCreateGamePlayersForm<
  TGame,
  TPlayerRow extends PlayerRow = PlayerRow,
>({
  maxPlayers,
  defaultPlayerCount = 1,
  playersSchema,
  createGame,
  onGameCreated,
  createDefaultPlayer = () => ({ name: "" }) as TPlayerRow,
}: UseCreateGamePlayersFormOptions<TGame, TPlayerRow>) {
  const form = useForm({
    defaultValues: {
      players: buildInitialPlayers(defaultPlayerCount, createDefaultPlayer),
    },
    // No onBlur validator: it would stamp a stale error onto whichever field
    // hasn't fired handleBlur yet (e.g. a button-based picker), and never
    // clear it since onChange revalidation doesn't touch the onBlur error
    // slot. onChange already validates on every value change.
    validators: {
      onChange: playersSchema as never,
      onSubmit: playersSchema as never,
    },
    onSubmit: async ({ value }) => {
      const players = value.players.map((player) => ({
        ...player,
        name: player.name.trim(),
      })) as TPlayerRow[];

      const result = playersSchema.safeParse({ players });

      if (!result.success) {
        return;
      }

      const game = await createGame(players);

      onGameCreated(game);
    },
  });

  const players = useStore(form.store, (s) => s.values.players) as TPlayerRow[];

  const addPlayer = useCallback(() => {
    if (players.length >= maxPlayers) {
      return;
    }

    form.pushFieldValue("players", createDefaultPlayer(players) as never);
  }, [form, maxPlayers, players, createDefaultPlayer]);

  return {
    form,
    players,
    addPlayer,
    maxPlayers,
  };
}
