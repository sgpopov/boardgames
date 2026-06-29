import { GameRepository } from "@core/domain/repositories/GameRepository";
import { ArkNovaGame } from "@/games/ark-nova/application/entities/ArkNovaGame";

export class InMemoryArkNovaRepo implements GameRepository<ArkNovaGame> {
  private game: ArkNovaGame | null;

  constructor(game: ArkNovaGame | null) {
    this.game = game;
  }

  async list(): Promise<ArkNovaGame[]> {
    return this.game ? [this.game] : [];
  }

  async getById(id: string): Promise<ArkNovaGame | undefined> {
    return this.game && this.game.id === id ? this.game : undefined;
  }

  async save(game: ArkNovaGame): Promise<void> {
    this.game = game;
  }

  async delete(id: string): Promise<void> {
    if (this.game && this.game.id === id) this.game = null;
  }
}
