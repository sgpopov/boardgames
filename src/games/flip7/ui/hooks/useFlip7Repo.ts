"use client";
import { useMemo } from "react";
import { Flip7LocalStorageRepository } from "@games/flip7/infrastructure/storage/Flip7LocalStorageRepository";

export function useFlip7Repo() {
  const repo = useMemo(() => new Flip7LocalStorageRepository(), []);

  return repo;
}
