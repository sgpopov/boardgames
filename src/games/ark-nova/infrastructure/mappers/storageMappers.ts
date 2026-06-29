import { z } from "zod";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";

const PlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  appeal: z.number().int().nullable(),
  conservationPoints: z.number().int().nullable(),
  officialVp: z.number().int().nullable(),
  alternativeVp: z.number().int().nullable(),
});

const WinnersSchema = z.object({
  official: z.array(z.string()),
  alternative: z.array(z.string()),
});

const GameSchema = z.object({
  id: z.string().min(1),
  startedAt: z.string().min(1),
  completedAt: z.string().min(1).nullable(),
  players: z.array(PlayerSchema),
  winners: WinnersSchema.nullable(),
});

export function fromStorage(raw: unknown): ArkNovaGame | null {
  const parsed = GameSchema.safeParse(raw);

  return parsed.success ? parsed.data : null;
}

export function toStorage(game: ArkNovaGame): ArkNovaGame {
  return game;
}
