"use client";

import { CheckIcon, PlusIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getFieldErrorMessage } from "@/core/ui/errors/getFieldErrorMessage";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import { PLAYER_COLORS, PlayerColor } from "@/games/ark-nova/domain/constants";
import { accentForColor } from "@/games/ark-nova/ui/presenters/playerAccents";
import { useCreateGame } from "@/games/ark-nova/ui/hooks/useCreateGame";

interface Props {
  onGameCreated?: (game: ArkNovaGame) => void;
}

export function CreateNewGameForm({ onGameCreated }: Props) {
  const defaultHandler = () => {};

  const { form, players, addPlayer, maxPlayers } = useCreateGame({
    onGameCreated: onGameCreated ?? defaultHandler,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            await form.handleSubmit();
          }}
        >
          <div className="space-y-6 pb-6">
            {players.map((_, i) => (
              <div key={i} className="space-y-3">
                <form.Field name={`players[${i}].name`}>
                  {(field) => {
                    return (
                      <Field>
                        <FieldLabel htmlFor={`player-${i}`}>
                          Player {i + 1}
                        </FieldLabel>
                        <Input
                          id={`player-${i}`}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Name"
                          aria-invalid={!field.state.meta.isValid}
                        />
                        {!field.state.meta.isValid && (
                          <FieldError>
                            {getFieldErrorMessage(field.state.meta.errors)}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name={`players[${i}].color`}>
                  {(field) => {
                    const selected = field.state.value as PlayerColor | "";
                    const takenByOthers = new Set(
                      players
                        .filter((_, otherIndex) => otherIndex !== i)
                        .map((p) => p.color)
                        .filter((color): color is PlayerColor => color !== ""),
                    );

                    return (
                      <Field>
                        <FieldLabel>Color</FieldLabel>
                        <div
                          role="group"
                          aria-label={`Player ${i + 1} color`}
                          className="flex flex-wrap gap-2"
                        >
                          {PLAYER_COLORS.map((color) => {
                            const accent = accentForColor(color);
                            const isSelected = selected === color;
                            const isDisabled =
                              !isSelected && takenByOthers.has(color);

                            return (
                              <button
                                key={color}
                                type="button"
                                aria-pressed={isSelected}
                                disabled={isDisabled}
                                onClick={() => field.handleChange(color)}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                                  isSelected
                                    ? cn(
                                        accent.avatar,
                                        accent.avatarText,
                                        "border-transparent",
                                      )
                                    : "bg-background text-foreground hover:bg-muted/50",
                                  isDisabled && "opacity-40 cursor-not-allowed",
                                )}
                              >
                                {isSelected ? (
                                  <CheckIcon
                                    className="size-3.5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <span
                                    className={cn(
                                      "size-3 rounded-full",
                                      accent.swatch,
                                    )}
                                    aria-hidden="true"
                                  />
                                )}
                                {accent.label}
                              </button>
                            );
                          })}
                        </div>
                        {!field.state.meta.isValid && (
                          <FieldError>
                            {getFieldErrorMessage(field.state.meta.errors)}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();

              addPlayer();
            }}
            disabled={players.length >= maxPlayers}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            Add player
          </button>

          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isPristine,
              state.isSubmitting,
            ]}
          >
            {([canSubmit, isPristine, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isPristine || isSubmitting}
                className="mt-6 w-full bg-emerald-700 text-white hover:bg-emerald-800"
                size="lg"
              >
                <UsersIcon className="size-4" aria-hidden="true" />
                {isSubmitting ? "Saving..." : "Create game"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateNewGameForm;
