export interface BaseGame<PlayerType = unknown> {
  id: string;
  startedAt: string;
  completedAt: string | null;
  players: PlayerType[];
}
