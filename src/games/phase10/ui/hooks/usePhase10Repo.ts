"use client";

import { useMemo } from "react";
import { getPhase10Repository } from "@/games/phase10/composition/repository";

export function usePhase10Repo() {
  const repo = useMemo(() => getPhase10Repository(), []);

  return repo;
}
