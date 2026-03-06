import { z } from "zod";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";

const BaseScoresSchema = z.object({
  cards: z.number().int().min(0),
  prosperity: z.number().int().min(0),
  events: z.number().int().min(0),
  journey: z.number().int().min(0),
  tokens: z.number().int().min(0),
});

const PlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  total: z.number().int().min(0),
  scores: z.object({
    base: BaseScoresSchema,
  }),
});

const GameSchema = z.object({
  id: z.string().min(1),
  startedAt: z.string().min(1),
  completedAt: z.string().min(1).nullable(),
  players: z.array(PlayerSchema),
});

export function fromStorage(raw: unknown): EverdellGame | null {
  const parsed = GameSchema.safeParse(raw);

  return parsed.success ? parsed.data : null;
}

export function toStorage(game: EverdellGame): EverdellGame {
  return game;
}
