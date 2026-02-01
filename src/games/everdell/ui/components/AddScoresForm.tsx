"use client";

import Image from "next/image";
import Link from "next/link";
import { routes } from "@/app/routes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EverdellGame, useAddScore } from "@games/everdell";

interface Props {
  gameId: string;
  gameModule: string;
  moduleComponent: string;
  onScoreAdded?: (game: EverdellGame) => void;
}

export function AddScoresForm({
  gameId,
  gameModule,
  moduleComponent,
  onScoreAdded,
}: Props) {
  const { form, players, selectedModuleComponent } = useAddScore({
    gameId,
    gameModule,
    moduleComponent,
    onScoreAdded,
  });

  if (!selectedModuleComponent) {
    return <div className="p-5">Unable to find game component</div>;
  }

  return (
    <div>
      <Card className="rounded-none border-0">
        <CardHeader className="flex items-center justify-between border-b ">
          <CardTitle className="flex items-center gap-x-2">
            {selectedModuleComponent.icon && (
              <Image
                src={selectedModuleComponent.icon}
                className="w-5 h-5"
                alt={selectedModuleComponent.title}
              />
            )}
            <span>{selectedModuleComponent.title}</span>
          </CardTitle>
          <CardAction>
            <Link href={routes.everdell.gameDetails(gameId)}>Go back</Link>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
            }}
          >
            <div className="space-y-4 pb-10">
              {players.map((player, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-4">
                    <span className="min-w-[120px] font-medium">
                      {player.name}
                    </span>
                    <form.Field name={`players[${i}].score`}>
                      {(field) => (
                        <Field>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id={`player-${i}-score`}
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={!field.state.meta.isValid}
                            placeholder="0"
                          />
                          {!field.state.meta.isValid && (
                            <FieldError>
                              {String(field.state.meta.errors?.[0] ?? "")}
                            </FieldError>
                          )}
                        </Field>
                      )}
                    </form.Field>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="bg-orange-900"
                  >
                    {isSubmitting ? "Saving..." : "Save scores"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddScoresForm;
