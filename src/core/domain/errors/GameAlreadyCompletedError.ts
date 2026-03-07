import { DomainError } from "./DomainError";

export class GameAlreadyCompletedError extends DomainError {
  constructor() {
    super("Game already completed");
    this.name = "GameAlreadyCompletedError";
  }
}
