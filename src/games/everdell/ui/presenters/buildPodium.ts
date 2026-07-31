import {
  EverdellGame,
  EverdellPlayer,
} from "@/games/everdell/application/entities/EverdellGame";

export type Medal = "gold" | "silver" | "bronze" | "fourth";

export interface PodiumRow {
  player: EverdellPlayer;
  rank: number;
  medal: Medal;

  total: number;
  isWinner: boolean;
}

const MEDAL_BY_RANK: Record<number, Medal> = {
  1: "gold",
  2: "silver",
  3: "bronze",
  4: "fourth",
};

// Competition ranking: players sharing a total share a rank, and the rank
// that follows a tie skips accordingly (52, 52, 51, 44 -> 1, 1, 3, 4).
export function buildPodium(game: EverdellGame): PodiumRow[] {
  return [...game.players]
    .map((player) => {
      const rank =
        1 + game.players.filter((p) => p.total > player.total).length;

      return {
        player,
        rank,
        total: player.total,
        medal: MEDAL_BY_RANK[rank],
        isWinner: rank === 1,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.player.name.localeCompare(b.player.name));
}
