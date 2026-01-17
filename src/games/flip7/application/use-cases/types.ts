import type {
  Flip7Game,
  Flip7GameStatus,
} from "@games/flip7/domain/entities/game";
import type { Flip7PlayerScore } from "@games/flip7/domain/entities/round";

export interface CreateGameInput {
  name: string;
}

export interface CreateGameOutput {
  id: string;
}

export interface GameSummary {
  id: string;
  createdAt: string;
  completedAt: string | null;
  playerCount: number;
  roundsCount: number;
  status: Flip7GameStatus;
  winnerId: string | null;
}

export interface AddRoundInput {
  gameId: string;
  scores: Flip7PlayerScore[];
}

export interface AddRoundOutput {
  game: Flip7Game;
  status: Flip7GameStatus;
  completedAt?: string | null;
  winnerId?: string | null;
}
