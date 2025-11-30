import { z } from "zod";

export const AddPlayerScoreSchema = z.object({
  playerId: z.string(),
  name: z.string(),
  score: z.number().int(),
});

export const AddScoreSchema = z.object({
  players: z
    .array(AddPlayerScoreSchema)
    .nonempty("At least one player score required"),
});

export type AddRoundInput = z.infer<typeof AddScoreSchema>;

export function validateAddRound(input: unknown) {
  return AddScoreSchema.safeParse(input);
}
