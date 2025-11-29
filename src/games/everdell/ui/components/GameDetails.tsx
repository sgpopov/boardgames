"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrophyIcon } from "lucide-react";
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
import { buildScoreRows, useGameDetails } from "@games/everdell";

type GameDetailsProps = {
  gameId: string;
};

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching, modules } = useGameDetails(props.gameId);

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

  return (
    <div className="lg:mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="sm:flex-auto">
          <h1 className="font-semibold text-gray-900">Score</h1>

          <p className="mt-2 text-sm text-gray-700">
            Click on the category to enter the scoring points for each player
          </p>
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
                      {player.name[0]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {scoreRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="py-4 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      <Link
                        href={routes.everdell.score(props.gameId, row.key)}
                        className="flex items-center gap-x-2"
                        aria-label={`Edit score for ${row.title}`}
                      >
                        {row.icon && (
                          <Image
                            className="h-6 w-6"
                            src={row.icon}
                            alt={row.key}
                          />
                        )}

                        {row.title}
                      </Link>
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
                      <TrophyIcon className="h-6 w-6" />
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
    </div>
  );
}
