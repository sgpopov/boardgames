import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { EverdellGame, GameModule, ModuleComponent } from "@games/everdell";

import baseIconCards from "@games/everdell/assets/icons/icon-cards.png";
import baseIconProsperity from "@games/everdell/assets/icons/icon-prosperity.png";
import baseIconEvents from "@games/everdell/assets/icons/icon-events.png";
import baseIconJourney from "@games/everdell/assets/icons/icon-journey.png";
import baseIconTokens from "@games/everdell/assets/icons/icon-tokens.png";

const STORAGE_KEY = "everdell:games";

export class EverdellGameRepository implements GameRepository<EverdellGame> {
  private storage: StorageContract;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async fetchAll(): Promise<EverdellGame[]> {
    return this.storage.read<EverdellGame[]>(STORAGE_KEY, []);
  }

  async list(): Promise<EverdellGame[]> {
    const games = await this.fetchAll();

    return games.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  async getById(id: string): Promise<EverdellGame | undefined> {
    const games = await this.fetchAll();

    return games.find((g) => g.id === id);
  }

  async save(game: EverdellGame): Promise<void> {
    const games = await this.fetchAll();
    const idx = games.findIndex((g) => g.id === game.id);

    if (idx >= 0) {
      games[idx] = game;
    } else {
      games.push(game);
    }

    this.storage.write(STORAGE_KEY, games);
  }

  async delete(id: string): Promise<void> {
    const games = await this.fetchAll();

    this.storage.write(
      STORAGE_KEY,
      games.filter((g) => g.id !== id)
    );
  }

  modules(): GameModule[] {
    return [
      {
        type: "base",
        components: [
          {
            key: "cards",
            title: "Cards",
            icon: baseIconCards,
          },
          {
            key: "prosperity",
            title: "Prosperity",
            icon: baseIconProsperity,
          },
          {
            key: "events",
            title: "Events",
            icon: baseIconEvents,
          },
          {
            key: "journey",
            title: "Journey",
            icon: baseIconJourney,
          },
          {
            key: "tokens",
            title: "Point tokens",
            icon: baseIconTokens,
          },
        ],
      },
    ];
  }

  getModuleComponent(
    gameModule: string,
    moduleComponent: string
  ): { module: GameModule; component: ModuleComponent } {
    const selectedModule = this.modules().find((m) => m.type === gameModule)!;

    if (!selectedModule) {
      throw new Error(`Module ${gameModule} not found`);
    }

    const selectedModuleComponent = selectedModule.components.find(
      (component) => component.key === moduleComponent
    );

    if (!selectedModuleComponent) {
      throw new Error(
        `Component ${moduleComponent} not found in module ${gameModule}`
      );
    }

    return {
      module: selectedModule,
      component: selectedModuleComponent,
    };
  }
}
