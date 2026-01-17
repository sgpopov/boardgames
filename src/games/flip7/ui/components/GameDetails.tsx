"use client";

import { AwardIcon } from "lucide-react";
import Link from "next/link";
import { routes } from "@/app/routes";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useGetGameDetails } from "../hooks/useGetGameDetails";
import { Button } from "@/components/ui/button";

export function GameDetails({ id }: { id: string }) {
  const { game, gameLoaded } = useGetGameDetails({ id });

  if (!gameLoaded) {
    return (
      <div className="p-5 space-y-6">
        <p>Loading games details...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-5 space-y-6">
        <p>Game not found</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Game details</h2>

        <Link
          href={routes.flip7.score(game.id)}
          className="text-sm underline self-center"
        >
          <Button variant="secondary" size="sm" aria-label="Score round">
            <AwardIcon />
            Score round
          </Button>
        </Link>
      </div>

      <div>
        <i>{game.rounds.length} rounds played </i>
      </div>

      <div className="flex w-full  flex-col gap-2">
        {game.players.map((player) => (
          <Item key={player.id} variant="outline" className="gap-1">
            <ItemMedia>
              <div className="w-8 h-8 inline-flex justify-center items-center mr-2 rounded-full bg-green-300 self-center text-center">
                {player.name[0]}
              </div>
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="font-bold">{player.name}</ItemTitle>
            </ItemContent>

            <ItemActions className="font-bold">{player.total}</ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
}
