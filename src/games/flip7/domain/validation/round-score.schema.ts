import { z } from "zod";

export const AddRoundPlayerSchema = z.object({
  id: z.string(),
  score: z
    .number()
    .int()
    .min(0, "Invalid value")
});

export const AddRoundSchema = z.object({
  players: z
    .array(AddRoundPlayerSchema)
    .nonempty("At least one player score required"),
});

export type AddRoundInput = z.infer<typeof AddRoundSchema>;

export function validateAddRound(input: unknown) {
  return AddRoundSchema.safeParse(input);
}
