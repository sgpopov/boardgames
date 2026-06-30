"use client";

import Link from "next/link";
import { BadgeCheckIcon, Clock3Icon } from "lucide-react";
import { routes } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArkNovaPlayer } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useGameDetails } from "@/games/ark-nova/ui/hooks/useGameDetails";

type GameDetailsProps = {
  gameId: string;
};

function formatNumber(value: number | null): string {
  return value === null ? "—" : String(value);
}

function isScored(player: ArkNovaPlayer): boolean {
  return player.appeal !== null && player.conservationPoints !== null;
}

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
  const anyScored = game.players.some(isScored);

  return (
    <div className="lg:mt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <Alert variant={isCompleted ? "success" : "default"}>
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

      <section aria-labelledby="scores-heading" className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 id="scores-heading" className="text-xl font-semibold">
            Players ({game.players.length})
          </h1>

          {!isCompleted && (
            <Button asChild>
              <Link href={routes.arkNova.score(game.id)}>
                {anyScored ? "Edit scores" : "Enter scores"}
              </Link>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Appeal</TableHead>
                <TableHead className="text-right">Conservation</TableHead>
                <TableHead className="text-right">Official VP</TableHead>
                <TableHead className="text-right">Alternative VP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {game.players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(player.appeal)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(player.conservationPoints)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(player.officialVp)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(player.alternativeVp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

export default GameDetails;
