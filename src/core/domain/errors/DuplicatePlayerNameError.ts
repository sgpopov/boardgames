import { DomainError } from "./DomainError";

export class DuplicatePlayerNameError extends DomainError {
  constructor() {
    super("Player names must be unique.");
    this.name = "DuplicatePlayerNameError";
  }
}
