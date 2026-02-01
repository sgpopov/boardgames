"use client";

import { BadgeCheckIcon, Clock3Icon, DicesIcon } from "lucide-react";
import Link from "next/link";
import { routes } from "@/app/routes";
import { ListEmptyState } from "@/components/composite/ListEmptyState";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useGetGames } from "../hooks/useGetGames";

export function GamesList() {
  const { games, gamesLoaded } = useGetGames();

  if (!gamesLoaded) {
    return (
      <div className="space-y-4">
        <p>Loading games...</p>
      </div>
    );
  }

  if (!games.length) {
    return (
      <ListEmptyState
        title="No games found"
        description="You haven't created any games yet. Get started by creating your first game."
        icon={<DicesIcon />}
        link={{
          href: routes.flip7.newGame(),
          label: "Create new game",
        }}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between pb-5">
        <h2 className="text-xl font-semibold">Games ({games.length})</h2>
        <Link
          href={routes.flip7.newGame()}
          className="text-sm underline self-center"
        >
          Create new game
        </Link>
      </div>

      <div className="space-y-4">
        {games.map((game) => (
          <Item key={game.id} variant="outline" size="sm" asChild>
            <Link
              href={routes.flip7.gameDetails(game.id)}
              className="no-underline"
            >
              <ItemMedia>
                {!game.completedAt && (
                  <Clock3Icon color="orange" className="size-5" />
                )}
                {!!game.completedAt && (
                  <BadgeCheckIcon color="green" className="size-5" />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {game.playerCount} players. Started on{" "}
                  {new Date(game.createdAt).toDateString()}
                </ItemTitle>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </div>
    </>
  );
}
