import { EverdellGame, GameModule, ModuleComponent } from "@games/everdell";

type ScoreRow = {
  key: string;
  title: string;
  icon?: ModuleComponent["icon"];
  scores: Array<{
    key: string;
    playerId: string;
    value: number;
  }>;
};

export const buildScoreRows = (
  modules: GameModule[],
  game: EverdellGame
): ScoreRow[] => {
  return modules
    .map((module) =>
      module.components.map((moduleComponent) => ({
        key: `${module.type}_${moduleComponent.key}`,
        title: moduleComponent.title,
        icon: moduleComponent.icon,
        scores: game.players.map((player) => ({
          key: `${module.type}_${moduleComponent.key}_${player.id}`,
          playerId: player.id,
          value:
            (
              player.scores as unknown as Record<string, Record<string, number>>
            )?.[module.type]?.[moduleComponent.key] ?? 0,
        })),
      }))
    )
    .flat();
};
