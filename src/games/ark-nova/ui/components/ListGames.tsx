"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheckIcon,
  ChevronRightIcon,
  Clock3Icon,
  DicesIcon,
  MoreVerticalIcon,
} from "lucide-react";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ListEmptyState } from "@/components/composite/ListEmptyState";
import { routes } from "@/app/routes";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useGameList } from "@/games/ark-nova/ui/hooks/useGameList";

export function ListArkNovaGames() {
  const { games, gamesLoaded, deleteGame } = useGameList();
  const [pendingDelete, setPendingDelete] = useState<ArkNovaGame | null>(null);

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
        link={{ label: "Create new game", href: routes.arkNova.newGame() }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Games ({games.length})</h1>

      {games.map((game: ArkNovaGame) => {
        const isCompleted = !!game.completedAt;
        const status = isCompleted ? "Completed" : "In progress";

        return (
          <Item key={game.id} variant="outline" size="sm">
            <ItemMedia>
              {isCompleted ? (
                <BadgeCheckIcon
                  color="green"
                  className="size-5"
                  aria-hidden="true"
                />
              ) : (
                <Clock3Icon
                  color="orange"
                  className="size-5"
                  aria-hidden="true"
                />
              )}
            </ItemMedia>
            <ItemContent>
              <Link
                href={routes.arkNova.gameDetails(game.id)}
                className="no-underline"
              >
                <ItemTitle>
                  {game.players.length} players. Started on{" "}
                  {new Date(game.startedAt).toDateString()}
                </ItemTitle>
                <span className="text-sm text-muted-foreground">
                  <span className="sr-only">Status: </span>
                  {status}
                </span>
              </Link>
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for game started on ${new Date(
                      game.startedAt,
                    ).toDateString()}`}
                  >
                    <MoreVerticalIcon className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setPendingDelete(game)}
                  >
                    Delete game
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href={routes.arkNova.gameDetails(game.id)}
                aria-label="Open game"
                className="no-underline"
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </ItemActions>
          </Item>
        );
      })}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the game and its scores. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingDelete) {
                  await deleteGame(pendingDelete.id);
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ListArkNovaGames;
