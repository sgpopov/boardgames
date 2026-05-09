import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";
import {
  fromStorage,
  toStorage,
} from "@/games/phase10/infrastructure/mappers/storageMappers";
import { WINNER_PHASE } from "@/games/phase10/domain/constants";

const STORAGE_KEY = "phase10:games";

export class Phase10GameRepository implements GameRepository<Phase10Game> {
  private storage: StorageContract;
  private cache: Phase10Game[] | null = null;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  private async readAllRaw(): Promise<Phase10Game[]> {
    if (this.cache) {
      return [...this.cache];
    }

    const raw = this.storage.read<unknown[]>(STORAGE_KEY, []);
    const games: Phase10Game[] = [];

    for (const item of raw) {
      const game = fromStorage(item);

      if (game) {
        games.push(game);
      }
    }

    this.cache = games;

    return [...games];
  }

  async list(): Promise<Phase10Game[]> {
    const games = await this.readAllRaw();

    return [...games].sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }

  async getById(id: string): Promise<Phase10Game | undefined> {
    const games = await this.readAllRaw();

    return games.find((g) => g.id === id);
  }

  async save(game: Phase10Game): Promise<void> {
    const games = await this.readAllRaw();
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
    const games = await this.readAllRaw();
    const nextGames = games.filter((g) => g.id !== id);

    this.storage.write(STORAGE_KEY, nextGames);
    this.cache = nextGames;
  }

  getPhaseDetails(phaseNumber: number): string {
    const phases: Record<number, string> = {
      1: "2 sets of 3",
      2: "1 set of 3 and 1 run of 4",
      3: "1 set of 4 and 1 run of 4",
      4: "1 run of 7",
      5: "1 run of 8",
      6: "1 run of 9",
      7: "2 sets of 4",
      8: "7 cards of a color",
      9: "1 set of 5 and 1 set of 2",
      10: "1 set of 5 and 1 set of 3",
      [WINNER_PHASE]: "Completed phase 10",
    };

    return phases[phaseNumber] ?? "Invalid phase number";
  }
}
