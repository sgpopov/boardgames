"use client";

import { useMemo } from "react";
import { Phase10GameRepository } from "@/games/phase10/infrastructure/Phase10GameRepository";

export function usePhase10Repo() {
  const repo = useMemo(() => new Phase10GameRepository(), []);

  return repo;
}
