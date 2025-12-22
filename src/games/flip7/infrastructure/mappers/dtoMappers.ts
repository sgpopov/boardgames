import { Flip7GameSchema } from "@games/flip7/domain/validation/schemas";
import type { Flip7Game } from "@games/flip7/domain/entities/game";

export function fromStorage(raw: unknown): Flip7Game | null {
  const parsed = Flip7GameSchema.safeParse(raw);

  return parsed.success ? parsed.data : null;
}

export function toStorage(game: Flip7Game): Flip7Game {
  return game;
}
