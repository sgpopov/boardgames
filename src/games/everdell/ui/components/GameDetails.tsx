"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { CheckCircle2Icon, MoreVerticalIcon, TrophyIcon } from "lucide-react";
import { routes } from "@/app/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { buildScoreRows } from "@/games/everdell/ui/presenters/buildScoreRows";
import { useGameDetails } from "@/games/everdell/ui/hooks/useGameDetails";
import { useCompleteGame } from "@/games/everdell/ui/hooks/useCompleteGame";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";

type GameDetailsProps = {
  gameId: string;
};

function getWinners(game: EverdellGame) {
  const maxTotal = Math.max(...game.players.map((p) => p.total));
  return game.players.filter((p) => p.total === maxTotal);
}

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching, modules, setGame } = useGameDetails(props.gameId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { complete, isCompleting } = useCompleteGame({
    gameId: props.gameId,
    onCompleted: setGame,
  });

  const scoreRows = useMemo(() => {
    if (!game) {
      return [];
    }

    return buildScoreRows(modules, game);
  }, [game, modules]);

  if (isFetching) {
    return <div className="p-5">Loading...</div>;
  }

  if (!game) {
    return <div className="p-5">Game not found</div>;
  }

  const winners = game.completedAt ? getWinners(game) : [];
  const winnerNames = winners.map((w) => w.name).join(" & ");
  const winnerIds = new Set(winners.map((w) => w.id));

  return (
    <div className="lg:mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {game.completedAt && (
        <Alert variant="success" className="mt-4">
          <CheckCircle2Icon aria-hidden="true" />
          <AlertDescription>
            This game has been completed
            {winnerNames ? ` - ${winnerNames} wins!` : ""}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8 flow-root">
        <div className="flex items-start justify-between">
          <div className="sm:flex-auto">
            <h1 className="font-semibold text-gray-900">Score</h1>

            {!game.completedAt && (
              <p className="mt-2 text-sm text-gray-700">
                Click on the category to enter the scoring points for each
                player
              </p>
            )}
          </div>

          {!game.completedAt && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Game actions">
                  <MoreVerticalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
                  Complete game
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="-mx-4 mt-5 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Player
                  </TableHead>
                  {game.players.map((player) => (
                    <TableHead
                      key={player.id}
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      <span className="flex flex-col items-center gap-1">
                        {player.name[0]}
                        {game.completedAt && winnerIds.has(player.id) && (
                          <>
                            <TrophyIcon
                              className="h-4 w-4 text-yellow-700"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Winner</span>
                          </>
                        )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {scoreRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="py-4 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      {game.completedAt ? (
                        <span className="flex items-center gap-x-2">
                          {row.icon && (
                            <Image
                              className="h-6 w-6"
                              src={row.icon as ImageProps["src"]}
                              alt={row.key}
                            />
                          )}
                          {row.title}
                        </span>
                      ) : (
                        <Link
                          href={routes.everdell.score(props.gameId, row.key)}
                          className="flex items-center gap-x-2"
                          aria-label={`Edit score for ${row.title}`}
                        >
                          {row.icon && (
                            <Image
                              className="h-6 w-6"
                              src={row.icon as ImageProps["src"]}
                              alt={row.key}
                            />
                          )}
                          {row.title}
                        </Link>
                      )}
                    </TableCell>
                    {row.scores.map((score) => (
                      <TableCell key={score.key} className="text-center">
                        {score.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="py-3.5 pr-3 pl-4 text-left text-sm font-medium text-gray-900 sm:pl-0">
                    <div className="flex items-center gap-x-2">
                      <TrophyIcon className="h-6 w-6" aria-hidden="true" />
                      Total
                    </div>
                  </TableCell>
                  {game.players.map((player) => (
                    <TableCell
                      key={player.id}
                      className="px-3 py-3.5 text-center text-sm font-medium text-gray-900"
                    >
                      {player.total}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the game as completed. You won&apos;t be able to
              add or edit scores afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                complete();
              }}
              disabled={isCompleting}
            >
              {isCompleting ? "Completing..." : "Complete game"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
