"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CheckCircle2Icon, MinusCircleIcon, PlusCircleIcon, TrophyIcon } from "lucide-react";
import { useRoundForm } from "@/games/phase10/ui/hooks/useRoundForm";
import { routes } from "@/app/routes";
import { PHASE_MIN, WINNER_PHASE } from "@/games/phase10/domain/constants";

interface ScoreRoundFormProps {
  gameId: string;
  onDone?: () => void;
  onCancel?: () => void;
}

export function ScoreRoundForm({
  gameId,
  onDone,
  onCancel,
}: ScoreRoundFormProps) {
  const {
    form,
    game,
    loading,
    error,
    playersValues,
    handlePhaseChange,
    maxPhaseForPlayer,
  } = useRoundForm(gameId);

  if (loading) {
    return <p>Loading game...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-600">{error}</p>

        <Link href={routes.phase10.gameDetails(gameId)} className="underline">
          Back
        </Link>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  // Show completed-state guidance instead of the form (#22)
  if (game.completedAt) {
    return (
      <div className="space-y-4 text-center py-6">
        <CheckCircle2Icon
          className="mx-auto h-10 w-10 text-green-600"
          aria-hidden
        />
        <p className="font-semibold text-lg">This game has been completed.</p>
        <p className="text-muted-foreground text-sm">
          No further scoring is allowed once a game is completed.
        </p>
        <Link
          href={routes.phase10.gameDetails(gameId)}
          className="underline text-sm"
        >
          View game details
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex py-2">
          <div className="w-6/12">Player</div>
          <div className="w-4/12 text-center">Phase</div>
          <div className="w-2/12 text-center">Score</div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            await form.handleSubmit();

            if (onDone) {
              onDone();
            }
          }}
        >
          {playersValues.map((player, i) => {
            const currentPhase = form.getFieldValue(
              `players[${i}].phase`,
            ) as number;
            const isWinnerState = currentPhase === WINNER_PHASE;
            const maxPhase = maxPhaseForPlayer(i);

            return (
              <div key={player.id}>
                <div className="flex py-2 items-center gap-x-2">
                  <div className="w-6/12 flex items-center">
                    <span className="pl-2 text-sm font-bold">
                      {game.players[i].name}
                    </span>
                  </div>
                  <div className="w-4/12 text-center">
                    <div className="px-2 flex justify-center items-center gap-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePhaseChange(i, -1);
                        }}
                        disabled={currentPhase <= PHASE_MIN}
                        aria-label="Decrease phase"
                        data-testid={`player-${i}-decrease-phase`}
                      >
                        <MinusCircleIcon />
                      </Button>
                      <span
                        className="font-bold flex items-center gap-1"
                        data-testid={`player-${i}-phase`}
                      >
                        {isWinnerState ? (
                          <>
                            <TrophyIcon
                              className="h-4 w-4 text-yellow-500"
                              aria-hidden
                            />
                            <span>Winner</span>
                          </>
                        ) : (
                          currentPhase
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePhaseChange(i, 1);
                        }}
                        disabled={currentPhase >= maxPhase}
                        aria-label="Increase phase"
                        data-testid={`player-${i}-increase-phase`}
                      >
                        <PlusCircleIcon />
                      </Button>
                    </div>
                  </div>
                  <div className="w-2/12 text-right">
                    <form.Field name={`players[${i}].score`}>
                      {(field) => (
                        <Field>
                          <Input
                            id={`score-${player.id}`}
                            data-testid={`player-${i}-score`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onChange={(e) =>
                              !isNaN(Number(e.target.value))
                                ? field.handleChange(Number(e.target.value))
                                : field.handleChange("" as unknown as number)
                            }
                            onBlur={field.handleBlur}
                            aria-invalid={!field.state.meta.isValid}
                            placeholder="0"
                          />
                        </Field>
                      )}
                    </form.Field>
                  </div>
                </div>
                {!form.getFieldMeta(`players[${i}].score`)?.isValid && (
                  <FieldError className="w-full text-right">
                    {form
                      .getFieldMeta(`players[${i}].score`)
                      ?.errors.map((e) => e?.message)
                      .join(", ")}
                  </FieldError>
                )}
              </div>
            );
          })}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="secondary"
              asChild
              onClick={(e) => {
                e.preventDefault();

                if (onCancel) onCancel();
              }}
            >
              <Link href={routes.phase10.gameDetails(gameId)}>Cancel</Link>
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Round"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ScoreRoundForm;
