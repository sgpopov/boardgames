"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AwardIcon, CircleAlertIcon } from "lucide-react";
import { Phase10Game } from "@games/phase10";
import { usePhase10Repo } from "@/games/phase10/ui/hooks/usePhase10Repo";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from "@/components/ui/item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Phase10GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const repo = usePhase10Repo();
  const gameId = params?.gameId as string;
  const [game, setGame] = useState<Phase10Game | null>(null);

  useEffect(() => {
    const fetchGame = async (id: string) => {
      const game = await repo.getById(id);

      if (!game) {
        throw Error("Could not find game");
      }

      setGame(game);
    };

    fetchGame(gameId);
  }, [repo, gameId]);

  const handleGameDeletion = useCallback(() => {
    repo.delete(gameId);

    router.replace("/games/phase10");
  }, [repo, gameId, router]);

  if (!game) {
    return (
      <div className="p-6 space-y-4">
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Game details</h2>

        <Link
          href={`/games/phase10/${game.id}/rounds/new`}
          className="text-sm underline self-center"
        >
          <Button variant="secondary" size="sm" aria-label="Score round">
            <AwardIcon />
            Score round
          </Button>
        </Link>
      </div>

      <div>
        <i>{game.rounds} rounds played </i>
      </div>

      <div className="flex w-full  flex-col gap-2">
        {game.players.map((p) => (
          <Item key={p.id} variant="outline" className="gap-1">
            <ItemMedia>
              <div className="w-8 h-8 inline-flex justify-center items-center mr-2 rounded-full bg-green-300 self-center text-center">
                {p.name[0]}
              </div>
            </ItemMedia>

            <ItemContent>
              <ItemTitle className="font-bold">{p.name}</ItemTitle>
              <ItemDescription>
                Phase {p.phase}
                <br />
                {repo.getPhaseDetails(p.phase)}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="font-bold">{p.score}</ItemActions>
          </Item>
        ))}
      </div>

      <div className="flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" aria-label="Delete">
              <CircleAlertIcon /> Delete game
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                game and its details
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => handleGameDeletion()}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
