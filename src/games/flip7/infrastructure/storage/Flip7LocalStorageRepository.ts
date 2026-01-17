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

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async readAllRaw(): Promise<Flip7Game[]> {
    const raw = this.storage.read<unknown[]>(STORAGE_KEY, []);
    const games: Flip7Game[] = [];

    for (const item of raw) {
      const game = fromStorage(item);

      if (game) {
        games.push(game);
      }
    }

    return games;
  }

  async list(): Promise<Flip7Game[]> {
    const games = await this.readAllRaw();

    return games.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<Flip7Game | undefined> {
    const games = await this.readAllRaw();

    return games.find((g) => g.id === id);
  }

  async save(game: Flip7Game): Promise<void> {
    const games = await this.readAllRaw();
    const idx = games.findIndex((g) => g.id === game.id);

    if (idx >= 0) {
      games[idx] = toStorage(game);
    } else {
      games.push(toStorage(game));
    }

    this.storage.write(STORAGE_KEY, games);
  }

  async delete(id: string): Promise<void> {
    const games = await this.readAllRaw();

    this.storage.write(
      STORAGE_KEY,
      games.filter((g) => g.id !== id)
    );
  }
}
