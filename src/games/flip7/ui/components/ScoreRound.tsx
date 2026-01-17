"use client";

import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { routes } from "@/app/routes";
import { useRoundForm } from "../hooks/useRoundForm";
import { AlertCircleIcon } from "lucide-react";

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
  const { form, game, loading, error, playersValues } = useRoundForm(gameId);

  if (loading) {
    return <p>Loading game...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-600">{error}</p>

        <Link href={routes.flip7.gameDetails(gameId)} className="underline">
          Back
        </Link>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  if (game.completedAt) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            This game is already completed and you cannot add round scores
          </AlertDescription>
        </Alert>

        <Link href={routes.flip7.gameDetails(gameId)} className="underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription className="italic">
          Round {game.rounds.length + 1} results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex py-2 font-bold">
          <div className="w-8/12">Player</div>
          <div className="w-4/12">Score</div>
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
          {playersValues.map((player, i) => (
            <div key={player.id}>
              <div className="flex py-2 items-center gap-x-2">
                <div className="w-8/12 flex items-center">
                  {game.players[i].name}
                </div>
                <div className="w-4/12 text-right">
                  <form.Field name={`players[${i}].score`}>
                    {(field) => (
                      <Field>
                        <Input
                          id={`score-${player.id}`}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          onBlur={field.handleBlur}
                          aria-invalid={!field.state.meta.isValid}
                          placeholder="0"
                          data-testid={`player-${i}-score`}
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
          ))}
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
