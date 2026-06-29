"use client";

import { BadgeCheckIcon, Clock3Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useGameDetails } from "@/games/ark-nova/ui/hooks/useGameDetails";

type GameDetailsProps = {
  gameId: string;
};

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching } = useGameDetails(props.gameId);

  if (isFetching) {
    return <div className="p-5">Loading...</div>;
  }

  if (!game) {
    return <div className="p-5">Game not found</div>;
  }

  const isCompleted = !!game.completedAt;
  const status = isCompleted ? "Completed" : "In progress";

  return (
    <div className="lg:mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <Alert variant={isCompleted ? "success" : "default"} aria-live="polite">
        {isCompleted ? (
          <BadgeCheckIcon aria-hidden="true" />
        ) : (
          <Clock3Icon aria-hidden="true" />
        )}
        <AlertDescription>
          <span className="sr-only">Status: </span>
          {status}
        </AlertDescription>
      </Alert>

      <section aria-labelledby="players-heading" className="space-y-3">
        <h1 id="players-heading" className="text-xl font-semibold">
          Players ({game.players.length})
        </h1>

        {game.players.map((player) => (
          <Item key={player.id} variant="outline" size="sm">
            <ItemMedia>
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
              >
                {player.name[0]?.toUpperCase()}
              </span>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{player.name}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </section>
    </div>
  );
}

export default GameDetails;
