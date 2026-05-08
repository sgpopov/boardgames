import { Phase10Player } from "@/games/phase10/application/entities/Phase10Game";
import { WINNER_PHASE } from "@/games/phase10/domain/constants";

/**
 * Returns all players that are considered winners:
 * - Must have reached winner sentinel phase (completed phase 10)
 * - Must have the lowest total score among all completed players (ties produce multiple winners)
 */
export function getWinners(players: Phase10Player[]): Phase10Player[] {
  const completed = players.filter((p) => p.phase === WINNER_PHASE);

  if (completed.length === 0) {
    return [];
  }

  const minScore = Math.min(...completed.map((p) => p.score));

  return completed.filter((p) => p.score === minScore);
}

/**
 * Sort order for a completed game:
 * 1. Winners first
 * 2. Then by phase descending (highest progress)
 * 3. Then by score ascending (lowest score = better)
 */
export function sortPlayersForCompletedGame(
  players: Phase10Player[],
  winners: Phase10Player[],
): Phase10Player[] {
  const winnerIds = new Set(winners.map((w) => w.id));

  return [...players].sort((a, b) => {
    const aWinner = winnerIds.has(a.id) ? 0 : 1;
    const bWinner = winnerIds.has(b.id) ? 0 : 1;

    if (aWinner !== bWinner) return aWinner - bWinner;
    if (b.phase !== a.phase) return b.phase - a.phase;
    return a.score - b.score;
  });
}
