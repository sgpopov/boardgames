import { DomainError } from "./DomainError";

export class GameNotFoundError extends DomainError {
  constructor() {
    super("Game not found");
    this.name = "GameNotFoundError";
  }
}
