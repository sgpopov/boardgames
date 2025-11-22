"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNewGameForm } from "@/games/phase10/ui/hooks/useNewGameForm";
import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";

interface Props {
  onGameCreated?: (game: Phase10Game) => void;
}

export function NewPhase10GameForm({ onGameCreated }: Props) {
  const defaultHandler = () => {};

  const { form, players, addPlayer, maxPlayers } = useNewGameForm({
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

            console.log(111);
            await form.handleSubmit();
          }}
        >
          <div className="space-y-3 pb-10">
            {players.map((_, i) => (
              <form.Field key={i} name={`players[${i}].name`}>
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
                          {field.state.meta.errors.map((e) => e?.message)?.[0]}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
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
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
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

export default NewPhase10GameForm;
