import { DomainError } from "./DomainError";

export class ValidationError extends DomainError {
  readonly details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}
