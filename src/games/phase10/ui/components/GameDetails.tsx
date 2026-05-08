import { useCallback, useMemo } from "react";
import Link from "next/link";
import { AwardIcon, CheckCircle2Icon, CircleAlertIcon, TrophyIcon } from "lucide-react";
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
import { getWinners, sortPlayersForCompletedGame } from "@/games/phase10/application/getWinners";
import { WINNER_PHASE } from "@/games/phase10/domain/constants";

type GameDetailsProps = {
  gameId: string;
  onGameDeletion: () => void;
};

export function GameDetails(props: GameDetailsProps) {
  const { game, isFetching, removeGame, getPhaseDetails } = useGameDetails(
    props.gameId,
  );

  const handleGameDeletion = useCallback(
    async (gameId: string) => {
      await removeGame(gameId);

      if (props.onGameDeletion) {
        props.onGameDeletion();
      }
    },
    [removeGame, props],
  );

  const winners = useMemo(
    () => (game ? getWinners(game.players) : []),
    [game],
  );

  const orderedPlayers = useMemo(() => {
    if (!game) return [];
    if (!game.completedAt) return game.players;
    return sortPlayersForCompletedGame(game.players, winners);
  }, [game, winners]);

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

  const isCompleted = Boolean(game.completedAt);
  const winnerIds = new Set(winners.map((w) => w.id));

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Game details</h1>

        {!isCompleted && (
          <Link
            href={routes.phase10.scoreRound(game.id)}
            className="text-sm underline self-center"
          >
            <Button variant="secondary" size="sm" aria-label="Score round">
              <AwardIcon />
              Score round
            </Button>
          </Link>
        )}
      </div>

      {isCompleted && (
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <CheckCircle2Icon className="h-4 w-4" aria-hidden />
          <span>Game completed</span>
        </div>
      )}

      <div>
        <i>{game.rounds} rounds played</i>
      </div>

      <div className="flex w-full flex-col gap-2">
        {orderedPlayers.map((p) => {
          const isWinner = winnerIds.has(p.id);
          const isCompletedNonWinner =
            p.phase === WINNER_PHASE && !isWinner;

          return (
            <Item
              key={p.id}
              variant="outline"
              className={`gap-1${isWinner ? " bg-yellow-50 border-yellow-300" : ""}`}
            >
              <ItemMedia>
                <div className="w-8 h-8 inline-flex justify-center items-center mr-2 rounded-full bg-green-300 self-center text-center">
                  {p.name[0]}
                </div>
              </ItemMedia>

              <ItemContent>
                <ItemTitle className="font-bold">{p.name}</ItemTitle>
                <ItemDescription>
                  {isWinner ? (
                    <span className="flex items-center gap-1 text-yellow-700">
                      <TrophyIcon className="h-3 w-3" aria-hidden />
                      <span>Winner</span>
                    </span>
                  ) : isCompletedNonWinner ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2Icon className="h-3 w-3" aria-hidden />
                      <span>Completed phase 10</span>
                    </span>
                  ) : (
                    <>
                      Phase {p.phase}
                      <br />
                      {getPhaseDetails(p.phase)}
                    </>
                  )}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="font-bold">{p.score}</ItemActions>
            </Item>
          );
        })}
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
                onClick={async () => {
                  await handleGameDeletion(game.id);
                }}
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
