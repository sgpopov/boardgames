"use client";

import { useMemo } from "react";
import { EverdellGameRepository } from "@/games/everdell/infrastructure/EverdellGameRepository";

export function useEverdellRepo() {
  const repo = useMemo(() => new EverdellGameRepository(), []);

  return repo;
}
