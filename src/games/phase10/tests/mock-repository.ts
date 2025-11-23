import { GameRepository } from "@core/domain/repositories/GameRepository";
import { Phase10Game } from "../application/entities/Phase10Game";

export class InMemoryPhase10Repo implements GameRepository<Phase10Game> {
  private game: Phase10Game | null;

  constructor(game: Phase10Game | null) {
    this.game = game;
  }

  async list(): Promise<Phase10Game[]> {
    return this.game ? [this.game] : [];
  }

  async getById(id: string): Promise<Phase10Game | undefined> {
    return this.game && this.game.id === id ? this.game : undefined;
  }

  async save(game: Phase10Game): Promise<void> {
    this.game = game;
  }

  async delete(id: string): Promise<void> {
    if (this.game && this.game.id === id) this.game = null;
  }
}
