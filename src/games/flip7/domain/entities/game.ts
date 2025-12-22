import type { Flip7Player } from "./player";
import type { Flip7Round } from "./round";

export interface Flip7Game {
  id: string;
  createdAt: string; // ISO timestamp
  completedAt: string | null; // ISO timestamp or null when in-progress
  players: Flip7Player[];
  rounds: Flip7Round[];
  winnerId: string | null;
}

export type Flip7GameStatus = "in-progress" | "completed";

export function status(game: Pick<Flip7Game, "completedAt">): Flip7GameStatus {
  return game.completedAt ? "completed" : "in-progress";
}
