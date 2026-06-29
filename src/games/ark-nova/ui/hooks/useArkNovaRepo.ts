"use client";

import { useMemo } from "react";
import { getArkNovaRepository } from "@/games/ark-nova/composition/repository";

export function useArkNovaRepo() {
  const repo = useMemo(() => getArkNovaRepository(), []);

  return repo;
}
