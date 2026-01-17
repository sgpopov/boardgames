import { z } from "zod";
import { getDuplicateNameGroups } from "@core/domain/validation/uniqueNames";

export const MIN_PLAYERS = 3;

export const MAX_PLAYERS = 18;

export const Flip7NewGameSchema = z.object({
  players: z
    .array(
      z.object({
        name: z.string().min(1, "Required"),
      })
    )
    .min(MIN_PLAYERS, `Min ${MIN_PLAYERS} players`)
    .max(MAX_PLAYERS, `Max ${MAX_PLAYERS} players`)
    .superRefine((players, ctx) => {
      const groups = getDuplicateNameGroups(players);

      for (const group of groups) {
        for (const idx of group.indices) {
          ctx.addIssue({
            code: "custom",
            path: [idx, "name"],
            message: `Duplicate player name '${players[idx].name}'.`,
          });
        }
      }
    }),
});

export type NewPlayersInput = z.infer<typeof Flip7NewGameSchema>;

export function validatePlayers(input: NewPlayersInput) {
  return Flip7NewGameSchema.safeParse(input);
}
