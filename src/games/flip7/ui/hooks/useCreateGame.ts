"use client";

import { useFlip7Repo } from "./useFlip7Repo";
import {
  Flip7NewGameSchema,
  MAX_PLAYERS,
} from "../../domain/validation/create-game";
import { Flip7Game } from "../../domain/validation/schemas";
import { createGame } from "../../application/use-cases/createGame";
import { useCreateGamePlayersForm } from "@core/ui/hooks/useCreateGamePlayersForm";

type HookProps = {
  onGameCreated: (game: Flip7Game) => void;
};

export function useCreateGame(props: HookProps) {
  const repo = useFlip7Repo();

  return useCreateGamePlayersForm({
    maxPlayers: MAX_PLAYERS,
    defaultPlayerCount: 3,
    playersSchema: Flip7NewGameSchema,
    createGame: (players) => createGame(repo, players),
    onGameCreated: props.onGameCreated,
  });
}
