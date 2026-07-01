"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/app/routes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getFieldErrorMessage } from "@/core/ui/errors/getFieldErrorMessage";
import appealIcon from "@games/ark-nova/assets/appeal.png";
import conservationIcon from "@games/ark-nova/assets/conservation.png";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { useAddScores } from "@/games/ark-nova/ui/hooks/useAddScores";
import { computeScorePreview } from "@/games/ark-nova/ui/presenters/scorePreview";
import { accentForColor } from "@/games/ark-nova/ui/presenters/playerAccents";
import { animalIconFor } from "@/games/ark-nova/ui/presenters/animalIcons";
import {
  validateAppealField,
  validateConservationPointsField,
} from "@/games/ark-nova/ui/presenters/fieldValidation";

interface Props {
  gameId: string;
  onScoresSaved?: (game: ArkNovaGame) => void;
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
    <div className="p-5 space-y-6">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">Final scoring</h1>
          <Link
            href={routes.arkNova.gameDetails(gameId)}
            className="text-sm underline self-center"
          >
            Go back
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter each player&apos;s appeal (0–113) and conservation points
          (0–41). Victory points for both scoring methods update as you type.
        </p>
      </header>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
      >
        <div className="space-y-4 pb-10">
          {players.map((row, i) => {
            const preview = computeScorePreview(
              row.appeal,
              row.conservationPoints,
            );
            const accent = accentForColor(row.color);
            const Animal = animalIconFor(row.icon);

            return (
              <Card
                key={row.playerId}
                className={cn("border-l-4 gap-0 py-0", accent.border)}
              >
                <CardHeader className="flex items-center gap-3 border-b py-4 [.border-b]:pb-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                      accent.avatar,
                      accent.avatarText,
                    )}
                  >
                    {row.name[0]?.toUpperCase()}
                  </span>
                  <h2 className="text-lg font-semibold">{row.name}</h2>
                  <Animal
                    className="ml-auto size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CardHeader>

                <CardContent className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                          <InputGroup>
                            <InputGroupInput
                              id={`player-${i}-appeal`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              aria-label="Appeal"
                              className="text-lg font-medium"
                              value={field.state.value as string}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              aria-invalid={!field.state.meta.isValid}
                              placeholder="0"
                            />
                            <InputGroupAddon align="inline-end">
                              <Image
                                src={appealIcon}
                                alt=""
                                aria-hidden="true"
                                className="h-6 w-auto"
                              />
                            </InputGroupAddon>
                          </InputGroup>
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
                          <InputGroup>
                            <InputGroupInput
                              id={`player-${i}-cp`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              aria-label="Conservation points"
                              className="text-lg font-medium"
                              value={field.state.value as string}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              aria-invalid={!field.state.meta.isValid}
                              placeholder="0"
                            />
                            <InputGroupAddon align="inline-end">
                              <Image
                                src={conservationIcon}
                                alt=""
                                aria-hidden="true"
                                className="h-6 w-auto"
                              />
                            </InputGroupAddon>
                          </InputGroup>
                          {!field.state.meta.isValid && (
                            <FieldError>
                              {getFieldErrorMessage(field.state.meta.errors)}
                            </FieldError>
                          )}
                        </Field>
                      )}
                    </form.Field>
                  </div>

                  <dl className="grid grid-cols-2 divide-x border-t pt-4">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <dt className="text-sm text-muted-foreground">
                        Official VP
                      </dt>
                      <dd className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-3xl font-bold tabular-nums",
                            accent.vp,
                          )}
                        >
                          {preview ? preview.officialVp : "—"}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-xs font-semibold",
                            accent.chip,
                          )}
                        >
                          VP
                        </span>
                      </dd>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <dt className="text-sm text-muted-foreground">
                        Alternative VP
                      </dt>
                      <dd className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-3xl font-bold tabular-nums",
                            accent.vp,
                          )}
                        >
                          {preview ? preview.alternativeVp : "—"}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-xs font-semibold",
                            accent.chip,
                          )}
                        >
                          VP
                        </span>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
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
    </div>
  );
}

export default AddScoresForm;
