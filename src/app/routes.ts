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
  },
};
