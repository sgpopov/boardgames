"use client";

import { DicesIcon } from "lucide-react";
import { routes } from "@/app/routes";
import { ListEmptyState } from "@/components/composite/ListEmptyState";
import { useGetGames } from "../hooks/useGetGames";

export function GamesList() {
  const { games, gamesLoaded } = useGetGames();

  if (!gamesLoaded) {
    <div className="space-y-4">
      <p>Loading games...</p>
    </div>;
  }

  if (!games.length) {
    return (
      <ListEmptyState
        title="No games found"
        description="You haven't created any games yet. Get started by creating
              your first game."
        icon={<DicesIcon />}
        link={{
          href: routes.flip7.newGame(),
          label: "Create new game",
        }}
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {games.map((g) => (
        <li
          key={g.id}
          className="border rounded p-3"
          aria-label={`Game ${g.id}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                Created: {new Date(g.createdAt).toLocaleString()}
              </div>
              <div className="text-sm text-zinc-600">
                Players: {g.playerCount} &bull; Rounds: {g.roundsCount}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
