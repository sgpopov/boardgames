import { ArkNovaPlayer } from "@/games/ark-nova/application/entities/ArkNovaGame";
import {
  ScoringMethod,
  victoryPointsFor,
} from "@/games/ark-nova/application/winners";

export interface LeaderboardRow {
  player: ArkNovaPlayer;
  vp: number | null;
  isWinner: boolean;
}

// Orders players for a method's leaderboard: highest VP first, ties broken on
// higher appeal (mirroring the winner ranking), unscored players last. Winner
// ids come from the snapshot computed at completion so the highlight matches
// the recorded result exactly.
export function buildLeaderboard(
  players: ArkNovaPlayer[],
  method: ScoringMethod,
  winnerIds: string[],
): LeaderboardRow[] {
  const winners = new Set(winnerIds);

  return [...players]
    .sort((a, b) => {
      const aVp = victoryPointsFor(a, method);
      const bVp = victoryPointsFor(b, method);

      if (aVp === null && bVp === null) return 0;
      if (aVp === null) return 1;
      if (bVp === null) return -1;
      if (bVp !== aVp) return bVp - aVp;

      return (b.appeal ?? 0) - (a.appeal ?? 0);
    })
    .map((player) => ({
      player,
      vp: victoryPointsFor(player, method),
      isWinner: winners.has(player.id),
    }));
}
