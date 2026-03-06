import { Flip7LocalStorageRepository } from "@games/flip7/infrastructure/storage/Flip7LocalStorageRepository";

let repository: Flip7LocalStorageRepository | null = null;

export function getFlip7Repository(): Flip7LocalStorageRepository {
  if (!repository) {
    repository = new Flip7LocalStorageRepository();
  }

  return repository;
}
