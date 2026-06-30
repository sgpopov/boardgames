import {
  ArkNovaPlayer,
  ArkNovaWinners,
} from "@/games/ark-nova/application/entities/ArkNovaGame";

export type ScoringMethod = "official" | "alternative";

// The snapshotted VP for the given method (null until the player is scored).
export function victoryPointsFor(
  player: ArkNovaPlayer,
  method: ScoringMethod,
): number | null {
  return method === "official" ? player.officialVp : player.alternativeVp;
}

// Winners for one method: the highest VP wins; ties break on higher appeal;
// players still tied after that are joint winners. Unscored players are
// ignored. The two methods can diverge only at CP 0 (see ADR 0001) — for all
// other CP the VP offset between methods is a constant 100, so rankings match.
function winnersForMethod(
  players: ArkNovaPlayer[],
  method: ScoringMethod,
): string[] {
  const scored = players.filter(
    (player) => victoryPointsFor(player, method) !== null && player.appeal !== null,
  );

  if (scored.length === 0) {
    return [];
  }

  const maxVp = Math.max(
    ...scored.map((player) => victoryPointsFor(player, method) as number),
  );
  const topByVp = scored.filter(
    (player) => victoryPointsFor(player, method) === maxVp,
  );

  const maxAppeal = Math.max(...topByVp.map((player) => player.appeal as number));

  return topByVp
    .filter((player) => player.appeal === maxAppeal)
    .map((player) => player.id);
}

// Per-method winner ids (joint winners listed together). See ADR 0002 for why
// winners are snapshotted at completion rather than recomputed on read.
export function computeWinners(players: ArkNovaPlayer[]): ArkNovaWinners {
  return {
    official: winnersForMethod(players, "official"),
    alternative: winnersForMethod(players, "alternative"),
  };
}
