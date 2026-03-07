"use client";

import Link from "next/link";
import {
  BadgeCheckIcon,
  ChevronRightIcon,
  Clock3Icon,
  DicesIcon,
} from "lucide-react";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { ListEmptyState } from "@/components/composite/ListEmptyState";
import { routes } from "@/app/routes";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { useGameList } from "@/games/everdell/ui/hooks/useGameList";

export function ListEverdellGames() {
  const { games, gamesLoaded } = useGameList();

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
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Games ({games.length})</h1>

      {games.map((game: EverdellGame) => (
        <Item key={game.id} variant="outline" size="sm" asChild>
          <Link
            href={routes.everdell.gameDetails(game.id)}
            className="no-underline"
          >
            <ItemMedia>
              {!game.completedAt && (
                <Clock3Icon
                  color="orange"
                  className="size-5"
                  aria-hidden="true"
                />
              )}
              {!!game.completedAt && (
                <BadgeCheckIcon
                  color="green"
                  className="size-5"
                  aria-hidden="true"
                />
              )}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {game.players.length} players. Started on{" "}
                {new Date(game.startedAt).toDateString()}
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
      ))}
    </div>
  );
}

export default ListEverdellGames;
