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
import { EverdellGame, useGameList } from "@games/everdell";

export function ListEverdellGames() {
  const { games, gamesLoaded } = useGameList();

  if (!gamesLoaded) {
    return (
      <div className="space-y-4">
        <p>Loading games...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game: EverdellGame) => (
        <Item key={game.id} variant="outline" size="sm" asChild>
          <Link
            href={routes.everdell.gameDetails(game.id)}
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

      {games.length === 0 && (
        <ListEmptyState
          title="No games found"
          description="You haven't created any games yet. Get started by creating
              your first game."
          icon={<DicesIcon />}
        />
      )}
    </div>
  );
}

export default ListEverdellGames;
