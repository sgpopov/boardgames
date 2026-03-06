import { DomainError } from "./DomainError";

export class PlayersLimitExceededError extends DomainError {
  readonly maxAllowed: number;
  readonly attempted: number;

  constructor(maxAllowed: number, attempted: number) {
    super(
      `Maximum number of players exceeded. You can add up to ${maxAllowed} players`,
    );
    this.name = "PlayersLimitExceededError";
    this.maxAllowed = maxAllowed;
    this.attempted = attempted;
  }
}
