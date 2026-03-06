import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { EverdellGame } from "@/games/everdell/application/entities/EverdellGame";
import {
  GameModule,
  ModuleComponent,
} from "@/games/everdell/application/entities/GameModules";
import {
  fromStorage,
  toStorage,
} from "@/games/everdell/infrastructure/mappers/storageMappers";

import baseIconCards from "@games/everdell/assets/icons/icon-cards.png";
import baseIconProsperity from "@games/everdell/assets/icons/icon-prosperity.png";
import baseIconEvents from "@games/everdell/assets/icons/icon-events.png";
import baseIconJourney from "@games/everdell/assets/icons/icon-journey.png";
import baseIconTokens from "@games/everdell/assets/icons/icon-tokens.png";

const STORAGE_KEY = "everdell:games";

export class EverdellGameRepository implements GameRepository<EverdellGame> {
  private storage: StorageContract;
  private cache: EverdellGame[] | null = null;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async fetchAll(): Promise<EverdellGame[]> {
    if (this.cache) {
      return [...this.cache];
    }

    const raw = this.storage.read<unknown[]>(STORAGE_KEY, []);
    const games: EverdellGame[] = [];

    for (const item of raw) {
      const game = fromStorage(item);

      if (game) {
        games.push(game);
      }
    }

    this.cache = games;

    return [...games];
  }

  async list(): Promise<EverdellGame[]> {
    const games = await this.fetchAll();

    return [...games].sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }

  async getById(id: string): Promise<EverdellGame | undefined> {
    const games = await this.fetchAll();

    return games.find((g) => g.id === id);
  }

  async save(game: EverdellGame): Promise<void> {
    const games = await this.fetchAll();
    const idx = games.findIndex((g) => g.id === game.id);
    const storedGame = toStorage(game);
    const nextGames = [...games];

    if (idx >= 0) {
      nextGames[idx] = storedGame;
    } else {
      nextGames.push(storedGame);
    }

    this.storage.write(STORAGE_KEY, nextGames);
    this.cache = nextGames;
  }

  async delete(id: string): Promise<void> {
    const games = await this.fetchAll();
    const nextGames = games.filter((g) => g.id !== id);

    this.storage.write(STORAGE_KEY, nextGames);
    this.cache = nextGames;
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
    moduleComponent: string,
  ): { module: GameModule; component: ModuleComponent } {
    const selectedModule = this.modules().find((m) => m.type === gameModule)!;

    if (!selectedModule) {
      throw new Error(`Module ${gameModule} not found`);
    }

    const selectedModuleComponent = selectedModule.components.find(
      (component) => component.key === moduleComponent,
    );

    if (!selectedModuleComponent) {
      throw new Error(
        `Component ${moduleComponent} not found in module ${gameModule}`,
      );
    }

    return {
      module: selectedModule,
      component: selectedModuleComponent,
    };
  }
}
