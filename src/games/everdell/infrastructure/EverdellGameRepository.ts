import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { EverdellGame } from "@games/everdell/application/entities/EverdellGame";

const STORAGE_KEY = "everdell:games";

export class EverdellGameRepository implements GameRepository<EverdellGame> {
  private storage: StorageContract;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  async list(): Promise<EverdellGame[]> {
    return this.storage
      .read<EverdellGame[]>(STORAGE_KEY, [])
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
  }

  async getById(id: string): Promise<EverdellGame | undefined> {
    return (await this.list()).find((g) => g.id === id);
  }

  async save(game: EverdellGame): Promise<void> {
    const games = await this.list();
    const idx = games.findIndex((g) => g.id === game.id);

    if (idx >= 0) {
      games[idx] = game;
    } else {
      games.push(game);
    }

    this.storage.write(STORAGE_KEY, games);
  }

  async delete(id: string): Promise<void> {
    const games = await this.list();

    this.storage.write(
      STORAGE_KEY,
      games.filter((g) => g.id !== id)
    );
  }
}
