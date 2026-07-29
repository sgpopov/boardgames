import { z } from "zod";
import { getDuplicateNameGroups } from "@core/domain/validation/uniqueNames";
import { CHARACTERS, MAX_PLAYERS_ALLOWED } from "../constants";
import { getDuplicateCharacterGroups } from "./uniqueCharacters";

export const PlayersSchema = z.object({
  players: z
    .array(
      z.object({
        name: z.string().min(1, "Required"),
        character: z.enum(CHARACTERS, { message: "Required" }),
      }),
    )
    .min(1, "At least one player")
    .max(MAX_PLAYERS_ALLOWED, `Max ${MAX_PLAYERS_ALLOWED} players`)
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

      for (const indices of getDuplicateCharacterGroups(players)) {
        for (const idx of indices) {
          ctx.addIssue({
            code: "custom",
            path: [idx, "character"],
            message: "Each character can be used only once.",
          });
        }
      }
    }),
});

export type NewPlayersInput = z.infer<typeof PlayersSchema>;

export function validatePlayers(input: unknown) {
  return PlayersSchema.safeParse(input);
}
