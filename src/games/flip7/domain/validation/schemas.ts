import { z } from "zod";

export const Flip7PlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  total: z.number().int().min(0),
});

export const Flip7PlayerScoreSchema = z.object({
  playerId: z.string().min(1),
  score: z.number().int().min(0),
});

export const Flip7RoundSchema = z.object({
  index: z.number().int().min(1),
  scores: z.array(Flip7PlayerScoreSchema),
  savedAt: z.string().min(1), // ISO
});

export const Flip7GameSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1), // ISO
  completedAt: z.string().min(1).nullable(),
  players: z.array(Flip7PlayerSchema),
  rounds: z.array(Flip7RoundSchema),
  winnerId: z.string().min(1).nullable(),
});

export type Flip7Player = z.infer<typeof Flip7PlayerSchema>;
export type Flip7PlayerScore = z.infer<typeof Flip7PlayerScoreSchema>;
export type Flip7Round = z.infer<typeof Flip7RoundSchema>;
export type Flip7Game = z.infer<typeof Flip7GameSchema>;
