"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getFieldErrorMessage } from "@/core/ui/errors/getFieldErrorMessage";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import { CHARACTERS, Character } from "@/games/everdell/domain/constants";
import { artForCharacter } from "@/games/everdell/ui/presenters/characterArt";
import { useCreateGame } from "@/games/everdell/ui/hooks/useCreateGame";

interface Props {
  onGameCreated?: (game: EverdellGame) => void;
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
          <div className="space-y-6 pb-10">
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

                <form.Field name={`players[${i}].character`}>
                  {(field) => {
                    const selected = field.state.value as Character;
                    const takenByOthers = new Set(
                      players
                        .filter((_, otherIndex) => otherIndex !== i)
                        .map((player) => player.character),
                    );

                    return (
                      <Field>
                        <FieldLabel>Character</FieldLabel>
                        <div
                          role="group"
                          aria-label={`Player ${i + 1} character`}
                          className="grid max-w-md grid-cols-4 gap-2"
                        >
                          {CHARACTERS.map((character) => {
                            const { label, art } = artForCharacter(character);
                            const isSelected = selected === character;
                            const isDisabled =
                              !isSelected && takenByOthers.has(character);

                            return (
                              <button
                                key={character}
                                type="button"
                                aria-pressed={isSelected}
                                disabled={isDisabled}
                                onClick={() => field.handleChange(character)}
                                className={cn(
                                  "flex flex-col items-center gap-1 rounded-xl border px-1 pt-2 pb-1.5 text-xs font-medium transition-colors sm:px-2",
                                  isSelected
                                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                                    : "bg-background text-foreground hover:bg-muted/50",
                                  isDisabled && "opacity-40 cursor-not-allowed",
                                )}
                              >
                                {/* The portraits differ in aspect ratio, so the
                                    box is fixed and the art is contained inside
                                    it, bottom-aligned to stand on a shared line. */}
                                <Image
                                  className="h-16 w-full object-contain object-bottom sm:h-20"
                                  src={art}
                                  alt=""
                                  aria-hidden="true"
                                />
                                {label}
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

          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();

                addPlayer();
              }}
              disabled={players.length >= maxPlayers}
            >
              Add Player
            </Button>

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
                >
                  {isSubmitting ? "Saving..." : "Create game"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateNewGameForm;
