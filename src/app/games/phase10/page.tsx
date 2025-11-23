"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheckIcon,
  ChevronRightIcon,
  Clock3Icon,
  DicesIcon,
} from "lucide-react";
import { Phase10Game } from "@games/phase10";
import { usePhase10Repo } from "@games/phase10/ui/hooks/usePhase10Repo";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { routes } from "@/app/routes";

export default function Phase10Page() {
  const [games, setGames] = useState<Phase10Game[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState<boolean>(false);
  const repo = usePhase10Repo();

  useEffect(() => {
    repo.list().then((games) => {
      setGames(games);
      setGamesLoaded(true);
    });
  }, [repo]);

  if (!gamesLoaded) {
    return (
      <div className="p-5 space-y-4">
        <p>Loading games...</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      {games.length > 0 && (
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Games ({games.length})</h2>
          <Link
            href="/games/phase10/new"
            className="text-sm underline self-center"
          >
            Create new game
          </Link>
        </div>
      )}

      {games.map((game: Phase10Game) => (
        <Item key={game.id} variant="outline" size="sm" asChild>
          <Link href={routes.phase10.gameDetails(game.id)} className="no-underline">
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
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DicesIcon />
            </EmptyMedia>
            <EmptyTitle>No games found</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any games yet. Get started by creating
              your first game.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={routes.phase10.newGame()}
              className="text-sm underline self-center"
            >
              <Button>Create new game</Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
