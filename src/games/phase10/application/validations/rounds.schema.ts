import { z } from "zod";
import { PHASE_MIN, PHASE_MAX, SCORE_MIN, SCORE_STEP } from "../constants";

export const AddRoundPlayerSchema = z.object({
  id: z.string(),
  phase: z
    .number()
    .int()
    .min(PHASE_MIN, `Phase must be >= ${PHASE_MIN}`)
    .max(PHASE_MAX, `Phase must be <= ${PHASE_MAX}`),
  score: z
    .number()
    .int()
    .min(SCORE_MIN, "Invalid value")
    .refine(
      (v) => v % SCORE_STEP === 0,
      `Score must be divisible by ${SCORE_STEP}`
    ),
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
