import { EverdellGameRepository } from "@/games/everdell/infrastructure/EverdellGameRepository";

let repository: EverdellGameRepository | null = null;

export function getEverdellRepository(): EverdellGameRepository {
  if (!repository) {
    repository = new EverdellGameRepository();
  }

  return repository;
}
