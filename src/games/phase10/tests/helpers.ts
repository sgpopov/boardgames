export const makePlayer = ({
  id,
  name,
  phase,
  score,
}: {
  id?: string;
  name?: string;
  phase?: number;
  score?: number;
} = {}) => {
  return {
    id: id ?? "batman",
    name: name ?? "Bruce Wayne",
    phase: phase ?? 1,
    score: score ?? 0,
    rounds: [],
  };
};

export const makeGame = ({
  id,
  players,
  startedAt,
  rounds,
}: {
  id?: string;
  startedAt?: string;
  players?: Array<ReturnType<typeof makePlayer>>;
  rounds?: number;
} = {}) => {
  return {
    id: id ?? "game1",
    startedAt: startedAt ?? new Date().toISOString(),
    completedAt: null,
    players: players ?? [makePlayer()],
    rounds: rounds ?? 0,
  };
};
