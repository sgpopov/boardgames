import { z } from "zod";
import {
  PHASE_MAX,
  PHASE_MIN,
  SCORE_MIN,
} from "@/games/phase10/domain/constants";
import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";

const StoredRoundSchema = z.object({
  phase: z.number().int().min(PHASE_MIN).max(PHASE_MAX),
  score: z.number().int().min(SCORE_MIN),
  phaseCompleted: z.boolean(),
});

const StoredPlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  score: z.number().int().min(SCORE_MIN),
  phase: z.number().int().min(PHASE_MIN).max(PHASE_MAX),
  rounds: z.array(StoredRoundSchema),
});

const StoredGameSchema = z.object({
  id: z.string().min(1),
  startedAt: z.string().min(1),
  completedAt: z.string().min(1).nullable(),
  players: z.array(StoredPlayerSchema),
  rounds: z.number().int().min(0),
});

export function fromStorage(raw: unknown): Phase10Game | null {
  const parsed = StoredGameSchema.safeParse(raw);

  return parsed.success ? parsed.data : null;
}

export function toStorage(game: Phase10Game): Phase10Game {
  return game;
}
