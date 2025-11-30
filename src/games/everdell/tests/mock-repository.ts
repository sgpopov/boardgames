import { GameRepository } from "@core/domain/repositories/GameRepository";
import { EverdellGame } from "@games/everdell";

export class InMemoryEverdellRepo implements GameRepository<EverdellGame> {
  private game: EverdellGame | null;

  constructor(game: EverdellGame | null) {
    this.game = game;
  }

  async list(): Promise<EverdellGame[]> {
    return this.game ? [this.game] : [];
  }

  async getById(id: string): Promise<EverdellGame | undefined> {
    return this.game && this.game.id === id ? this.game : undefined;
  }

  async save(game: EverdellGame): Promise<void> {
    this.game = game;
  }

  async delete(id: string): Promise<void> {
    if (this.game && this.game.id === id) this.game = null;
  }
}
