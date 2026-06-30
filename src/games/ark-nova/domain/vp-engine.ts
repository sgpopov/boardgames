import {
  MAX_APPEAL,
  MAX_CONSERVATION_POINTS,
  MIN_APPEAL,
  MIN_CONSERVATION_POINTS,
} from "./constants";
import { ALTERNATIVE_BONUSES, OFFICIAL_THRESHOLDS } from "./scoring-tables";

export interface VictoryPoints {
  officialVp: number;
  alternativeVp: number;
}

function assertValidInputs(appeal: number, conservationPoints: number): void {
  if (!Number.isInteger(appeal) || appeal < MIN_APPEAL || appeal > MAX_APPEAL) {
    throw new RangeError(
      `appeal must be an integer between ${MIN_APPEAL} and ${MAX_APPEAL}`,
    );
  }

  if (
    !Number.isInteger(conservationPoints) ||
    conservationPoints < MIN_CONSERVATION_POINTS ||
    conservationPoints > MAX_CONSERVATION_POINTS
  ) {
    throw new RangeError(
      `conservationPoints must be an integer between ${MIN_CONSERVATION_POINTS} and ${MAX_CONSERVATION_POINTS}`,
    );
  }
}

// Official rulebook: VP = appeal − threshold(CP). May be negative.
export function officialVp(appeal: number, conservationPoints: number): number {
  assertValidInputs(appeal, conservationPoints);

  return appeal - OFFICIAL_THRESHOLDS[conservationPoints];
}

// "New Scoring" rulebook: VP = appeal + bonus(CP). May be negative.
export function alternativeVp(
  appeal: number,
  conservationPoints: number,
): number {
  assertValidInputs(appeal, conservationPoints);

  return appeal + ALTERNATIVE_BONUSES[conservationPoints];
}

// Single source of both formulas — powers the live draft preview and the
// persisted snapshot (see ADR 0002).
export function computeVictoryPoints(
  appeal: number,
  conservationPoints: number,
): VictoryPoints {
  // Validate once, then read both tables directly (avoids re-running the
  // input guard twice — this runs on every keystroke via the live preview).
  assertValidInputs(appeal, conservationPoints);

  return {
    officialVp: appeal - OFFICIAL_THRESHOLDS[conservationPoints],
    alternativeVp: appeal + ALTERNATIVE_BONUSES[conservationPoints],
  };
}
