"use client";

import Link from "next/link";
import { routes } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getFieldErrorMessage } from "@/core/ui/errors/getFieldErrorMessage";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useAddScores } from "@/games/ark-nova/ui/hooks/useAddScores";
import { computeScorePreview } from "@/games/ark-nova/ui/presenters/scorePreview";
import {
  validateAppealField,
  validateConservationPointsField,
} from "@/games/ark-nova/ui/presenters/fieldValidation";

interface Props {
  gameId: string;
  onScoresSaved?: (game: ArkNovaGame) => void;
}

function formatVp(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function AddScoresForm({ gameId, onScoresSaved }: Props) {
  const { form, game, loading, players } = useAddScores({
    gameId,
    onScoresSaved,
  });

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (!game) {
    return <div className="p-5">Game not found</div>;
  }

  if (game.completedAt) {
    return (
      <div className="space-y-4 p-5">
        <Alert variant="destructive">
          <AlertDescription>
            This game is already completed. Scores can no longer be edited.
          </AlertDescription>
        </Alert>
        <Link
          href={routes.arkNova.gameDetails(gameId)}
          className="underline text-sm"
        >
          Go back
        </Link>
      </div>
    );
  }

  const liveSummary = players
    .map((row) => {
      const preview = computeScorePreview(row.appeal, row.conservationPoints);

      if (!preview) {
        return `${row.name}: totals pending`;
      }

      return `${row.name}: Official ${preview.officialVp}, Alternative ${preview.alternativeVp}`;
    })
    .join(". ");

  return (
    <Card className="rounded-none border-0">
      <CardHeader className="flex items-center justify-between border-b">
        <CardTitle>
          <h1>Final scoring</h1>
        </CardTitle>
        <CardAction>
          <Link
            href={routes.arkNova.gameDetails(gameId)}
            className="text-sm underline"
          >
            Go back
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter each player&apos;s appeal (0–113) and conservation points
          (0–41). Victory points for both scoring methods update as you type.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
        >
          <div className="space-y-6 pb-10">
            {players.map((row, i) => {
              const preview = computeScorePreview(
                row.appeal,
                row.conservationPoints,
              );

              return (
                <fieldset
                  key={row.playerId}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <legend className="px-1 font-medium">{row.name}</legend>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field
                      name={`players[${i}].appeal`}
                      validators={{
                        onChange: ({ value }) =>
                          validateAppealField(value as string),
                        onSubmit: ({ value }) =>
                          validateAppealField(value as string),
                      }}
                    >
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={`player-${i}-appeal`}>
                            Appeal
                          </FieldLabel>
                          <Input
                            id={`player-${i}-appeal`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={!field.state.meta.isValid}
                            placeholder="0"
                          />
                          {!field.state.meta.isValid && (
                            <FieldError>
                              {getFieldErrorMessage(field.state.meta.errors)}
                            </FieldError>
                          )}
                        </Field>
                      )}
                    </form.Field>

                    <form.Field
                      name={`players[${i}].conservationPoints`}
                      validators={{
                        onChange: ({ value }) =>
                          validateConservationPointsField(value as string),
                        onSubmit: ({ value }) =>
                          validateConservationPointsField(value as string),
                      }}
                    >
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={`player-${i}-cp`}>
                            Conservation points
                          </FieldLabel>
                          <Input
                            id={`player-${i}-cp`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={!field.state.meta.isValid}
                            placeholder="0"
                          />
                          {!field.state.meta.isValid && (
                            <FieldError>
                              {getFieldErrorMessage(field.state.meta.errors)}
                            </FieldError>
                          )}
                        </Field>
                      )}
                    </form.Field>
                  </div>

                  <dl className="flex gap-6 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Official VP</dt>
                      <dd className="text-lg font-semibold tabular-nums">
                        {preview ? formatVp(preview.officialVp) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Alternative VP</dt>
                      <dd className="text-lg font-semibold tabular-nums">
                        {preview ? formatVp(preview.alternativeVp) : "—"}
                      </dd>
                    </div>
                  </dl>
                </fieldset>
              );
            })}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {liveSummary}
          </p>

          <div className="flex justify-center">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save scores"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AddScoresForm;
