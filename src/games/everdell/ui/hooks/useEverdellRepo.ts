"use client";

import { useMemo } from "react";
import { getEverdellRepository } from "@/games/everdell/composition/repository";

export function useEverdellRepo() {
  const repo = useMemo(() => getEverdellRepository(), []);

  return repo;
}
