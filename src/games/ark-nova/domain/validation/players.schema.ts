import { z } from "zod";
import { getDuplicateNameGroups } from "@core/domain/validation/uniqueNames";
import { MAX_PLAYERS_ALLOWED, PLAYER_COLORS } from "../constants";

export const PlayersSchema = z.object({
  players: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Required"),
        color: z.enum(PLAYER_COLORS, { message: "Required" }),
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

      const indicesByColor = new Map<string, number[]>();

      players.forEach((player, idx) => {
        const indices = indicesByColor.get(player.color) ?? [];

        indices.push(idx);
        indicesByColor.set(player.color, indices);
      });

      for (const indices of indicesByColor.values()) {
        if (indices.length <= 1) {
          continue;
        }

        for (const idx of indices) {
          ctx.addIssue({
            code: "custom",
            path: [idx, "color"],
            message: "Each color can be used only once.",
          });
        }
      }
    }),
});

export type NewPlayersInput = z.infer<typeof PlayersSchema>;

export function validatePlayers(input: unknown) {
  return PlayersSchema.safeParse(input);
}
