import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";
import {
  fromStorage,
  toStorage,
} from "@/games/ark-nova/infrastructure/mappers/storageMappers";

const STORAGE_KEY = "ark-nova:games";

export class ArkNovaGameRepository implements GameRepository<ArkNovaGame> {
  private storage: StorageContract;
  private cache: ArkNovaGame[] | null = null;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async fetchAll(): Promise<ArkNovaGame[]> {
    if (this.cache) {
      return [...this.cache];
    }

    const raw = this.storage.read<unknown[]>(STORAGE_KEY, []);
    const games: ArkNovaGame[] = [];

    for (const item of raw) {
      const game = fromStorage(item);

      if (game) {
        games.push(game);
      }
    }

    this.cache = games;

    return [...games];
  }

  async list(): Promise<ArkNovaGame[]> {
    const games = await this.fetchAll();

    return [...games].sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }

  async getById(id: string): Promise<ArkNovaGame | undefined> {
    const games = await this.fetchAll();

    return games.find((g) => g.id === id);
  }

  async save(game: ArkNovaGame): Promise<void> {
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
}
