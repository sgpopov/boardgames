import { useCallback } from "react";
import Link from "next/link";
import { AwardIcon, CircleAlertIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useGameDetails } from "../hooks/useGameDetails";
import { routes } from "@/app/routes";

type GameDetailsProps = {
  gameId: string;
  onGameDeletion: () => void;
};

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching, removeGame, getPhaseDetails } = useGameDetails(
    props.gameId
  );

  const handleGameDeletion = useCallback(
    (gameId: string) => {
      removeGame(gameId);

      if (props.onGameDeletion) {
        props.onGameDeletion();
      }
    },
    [removeGame, props]
  );

  if (isFetching) {
    return (
      <div className="p-6 space-y-4">
        <p>Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-6 space-y-4">
        <p>Game not found</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Game details</h2>

        <Link
          href={routes.phase10.scoreRound(game.id)}
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
                {getPhaseDetails(p.phase)}
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
                onClick={() => handleGameDeletion(game.id)}
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
