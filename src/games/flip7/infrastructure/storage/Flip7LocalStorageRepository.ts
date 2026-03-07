import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import type { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import type { Flip7Game } from "@games/flip7/domain/entities/game";
import {
  fromStorage,
  toStorage,
} from "@games/flip7/infrastructure/mappers/dtoMappers";

const STORAGE_KEY = "flip7:games";

export class Flip7LocalStorageRepository implements GameRepository<Flip7Game> {
  private storage: StorageContract;
  private cache: Flip7Game[] | null = null;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async readAllRaw(): Promise<Flip7Game[]> {
    if (this.cache) {
      return [...this.cache];
    }

    const raw = this.storage.read<unknown[]>(STORAGE_KEY, []);
    const games: Flip7Game[] = [];

    for (const item of raw) {
      const game = fromStorage(item);

      if (game) {
        games.push(game);
      }
    }

    this.cache = games;

    return [...games];
  }

  async list(): Promise<Flip7Game[]> {
    const games = await this.readAllRaw();

    return [...games].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getById(id: string): Promise<Flip7Game | undefined> {
    const games = await this.readAllRaw();

    return games.find((g) => g.id === id);
  }

  async save(game: Flip7Game): Promise<void> {
    const games = await this.readAllRaw();
    const idx = games.findIndex((g) => g.id === game.id);
    const nextGames = [...games];
    const storedGame = toStorage(game);

    if (idx >= 0) {
      nextGames[idx] = storedGame;
    } else {
      nextGames.push(storedGame);
    }

    this.storage.write(STORAGE_KEY, nextGames);
    this.cache = nextGames;
  }

  async delete(id: string): Promise<void> {
    const games = await this.readAllRaw();
    const nextGames = games.filter((g) => g.id !== id);

    this.storage.write(STORAGE_KEY, nextGames);
    this.cache = nextGames;
  }
}
