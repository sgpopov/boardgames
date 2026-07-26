import { DomainError } from "./DomainError";

export class DuplicatePlayerCharacterError extends DomainError {
  constructor() {
    super("Player characters must be unique.");
    this.name = "DuplicatePlayerCharacterError";
  }
}
