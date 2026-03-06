import { DomainError } from "@core/domain/errors/DomainError";
import { DuplicatePlayerNameError } from "@core/domain/errors/DuplicatePlayerNameError";
import { GameAlreadyCompletedError } from "@core/domain/errors/GameAlreadyCompletedError";
import { GameNotFoundError } from "@core/domain/errors/GameNotFoundError";
import { PlayersLimitExceededError } from "@core/domain/errors/PlayersLimitExceededError";
import { ValidationError } from "@core/domain/errors/ValidationError";
import { StorageWriteError } from "@core/infrastructure/storage/StorageWriteError";

export function mapErrorToMessage(error: unknown, fallback: string): string {
  if (error instanceof ValidationError) {
    return error.details ? `${error.message}: ${error.details}` : error.message;
  }

  if (
    error instanceof GameNotFoundError ||
    error instanceof DuplicatePlayerNameError ||
    error instanceof PlayersLimitExceededError ||
    error instanceof GameAlreadyCompletedError
  ) {
    return error.message;
  }

  if (error instanceof StorageWriteError) {
    return "Unable to save game data to browser storage.";
  }

  if (error instanceof DomainError) {
    return error.message;
  }

  return fallback;
}
