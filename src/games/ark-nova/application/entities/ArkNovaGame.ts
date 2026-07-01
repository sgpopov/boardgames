import { BaseGame } from "@core/domain/entities/Game";
import { AnimalIcon, PlayerColor } from "@/games/ark-nova/domain/constants";

export interface ArkNovaPlayer {
  id: string;
  name: string;
  // Chosen at creation, unique per game, fixed for the life of the game.
  color: PlayerColor;
  // Auto-assigned at random at creation, independent of color.
  icon: AnimalIcon;
  // Raw end-of-game inputs. Unset until the scoring phase (see PRD #29 phase 2).
  appeal: number | null;
  conservationPoints: number | null;
  // Snapshotted Victory Points, computed from the raw inputs (see ADR 0002).
  officialVp: number | null;
  alternativeVp: number | null;
}

// Winners are stored per scoring method as lists of player ids (joint winners).
export interface ArkNovaWinners {
  official: string[];
  alternative: string[];
}

export interface ArkNovaGame extends BaseGame<ArkNovaPlayer> {
  id: string;
  startedAt: string;
  completedAt: string | null;
  players: ArkNovaPlayer[];
  winners: ArkNovaWinners | null;
}
