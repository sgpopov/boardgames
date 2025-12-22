export interface Flip7PlayerScore {
  playerId: string;
  score: number;
}

export interface Flip7Round {
  index: number;
  scores: Flip7PlayerScore[];
  savedAt: string;
}
