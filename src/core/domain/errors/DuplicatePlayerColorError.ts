import { DomainError } from "./DomainError";

export class DuplicatePlayerColorError extends DomainError {
  constructor() {
    super("Player colors must be unique.");
    this.name = "DuplicatePlayerColorError";
  }
}
