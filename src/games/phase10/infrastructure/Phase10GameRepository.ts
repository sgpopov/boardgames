import { GameRepository } from "@core/domain/repositories/GameRepository";
import { LocalStorageWrapper } from "@core/infrastructure/storage/LocalStorage";
import { StorageContract } from "@core/infrastructure/storage/StorageInterface";
import { Phase10Game } from "@/games/phase10/application/entities/Phase10Game";

const STORAGE_KEY = "phase10:games";

export class Phase10GameRepository implements GameRepository<Phase10Game> {
  private storage: StorageContract;

  constructor(storage?: StorageContract) {
    this.storage = storage ?? new LocalStorageWrapper("boardgames");
  }

  async list(): Promise<Phase10Game[]> {
    return this.storage
      .read<Phase10Game[]>(STORAGE_KEY, [])
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
  }

  async getById(id: string): Promise<Phase10Game | undefined> {
    return (await this.list()).find((g) => g.id === id);
  }

  async save(game: Phase10Game): Promise<void> {
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

  getPhaseDetails(phaseNumber: number): string {
    const phases = [
      { phase: 1, name: "2 sets of 3" },
      { phase: 2, name: "1 set of 3 and 1 run of 4" },
      { phase: 3, name: "1 set of 4 and 1 run of 4" },
      { phase: 4, name: "1 run of 7" },
      { phase: 5, name: "1 run of 8" },
      { phase: 6, name: "1 run of 9" },
      { phase: 7, name: "2 sets of 4" },
      { phase: 8, name: "7 cards of a color" },
      { phase: 9, name: "1 set of 5 and 1 set of 2" },
      { phase: 10, name: "1 set of 5 and 1 set of 3" },
    ];

    const phase = phases.find((phase) => phase.phase === phaseNumber);

    return phase?.name ?? "Invalid phase number";
  }
}
