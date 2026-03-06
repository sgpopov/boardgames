import { Phase10GameRepository } from "@/games/phase10/infrastructure/Phase10GameRepository";

let repository: Phase10GameRepository | null = null;

export function getPhase10Repository(): Phase10GameRepository {
  if (!repository) {
    repository = new Phase10GameRepository();
  }

  return repository;
}
