import { BaseGame } from "@core/domain/entities/Game";

export interface Phase10Round {
  phase: number;
  score: number;
  phaseCompleted: boolean;
}

export interface Phase10Player {
  id: string;
  name: string;
  score: number;
  phase: number; // current phase number (1-10)
  rounds: Phase10Round[];
}

export interface Phase10Game extends BaseGame<Phase10Player> {
  id: string;
  startedAt: string;
  completedAt: string | null;
  players: Phase10Player[];
  rounds: number; // total number of rounds played
}
