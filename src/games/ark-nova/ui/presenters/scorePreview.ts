import {
  MAX_APPEAL,
  MAX_CONSERVATION_POINTS,
  MIN_APPEAL,
  MIN_CONSERVATION_POINTS,
} from "@/games/ark-nova/domain/constants";
import {
  computeVictoryPoints,
  VictoryPoints,
} from "@/games/ark-nova/domain/vp-engine";

function parseInRange(value: string, min: number, max: number): number | null {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);

  if (parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

// Computes the live VP preview for a single row, returning null while the
// inputs are incomplete or out of range (so the engine is never called with
// invalid values).
export function computeScorePreview(
  appeal: string,
  conservationPoints: string,
): VictoryPoints | null {
  const parsedAppeal = parseInRange(appeal, MIN_APPEAL, MAX_APPEAL);
  const parsedCp = parseInRange(
    conservationPoints,
    MIN_CONSERVATION_POINTS,
    MAX_CONSERVATION_POINTS,
  );

  if (parsedAppeal === null || parsedCp === null) {
    return null;
  }

  return computeVictoryPoints(parsedAppeal, parsedCp);
}
