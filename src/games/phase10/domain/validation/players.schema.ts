import { z } from "zod";
import { getDuplicateNameGroups } from "@core/domain/validation/uniqueNames";

export const MAX_PLAYERS = 6;

export const PlayersSchema = z.object({
  players: z
    .array(
      z.object({
        name: z.string().min(1, "Required"),
      })
    )
    .min(1, "At least one player")
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

export type NewPlayersInput = z.infer<typeof PlayersSchema>;

export function validatePlayers(input: NewPlayersInput) {
  return PlayersSchema.safeParse(input);
}
