import { ArkNovaGameRepository } from "@/games/ark-nova/infrastructure/ArkNovaGameRepository";

let repository: ArkNovaGameRepository | null = null;

export function getArkNovaRepository(): ArkNovaGameRepository {
  if (!repository) {
    repository = new ArkNovaGameRepository();
  }

  return repository;
}
