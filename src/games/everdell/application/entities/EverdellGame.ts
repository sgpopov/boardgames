import { BaseGame } from "@core/domain/entities/Game";
import { Character } from "@/games/everdell/domain/constants";

export type BaseGameScores = {
  cards: number;
  prosperity: number;
  events: number;
  journey: number;
  tokens: number;
};

export interface EverdellPlayer {
  id: string;
  name: string;
  character: Character;
  scores: {
    base: BaseGameScores;
  };
  total: number;
}

export interface EverdellGame extends BaseGame<EverdellPlayer> {
  id: string;
  startedAt: string;
  completedAt: string | null;
  players: EverdellPlayer[];
}
