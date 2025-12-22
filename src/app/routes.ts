export const routes = {
  phase10: {
    list: () => `/games/phase10`,
    newGame: () => `/games/phase10/new`,
    gameDetails: (id: string) => `/games/phase10/game?id=${id}`,
    scoreRound: (id: string) => `/games/phase10/round-score?gameId=${id}`,
  },
  everdell: {
    list: () => `/games/everdell`,
    newGame: () => `/games/everdell/create-game`,
    gameDetails: (id: string) => `/games/everdell/game?id=${id}`,
    score: (id: string, component: string) =>
      `/games/everdell/add-scores?gameId=${id}&component=${component}`,
  },
  flip7: {
    list: () => `/games/flip7`,
    newGame: () => `/games/flip7/create-game`,
    gameDetails: (id: string) => `/games/flip7/game?id=${id}`,
    score: (id: string) => `/games/flip7/add-scores?gameId=${id}`,
  },
};
