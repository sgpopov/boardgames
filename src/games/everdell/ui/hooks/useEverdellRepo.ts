"use client";

import { useMemo } from "react";
import { EverdellGameRepository } from "@games/everdell";

export function useEverdellRepo() {
  const repo = useMemo(() => new EverdellGameRepository(), []);

  return repo;
}
