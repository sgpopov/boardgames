"use client";
import { useMemo } from "react";
import { getFlip7Repository } from "@games/flip7/composition/repository";

export function useFlip7Repo() {
  const repo = useMemo(() => getFlip7Repository(), []);

  return repo;
}
