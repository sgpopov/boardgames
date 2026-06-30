import { z } from "zod";
import {
  MAX_APPEAL,
  MAX_CONSERVATION_POINTS,
  MIN_APPEAL,
  MIN_CONSERVATION_POINTS,
} from "../constants";

export const PlayerScoreSchema = z.object({
  playerId: z.string().min(1),
  appeal: z
    .number()
    .int("Appeal must be a whole number")
    .min(MIN_APPEAL, `Appeal must be between ${MIN_APPEAL} and ${MAX_APPEAL}`)
    .max(MAX_APPEAL, `Appeal must be between ${MIN_APPEAL} and ${MAX_APPEAL}`),
  conservationPoints: z
    .number()
    .int("Conservation points must be a whole number")
    .min(
      MIN_CONSERVATION_POINTS,
      `Conservation points must be between ${MIN_CONSERVATION_POINTS} and ${MAX_CONSERVATION_POINTS}`,
    )
    .max(
      MAX_CONSERVATION_POINTS,
      `Conservation points must be between ${MIN_CONSERVATION_POINTS} and ${MAX_CONSERVATION_POINTS}`,
    ),
});

export const AddScoresSchema = z.object({
  players: z.array(PlayerScoreSchema).nonempty("At least one player required"),
});

export type AddScoresInput = z.infer<typeof AddScoresSchema>;
export type PlayerScoreInput = z.infer<typeof PlayerScoreSchema>;

export function validateAddScores(input: unknown) {
  return AddScoresSchema.safeParse(input);
}
