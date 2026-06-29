import { BaseGame } from "@core/domain/entities/Game";

export interface ArkNovaPlayer {
  id: string;
  name: string;
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
