import { BaseGame } from "@core/domain/entities/Game";
import { Player } from "@core/domain/entities/Player";

export interface Phase10Round {
  phase: number;
  score: number;
  phaseCompleted: boolean;
}

export interface Phase10Player extends Player {
  score: number;
  phase: number; // current phase number (1-10)
  rounds: Phase10Round[];
}

export interface Phase10Game extends BaseGame<Phase10Player> {
  rounds: number; // total number of rounds played
}
